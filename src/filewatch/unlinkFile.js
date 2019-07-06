import fse from 'fs-extra';
import addFile from './addFile';
import { isStaticRes } from "../util/util"
const path = require('path');

/**
 * 删除一个文件的处理，按照如下规则
 * 1. isFileIgnore为true的直接忽略
 * 2. 如果删除的是一个目录，直接删除目标目录
 * 3. 删除的是图片文件： xx@3x.png，xx@2x.png，xx.png 
 *      如果删除的 xx@3x.png，删除目标文件；
 *              查找是否有 xx@2x.png，如果有，调用 addFile(filePath);
 *              如果没有，查找是否有 xx@1x.png，如果有，调用 addFile(filePath);
 *              如果没有，查找是否有 xx.png，如果有，调用 addFile(filePath);
 *      
 *      如果删除的 xx@2x.png，
 *              查找当前目录下是否有 xx@3x.png，如果有，直接返回。
 *              如果没有，删除目标文件，查找当前目录下是否有 xx@1x.png,如果有，调用 addFile(filePath)
 *              如果没有，删除目标文件，查找当前目录下是否有 xx.png,如果有，调用 addFile(filePath)
 * 
 *     如果删除的是 xx@1x.png
 *              查找当前目录下是否有 xx@2x.png 或 xx@3x.png ，如果有，直接返回。
 *              如果没有，删除目标文件，查找当前目录下是否有 xx.png,如果有，调用 addFile(filePath)
 * 
 *      如果删除的是 xx.png
 *              查找当前目录下是否有 xx@2x.png 或 xx@3x.png 或 xx@1x，如果有，直接返回。
 *              如果没有，删除目标文件
 * 
 * 4. 如果删除的 [fileName].wx.js，删除对应的目标文件（可能生成多个文件）; 看没有 [fileName].js; 调用 addFile(filePath) 
 * 5. 其他非js文件，直接删除
 * 6. 其他 js文件: [fileName].js，
 *      如果存在 [fileName].wx.js，直接返回。
 *      删除目标文件 
 *          [fileName].json, [fileName].js, 
 *          [fileName].wxml, [fileName].wxss, 
 *          [fileName].comp.js, [fileName]Template.wxml
 *          [fileName]ICNPxxx.js, [fileName]ICNPxxx.json
 *          [fileName]ICNPxxx.wxml, [fileName]ICNPxxx.wxss
 * 
 * @param filePath
 * @returns {Promise<void>}
 */

export default async function unlinkFile(filePath) {
    const { INPUT_DIR, OUT_DIR, configObj } = global.execArgs;

    const relativePath = filePath.replace(INPUT_DIR, '').replace(/\\/g, '/').substring(1);

    const srcPath = filePath;
    const targetPath = filePath.replace(INPUT_DIR, OUT_DIR);

    // 如果文件需要忽略， 则不处理
    if (typeof configObj.isFileIgnore === "function" && configObj.isFileIgnore(relativePath)) {
        return [];
    }

    if (isStaticRes(srcPath)) {
        if (srcPath.includes('@3x')) {
            //删除目标文件，查找是否存在 [fileName]@2x [fileName]@1x [fileName]
            await resolveStaticRes(srcPath, targetPath, 3);
        } else if (srcPath.includes('@2x')) {
            //查找是否有 [fileName]@3x,如果有返回；
            //删除目标文件，查找是否有 [fileName]@1x [fileName] 
            await resolveStaticRes(srcPath, targetPath, 2);
        } else if (srcPath.includes('@1x')) {
            //查找是否有 [fileName]@3x/查找是否有 [fileName]@2x,如果有返回；
            //删除目标文件，查找是否有 [fileName] 
            await resolveStaticRes(srcPath, targetPath, 1);
        } else {
            //查找是否有 [fileName]@3x/查找是否有 [fileName]@2x,如果有返回；
            //删除目标文件
            await resolveStaticRes(srcPath, targetPath, 0);
        }
    } else if (srcPath.endsWith('.js')) {
        
        let allFiles = [];
        if (srcPath.endsWith('.wx.js')) {
            //删除的是 .wx.js
            allFiles = await getFiles(targetPath, '.wx.js');
            await removeFiles(allFiles);
            if (fse.existsSync(srcPath.replace('.wx.js', '.js'))) {
                //是否存在同名 .js 文件
                await addFile(srcPath.replace('.wx.js', '.js'));
            }
        } else {
            //删除的是 .js
            const wxsrcPath = srcPath.replace('.js', '.wx.js');
            if (fse.existsSync(wxsrcPath)) {
                //如果存在同名的 .wx.js
                return [];
            } else {
                allFiles = await getFiles(targetPath, '.js');
                await removeFiles(allFiles);
            }
        }
    } else {
        await fse.remove(targetPath).catch(err => console.log(err));
    }
}

async function resolveStaticRes(srcPath, targetPath, num) {
    let srcIndex = srcPath.lastIndexOf('@' + num + 'x'); //防止路径中出现 @nx
    if (num === 3 || num === 2 || num === 1) {
        let index = targetPath.lastIndexOf('@' + num + 'x');

        targetPath = targetPath.substring(0, index) + targetPath.substring(index + 3);
    }

    let leftArry = [];
    let rightArry = [];

    while (num < 3) {
        leftArry.push(++num);
    }
    while (num > 0) {
        rightArry.push(--num);
    }

    if (!existsHighPriority(srcPath, leftArry, srcIndex)) {
        //不存在更高优先级图片资源:删除图片资源，找更低优先级的图片资源
        await fse.remove(targetPath).catch(err => console.log(err));
        for (let i of rightArry) {
            let srcFile;
            if (i !== 0) {
                srcFile = srcPath.substring(0, srcIndex) + '@' + i + 'x' + srcPath.substring(srcIndex + 3);
            } else {
                srcFile = srcPath.substring(0, srcIndex) + srcPath.substring(srcIndex + 3);
            }
            if (fse.existsSync(srcFile)) {
                addFile(srcFile);
                return;
            }
        }
    } else {
        return;
    }
}


function existsHighPriority(srcPath, leftArry, srcIndex) {
    for (let i of leftArry) {
        let srcFile;
        if (i !== 0) {
            srcFile = srcPath.substring(0, srcIndex) + '@' + i + 'x' + srcPath.substring(srcIndex + 3);
        } else {
            srcFile = srcPath.substring(0, srcIndex) + srcPath.substring(srcIndex + 3);
        }
        if (fse.existsSync(srcFile)) {
            return true;
        }
    }
    return false;

}


async function removeFiles(files) {
    //remove allFiles
    files.forEach(async (filePath) => {
        await fse.remove(filePath).catch((err) => {
            console.log(err);
        });
    });
}

async function getFiles(targetPath, suffix) {
    const targetdir = path.dirname(targetPath);
    const noSuffix = targetPath.substring(0, targetPath.lastIndexOf(suffix));
    const suffixs = ['.json', '.wxss', '.js', '.comp.js', '.wxml'];
    const allFiles = suffixs.map((item) => {
        return noSuffix + item;
    });
    allFiles.push(noSuffix + 'Template.wxml');
    await fse.readdir(targetdir).then((files) => {
        files.forEach((fileName) => {
            if (fileName.indexOf(noSuffix.substring(noSuffix.lastIndexOf('/') + 1) + 'ICNP') === 0) {
                allFiles.push(path.resolve(targetdir, fileName));
            }

        });
    });
    return allFiles;
}