/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {miscNameToJSName} from "../util/util";
import configure from '../configure'

/**
 * 返回所有生成的文件路径
 * @param info
 */
export default function allFilepaths(info) {
    const {filepath, outComp} = info
    const finalJSPath = miscNameToJSName(filepath).replace(configure.inputFullpath, configure.outputFullpath)

    const r = new Set<string>()
    for (let i = 0; i < outComp.length; i++) {
        const name = outComp[i];

        if (name === 'render') {
            r.add(finalJSPath)
            r.add(finalJSPath.replace('.js', '.wxml'))
            r.add(finalJSPath.replace('.js', '.wxss'))
            r.add(finalJSPath.replace('.js', '.json'))
            r.add(finalJSPath.replace('.js', 'Template.wxml'))
        } else {
            r.add(finalJSPath.replace('.js', `${name}.js`))
            r.add(finalJSPath.replace('.js', `${name}.wxml`))
            r.add(finalJSPath.replace('.js', `${name}.wxss`))
            r.add(finalJSPath.replace('.js', `${name}.json`))
        }
    }
    return r
}