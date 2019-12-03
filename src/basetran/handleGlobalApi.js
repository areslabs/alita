/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import traverse from "@babel/traverse"
import * as t from '@babel/types'

/**
 * 1. async 异步函数
 * @param ast
 * @param info
 * @returns {*}
 */
export default function (ast, info) {
    let isAsync = false
    traverse(ast, {
        exit: path => {
            if ((
                path.type === 'FunctionDeclaration'
                || path.type === 'ArrowFunctionExpression'
                || path.type === 'ClassMethod'
            ) && path.node.async) {
                isAsync = true
                return
            }


            if (path.type === 'Program') {
                const body = path.node.body

                if(isAsync) {
                    body.unshift(asyncRegeneratorRuntimeDec(info.filepath))
                }
            }
        }
    })

    return ast
}


function asyncRegeneratorRuntimeDec(filepath) {
    return t.expressionStatement(t.identifier(`const regeneratorRuntime = require('@areslabs/regenerator-runtime');`))
}