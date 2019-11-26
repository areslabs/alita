/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import traverse from "@babel/traverse";
import * as t from "@babel/types";


/**
 * 把函数声明的组件， 转化为FuncComponent 组件
 *
 * 1. export default () => {}
 *
 * 2. export default function B () {
 *     return <A/>
 * }
 *
 * 3. export default B = () => {
 *    return <A/>
 * }
 *
 * 4. export default B = function (){
 *    return <A/>
 * }
 *
 *
 *
 * @param ast
 * @returns {*}
 */
export default function funcCompToClassComp(ast, info) {

    let funcPath = null
    let hasJSXElement = false

    traverse(ast, {
        enter: path => {
            // function x {}
            if (path.type === 'FunctionDeclaration' && path.parentPath.type === 'Program') {
                funcPath = path
                hasJSXElement = false
            }

            // const x = () => {}
            if (path.type === 'ArrowFunctionExpression'
                && path.parentPath.type === 'VariableDeclarator'
                && path.parentPath.parentPath.parentPath.type === 'Program'
            ) {
                funcPath = path
                hasJSXElement = false
            }

            // export const x = () => {}
            if (path.type === 'ArrowFunctionExpression'
                && path.parentPath.type === 'VariableDeclarator'
                && path.parentPath.parentPath.parentPath.type === 'ExportNamedDeclaration'
            ) {
                funcPath = path
                hasJSXElement = false
            }

            // const b = function (){}
            if (path.type === 'FunctionExpression'
                && path.parentPath.type === 'VariableDeclarator'
                && path.parentPath.parentPath.parentPath.type === 'Program'
            ) {
                funcPath = path
                hasJSXElement = false
            }

            // export const b = function (){}
            if (path.type === 'FunctionExpression'
                && path.parentPath.type === 'VariableDeclarator'
                && path.parentPath.parentPath.parentPath.type === 'ExportNamedDeclaration'
            ) {
                funcPath = path
                hasJSXElement = false
            }

            // export default () => {}
            if (path.type === 'ArrowFunctionExpression'
                && path.parentPath.type === 'ExportDefaultDeclaration'
            ) {
                funcPath = path
                hasJSXElement = false
            }

            // export default function () {}
            if (path.type === 'FunctionDeclaration'
                && path.parentPath.type === 'ExportDefaultDeclaration'
            ) {
                funcPath = path
                hasJSXElement = false
            }

            // export default (function () {})
            if (path.type === 'FunctionExpression'
                && path.parentPath.type === 'ExportDefaultDeclaration'
            ) {
                funcPath = path
                hasJSXElement = false
            }

            if (path.type === 'JSXOpeningElement') {
                hasJSXElement = true
            }
        },

        exit: path => {
            if (path.type === 'ClassDeclaration' || path.type === 'ClassExpression') {
                // 下面的path.replaceWith 将导致exit 在执行一次
                return
            }

            if (path === funcPath && hasJSXElement) {
                const funcPathNode = funcPath.node

                if (funcPathNode.body.type !== 'BlockStatement') {
                    funcPathNode.body = t.blockStatement([
                        t.returnStatement(funcPathNode.body)
                    ])
                }

                const propsVar = funcPathNode.params[0]
                if (propsVar) {
                    const propDec = t.variableDeclaration('const', [
                        t.variableDeclarator(propsVar, t.memberExpression(t.thisExpression(), t.identifier('props')))
                    ])

                    funcPathNode.body.body.unshift(propDec)
                }

                const contextVar = funcPathNode.params[1]
                if (contextVar) {
                    const contextDec = t.variableDeclaration('const', [
                        t.variableDeclarator(contextVar, t.memberExpression(t.thisExpression(), t.identifier('context')))
                    ])

                    funcPathNode.body.body.unshift(contextDec)
                }


                const classDec = t.classExpression(
                    path.node.id,
                    t.memberExpression(t.identifier('React'), t.identifier('FuncComponent')),
                    t.classBody([
                        t.classMethod(
                            'method',
                            t.identifier('render'),
                            [],
                            funcPathNode.body
                        )
                    ])
                )

                if (funcPathNode.type === 'FunctionDeclaration') {
                    classDec.type = 'ClassDeclaration'
                }

                path.replaceWith(classDec)
            }
        }
    })

    return ast
}
