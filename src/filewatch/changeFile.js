import addFile from './addFile';
import getFiles from "./getFiles";
import fse from "fs-extra";

export default async function changeFile(path) {
    let oldFiles = [];
    if(path.endsWith('.js')) {
        oldFiles = await getFiles(path);
    }
    let newFiles = await addFile(path);

    //删除冗余文件
    getDeleteFiles(oldFiles, newFiles).map(async (file) => {
        fse.remove(file).catch((err) => console.log(err));
    });  
}

function getDeleteFiles(oldFiles, newFiles) {
    return oldFiles.filter((v) => {
        return newFiles.indexOf(v) > -1 ? false : true;
    });
}