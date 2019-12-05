/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as path from 'path'
import {miscNameToJSName, wxCompoutPath} from '../util/util'

import configure from '../configure'

/**
 */
export default function(info) {
    const {json, filepath, outComp, webpackContext} = info
    const finalJSPath = miscNameToJSName(filepath)
    const relativeJSPath = wxCompoutPath(finalJSPath)


    const renderUsingComponents = {
        ...json.usingComponents
    }

    for(let i = 0; i < outComp.length; i ++) {
        const name = outComp[i]
        if (name === 'render') {
            continue
        } else {
            renderUsingComponents[name] = path.basename(finalJSPath).replace('.js', `${name}`)
        }
    }


    const renderJSON = {
        ...json,
        usingComponents: renderUsingComponents
    }

    let renderJSONStr =  JSON.stringify(renderJSON, null, '\t')

    for(let i = 0; i < outComp.length; i ++) {
        const name = outComp[i]

        const comppath = (name === 'render' ? relativeJSPath.replace('.js', `.json`) : relativeJSPath.replace('.js', `${name}.json`))
        webpackContext.emitFile(
            comppath,
            renderJSONStr,
        )
    }

}