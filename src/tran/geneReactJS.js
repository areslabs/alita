/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import path from 'path'
import {geneReactCode} from '../util/uast'
import {miscNameToJSName} from '../util/util'
import fse from "fs-extra";
const prettier = require("prettier");

export default function (ast, info) {
    const {filepath} = info
    const code = geneReactCode(ast, path.extname(filepath))
    const compJSPath = miscNameToJSName(filepath).replace('.js', '.comp.js')


    const prettierCode = prettier.format(code, {
            semi: false,
            parser: "babylon",
            tabWidth: 4,
        })

    fse.writeFileSync(
        compJSPath,
        prettierCode,
        {
            flag: 'w+'
        }
    )
}