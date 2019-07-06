import fse from 'fs-extra';

export default async function unlinkDir(dirPath) {
    const { INPUT_DIR, OUT_DIR, configObj } = global.execArgs;

    const relativePath = dirPath.replace(INPUT_DIR, '').replace(/\\/g, '/').substring(1);

    const targetPath = dirPath.replace(INPUT_DIR, OUT_DIR); //path.resolve(OUT_DIR, filepath)

    // 如果文件需要忽略， 则不处理
    if (typeof configObj.isFileIgnore === "function" && configObj.isFileIgnore(relativePath)) {
        return [];
    }
    await fse.remove(targetPath).catch(err => {
        console.log(err);
    });
}