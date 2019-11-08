/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import npath from 'path'
import addFile from './addFile';
import getFiles from "./getFiles";
import fse from "fs-extra";
import {supportExtname} from '../constants'

export default async function changeFile(path) {
    const { INPUT_DIR, OUT_DIR } = global.execArgs;
    const targetPath = path.replace(INPUT_DIR, OUT_DIR);
    let oldFiles = [];

    const extname = npath.extname(path)
    if (supportExtname.has(extname)) {
        if (path.endsWith(`.wx${extname}`)) {
            oldFiles = await getFiles(targetPath, `.wx${extname}`)
        } else {
            oldFiles = await getFiles(targetPath, extname)
        }
    }

    let newFiles = await addFile(path);
    
    getDeleteFiles(oldFiles, newFiles).map(async (file) => {
        fse.remove(file).catch((err) => console.log(err));
    });
}

function getDeleteFiles(oldFiles, newFiles) {
    return oldFiles.filter((v) => {
        return !newFiles.includes(v)
    });
}