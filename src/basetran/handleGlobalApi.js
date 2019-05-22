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
import {RNWXLIBMaps} from '../util/util'

/**
 * 1. 处理全局函数的导入， 在RN里 fetch， alert是不需要导入的
 * 2. 增加async， await支持
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
                    body.unshift(asyncRegeneratorRuntimeDec())
                }
            }
        }
    })

    return ast
}


function rnGlobalDec(info, usedApiList) {
    return t.importDeclaration(
        Array.from(usedApiList).map(v => t.importSpecifier(t.identifier(v), t.identifier(v))), t.stringLiteral(`${RNWXLIBMaps["react-native"]}/index`)
    )
}

function asyncRegeneratorRuntimeDec() {
    return t.importDeclaration(
        [
            t.importDefaultSpecifier(t.identifier('regeneratorRuntime'))
        ],
        t.stringLiteral(`${RNWXLIBMaps.react}/regeneratorRuntime`)
    )
}