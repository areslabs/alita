/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import path from 'path'
import fse from 'fs-extra'
import {getFileInfo, parseCode} from "./uast"
import {supportExtname} from '../constants'


//TODO 读文件的开销？？
export default function isReactCompFile(filepath) {

    const extname = path.extname(filepath)

    if (supportExtname.has(extname)) {
        const code = fse.readFileSync(filepath).toString()
        const ast = parseCode(code, extname)

        const {isRF} = getFileInfo(ast)

        return isRF
    }

    return false
}
