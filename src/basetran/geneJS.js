/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import fse from "fs-extra"
const prettier = require("prettier")
const path = require('path')


export default async function (code, info) {
    let {filepath} = info
    filepath = filepath.replace('.wx.js', '.js')

    const prettierCode = prettier.format(code, {
        semi: false,
        parser: "babylon",
        tabWidth: 4,
    })

    const dirname = path.dirname(filepath)
    await fse.mkdirs(dirname)


    fse.writeFileSync(
        filepath,
        prettierCode,
    )
}