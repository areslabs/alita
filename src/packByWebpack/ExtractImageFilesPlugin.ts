/**
 * //TODO 改为webpack打包之后，是否还需要手动copoy 图片文件？？
 */

import {resetUsedImages, getImageInfos} from '../util/cacheImageInfos'
import * as npath from "path";
import * as fse from "fs-extra";
import configure from "../configure";

export default class ExtractImageFilesPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('ExtractImageFilesPlugin', () => {

            const {usedImages, outFiles} = getImageInfos()
            const usedImageArr = Array.from(usedImages)

            for(let i = 0; i < usedImageArr.length; i ++ ) {
                const imagePath = usedImageArr[i]

                if (outFiles[imagePath]) {
                    continue
                }


                const realPath = getRealImagePath(imagePath)
                const targetPath = imagePath
                    .replace(configure.inputFullpath, configure.outputFullpath)
                    .replace('node_modules', 'npm')
                fse.copySync(realPath, targetPath)

                outFiles[imagePath] = targetPath
            }

            const fileKeys = Object.keys(outFiles)
            for(let i = 0; i < fileKeys.length; i ++ ) {
                const fk = fileKeys[i]
                if (!usedImages.has(fk)) {
                    fse.removeSync(outFiles[fk])
                    delete outFiles[fk]
                }
            }

            resetUsedImages()
        })
    }
}

function getRealImagePath(imagePath) {
    let sourcePath: string = null

    const extname = npath.extname(imagePath)
    if (fse.existsSync(imagePath.replace(extname, `@3x${extname}`))) {
        sourcePath = imagePath.replace(extname, `@3x${extname}`)
    } else if (fse.existsSync(imagePath.replace(extname, `@2x${extname}`))) {
        sourcePath = imagePath.replace(extname, `@2x${extname}`)
    } else {
        sourcePath = imagePath
    }

    return sourcePath
}
