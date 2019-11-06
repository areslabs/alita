/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import fse from "fs-extra";
import {miscNameToJSName} from '../util/util'
const path = require('path')

/**
 */
export default function(info) {
    const {json, filepath, outComp} = info
    const finalJSPath = miscNameToJSName(filepath)


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

        const comppath = (name === 'render' ? finalJSPath.replace('.js', `.json`) : finalJSPath.replace('.js', `${name}.json`))
        fse.writeFileSync(
            comppath,
            renderJSONStr,
            {
                flag: 'w+'
            }
        )
    }

}