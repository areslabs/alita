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


export default function (info) {
    let {filepath, outComp, entryFilePath, isFuncComp, isStatelessComp, isPageComp} = info
    filepath = filepath.replace('.wx.js', '.js')

    const outCompCode = `
import {
    WxNormalComp,
} from "${RNWXLIBMaps.react}"
Component(WxNormalComp())
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
        const jscode = (name === 'render' ? renderCompCode : outCompCode)
        fse.writeFileSync(
            jspath,
            jscode,
            {
                flag: 'w+'
            }
        )
    }

}