/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import fse from "fs-extra";
import {getRelativePath, RNWXLIBMaps} from '../util/util'
const prettier = require("prettier");
const path = require('path')


export default function (code, info) {
    let {filepath, outComp, entryFilePath, isFuncComp, isStatelessComp, isPageComp} = info
    filepath = filepath.replace('.wx.js', '.js')

    const outCompCode = `
import {
    WxCPTComp,
} from "${RNWXLIBMaps.react}"
Component(WxCPTComp())
    `

    const compFilename = path.basename(filepath, '.js')

    let entryRelativePath = ''
    if (entryFilePath) {
        entryRelativePath = getRelativePath(filepath, entryFilePath)
    }

    const RNAppCode = (entryFilePath ? `import RNApp from "${entryRelativePath}"` : `const RNApp = {}`)


    const renderCompCode = `import CompMySelf from "./${compFilename}.comp"
import { WxNormalComp } from "${RNWXLIBMaps.react}"
${RNAppCode}

Component(WxNormalComp(CompMySelf, RNApp))
    `

    for(let i = 0; i < outComp.length; i++) {
        const name = outComp[i]

        const jspath = (name === 'render' ? filepath: filepath.replace('.js', `${name}.js`))

        let jscode = null
        if (name === 'render') {
            if (isPageComp || !isStatelessComp) {
                jscode = renderCompCode
            } else {
                jscode = outCompCode
            }
        } else {
            jscode = outCompCode
        }

        const prettierCode = prettier.format(jscode, {
            semi: false,
            parser: "babylon",
            tabWidth: 4,
        })

        fse.writeFileSync(
            jspath,
            prettierCode,
            {
                flag: 'w+'
            }
        )
    }

}