/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import * as path from 'path'
import {miscNameToJSName} from '../util/util'
import configure from '../configure'

export default function (info) {
    const {filepath, outComp, isPageComp, webpackContext} = info
    const finalJSPath = miscNameToJSName(filepath)

    let outCompCode = `Component(wx.__bridge.WxNormalComp())`

    let renderCode
    if (isPageComp) {
        const projectRelativePath = finalJSPath
            .replace(configure.inputFullpath + path.sep, '')
            .replace('.js', '')
            .replace(/\\/g, '/') // win 平台

        const pageCompPath = configure.configObj.subDir.endsWith('/') ? configure.configObj.subDir + projectRelativePath : configure.configObj.subDir  + '/' + projectRelativePath
        renderCode = `Component(wx.__bridge.WxNormalComp("${pageCompPath}"))`
    } else {
        renderCode = outCompCode
    }


    const relativeJSPath = finalJSPath.replace(configure.inputFullpath, '')
    for(let i = 0; i < outComp.length; i++) {
        const name = outComp[i]

        const jspath = (name === 'render' ? relativeJSPath : relativeJSPath.replace('.js', `${name}.js`))
        const jscode = (name === 'render' ? renderCode : outCompCode)
        webpackContext.emitFile(
            jspath,
            jscode
        )
    }

}