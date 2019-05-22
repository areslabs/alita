/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {geneReactCode} from '../util/uast'
import fse from "fs-extra";
const prettier = require("prettier");

export default async function (ast, info) {
    const code = await geneReactCode(ast)
    let {filepath} = info
    filepath = filepath.replace('.wx.js', '.js')
        .replace('.js', '.comp.js')


    const prettierCode = prettier.format(code, {
            semi: false,
            parser: "babylon",
            tabWidth: 4,
        })

    fse.writeFileSync(
        filepath,
        prettierCode,
        {
            flag: 'w+'
        }
    )
}