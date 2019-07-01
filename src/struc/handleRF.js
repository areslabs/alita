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

export default async function (ast, filepath, isFuncComp, entryFilePath, isPageComp, isStatelessComp) {
    const dirname = path.dirname(filepath)
    await fse.mkdirs(dirname)

    baseTran(ast, filepath, true, isFuncComp)
    await componentTran(ast, filepath, isFuncComp, entryFilePath, isPageComp, isStatelessComp)
}