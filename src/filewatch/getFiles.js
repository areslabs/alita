import fse from "fs-extra";
import {InnerComponentNamePrefix} from '../constants';

const path = require('path');

export default async function getFiles(targetPath, suffix) {
    const targetdir = path.dirname(targetPath);
    const noSuffix = targetPath.substring(0, targetPath.lastIndexOf(suffix));
    const suffixs = ['.json', '.wxss', '.js', '.comp.js', '.wxml'];
    const allFiles = suffixs.map((item) => {
        return noSuffix + item;
    });
    allFiles.push(noSuffix + 'Template.wxml');
    await fse.readdir(targetdir).then((files) => {
        files.forEach((fileName) => {
            if (fileName.indexOf(noSuffix.substring(noSuffix.lastIndexOf('/') + 1) + InnerComponentNamePrefix) === 0) {
                allFiles.push(path.resolve(targetdir, fileName));
            }

        });
    });

    return allFiles.map((file) => {
        return fse.existsSync(file);
    });
}