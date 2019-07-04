/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * 返回所有生成的文件路径
 * @param info
 */
export default function allFilepaths(info) {
    const {filepath, outComp} = info

    const r = []
    for (let i = 0; i < outComp.length; i++) {
        const name = outComp[i];

        if (name === 'render') {
            r.push(
                filepath,
                filepath.replace('.js', '.comp.js'),
                filepath.replace('.js', '.wxml'),
                filepath.replace('.js', '.wxss'),
                filepath.replace('.js', '.json')
            )
        } else {
            r.push(
                filepath,
                filepath.replace('.js', `${name}.js`),
                filepath.replace('.js', `${name}.wxml`),
                filepath.replace('.js', `${name}.wxss`),
                filepath.replace('.js', `${name}.json`)
            )
        }
    }
    return r
}