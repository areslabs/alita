/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import traverse from "@babel/traverse"
import * as t from '@babel/types'
import {globalApiList} from "../constants";

/**
 * 1. 处理全局函数的导入， 在RN里 fetch， alert是不需要导入的
 * @param ast
 * @param info
 * @returns {*}
 */
export default function (ast, info) {
    const usedApiList = new Set()
    let isAsync = false
    traverse(ast, {
        exit: path => {
            if (path.type === 'Identifier'
                && globalApiList.has(path.node.name)
            ) {
                usedApiList.add(path.node.name)
            }

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

                if (usedApiList.size > 0) {
                    body.unshift(rnGlobalDec(info, usedApiList))
                }

                if(isAsync) {
                    body.unshift(asyncRegeneratorRuntimeDec(info.filepath))
                }
            }
        }
    })

    return ast
}


function rnGlobalDec(info, usedApiList) {
    return t.importDeclaration(
        Array.from(usedApiList).map(v => t.importSpecifier(t.identifier(v), t.identifier(v))), t.stringLiteral('react-native')
    )
}

function asyncRegeneratorRuntimeDec(filepath) {
    return t.expressionStatement(t.identifier(`const regeneratorRuntime = require('regenerator-runtime');`))
}