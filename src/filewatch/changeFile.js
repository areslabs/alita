/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import addFile from './addFile';
import getFiles from "./getFiles";
import fse from "fs-extra";

export default async function changeFile(path) {
    const { INPUT_DIR, OUT_DIR } = global.execArgs;
    const targetPath = path.replace(INPUT_DIR, OUT_DIR);
    let oldFiles = [];
    if (path.endsWith('.js')) {
        oldFiles = await getFiles(targetPath, '.js');
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