/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import baseTran from '../basetran'
import componentTran from '../tran'
import fse from 'fs-extra'
const path = require('path')

export default function (ast, filepath, isFuncComp, entryFilePath, isPageComp) {
    const dirname = path.dirname(filepath)
    fse.mkdirsSync(dirname)

    baseTran(ast, filepath, true, isFuncComp)
    return componentTran(ast, filepath, isFuncComp, entryFilePath, isPageComp)
}