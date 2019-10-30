/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fse from 'fs-extra'
import {getFileInfo, parseCode} from "./uast";

//TODO 读文件的开销？？
export default function isReactCompFile(filepath) {
    if (filepath.endsWith('.js') || filepath.endsWith('.jsx')) {
        const code = fse.readFileSync(filepath).toString()
        const ast = parseCode(code)

        const {isRF} = getFileInfo(ast)

        return isRF


    }

    return false

}
