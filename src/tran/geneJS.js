/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import fse from "fs-extra";
import {getRelativePath, RNWXLIBMaps, miscNameToJSName} from '../util/util'

const path = require('path')


export default function (info) {
    const {filepath, outComp, entryFilePath} = info
    const finalJSPath = miscNameToJSName(filepath)

    const outCompCode = `
import {
    WxNormalComp,
} from "${RNWXLIBMaps.react}"
Component(WxNormalComp())
    `

    const compFilename = path.basename(finalJSPath, '.js')

    let entryRelativePath = ''
    if (entryFilePath) {
        entryRelativePath = getRelativePath(finalJSPath, entryFilePath)
    }

    const RNAppCode = (entryFilePath ? `import RNApp from "${entryRelativePath}"` : `const RNApp = {}`)


    const renderCompCode = `import CompMySelf from "./${compFilename}.comp"
import { WxNormalComp } from "${RNWXLIBMaps.react}"
${RNAppCode}

Component(WxNormalComp(CompMySelf, RNApp))
    `

    for(let i = 0; i < outComp.length; i++) {
        const name = outComp[i]

        const jspath = (name === 'render' ? finalJSPath: finalJSPath.replace('.js', `${name}.js`))
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