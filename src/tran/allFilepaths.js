/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {miscNameToJSName} from "../util/util";

/**
 * 返回所有生成的文件路径
 * @param info
 */
export default function allFilepaths(info) {
    const {filepath, outComp} = info
    const finalJSPath = miscNameToJSName(filepath)

    const r = []
    for (let i = 0; i < outComp.length; i++) {
        const name = outComp[i];

        if (name === 'render') {
            r.push(
                finalJSPath,
                finalJSPath.replace('.js', '.comp.js'),
                finalJSPath.replace('.js', '.wxml'),
                finalJSPath.replace('.js', '.wxss'),
                finalJSPath.replace('.js', '.json'),
                finalJSPath.replace('.js', 'Template.wxml')
            )
        } else {
            r.push(
                finalJSPath,
                finalJSPath.replace('.js', `${name}.js`),
                finalJSPath.replace('.js', `${name}.wxml`),
                finalJSPath.replace('.js', `${name}.wxss`),
                finalJSPath.replace('.js', `${name}.json`)
            )
        }
    }
    return r
}