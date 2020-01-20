/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {parseCode, geneJSXCode} from '../../src/util/uast'

/**
 * 通过trans把code转化为newCode
 * @param code 输入代码
 * @param info 转化参数
 * @param trans 转化规则
 * @returns {string} newCode
 */
export function getNewCode(code, info, ...trans) {

    let ast = parseCode(code, '.js')
    for(let i = 0; i < trans.length; i ++) {
        const tranFunc = trans[i]
        ast = tranFunc.call(null, ast, info)
    }

    return geneJSXCode(ast)
}

export function expectNewCode(code, expectCode, info, ...trans) {

    const newCode = getNewCode(code, info, ...trans)
    expect(newCode).JSEqual(expectCode)
}