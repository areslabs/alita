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
    const {filepath, outComp, entryFilePath, isPageComp} = info
    const finalJSPath = miscNameToJSName(filepath)

    const outCompCode = `import { WxNormalComp } from "${RNWXLIBMaps.react}"
Component(WxNormalComp())
    `

    const projectRelativePath = finalJSPath
        .replace(global.execArgs.OUT_DIR + path.sep, '')
        .replace('.js', '')
        .replace(/\\/g, '/') // win 平台

    const pageCompPath = global.execArgs.configObj.subDir.endsWith('/') ? global.execArgs.configObj.subDir + projectRelativePath : global.execArgs.configObj.subDir  + '/' + projectRelativePath

    const renderCompCode = `import { WxNormalComp } from "${RNWXLIBMaps.react}"
const pageCompPath = "${pageCompPath}"

Component(WxNormalComp(pageCompPath))
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