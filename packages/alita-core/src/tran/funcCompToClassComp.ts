/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

//import traverse from "@babel/traverse";
import * as t from "@babel/types";
import {isReactComponent} from "../util/uast";
import configure from '../configure'
import errorLogTraverse from '../util/ErrorLogTraverse'

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

    let hasJSXElement = false
    let iden = null

    let comps = new Set([])

    errorLogTraverse(ast, {
        enter: path => {
            if (path.type === 'FunctionDeclaration'
                || path.type === 'ArrowFunctionExpression'
                || path.type === 'FunctionExpression'
            ) {
                hasJSXElement = false
            }

            if (path.type === 'JSXOpeningElement') {
                hasJSXElement = true
                // 如果检测到有jsx元素的话，就退出
                // 否则有有些jsx属性为方法类型，就会使hasJSXElement = false（上面逻辑）
                path.skip()
            }
        },

        exit: path => {

            // 收集所有组件（class & func）
            if (path.type === 'ClassDeclaration' || path.type === 'ClassExpression') {

                // @ts-ignore
                if (isReactComponent(path.node.superClass)) {

                    if (path.node.id) {
                        // @ts-ignore
                        comps.add(path.node.id.name)
                    }
                }

                return
            }

            // function x {}
            if (path.type === 'FunctionDeclaration'
                && path.parentPath.type === 'Program'
                && hasJSXElement
            ) {
                // @ts-ignore
                iden = path.node.id.name
                comps.add(iden)

                path.replaceWith(geneClassDec(path))
            }

            // export function x {}
            if (path.type === 'FunctionDeclaration'
                && path.parentPath.type === 'ExportNamedDeclaration'
                && hasJSXElement
            ) {
                // @ts-ignore
                iden = path.node.id.name
                comps.add(iden)

                path.replaceWith(geneClassDec(path))
            }


            // const x = () => {}
            if (path.type === 'ArrowFunctionExpression'
                && path.parentPath.type === 'VariableDeclarator'
                && path.parentPath.parentPath.parentPath.type === 'Program'
                && hasJSXElement
            ) {
                // @ts-ignore
                iden = path.parentPath.node.id.name
                comps.add(iden)


                path.replaceWith(geneClassDec(path))
            }


            // export const x = () => {}
            if (path.type === 'ArrowFunctionExpression'
                && path.parentPath.type === 'VariableDeclarator'
                && path.parentPath.parentPath.parentPath.type === 'ExportNamedDeclaration'
                && hasJSXElement
            ) {
                // @ts-ignore
                iden = path.parentPath.node.id.name
                comps.add(iden)

                path.replaceWith(geneClassDec(path))
            }

            // const b = function (){}
            if (path.type === 'FunctionExpression'
                && path.parentPath.type === 'VariableDeclarator'
                && path.parentPath.parentPath.parentPath.type === 'Program'
                && hasJSXElement
            ) {
                // @ts-ignore
                iden = path.parentPath.node.id.name
                comps.add(iden)

                path.replaceWith(geneClassDec(path))
            }

            // export const b = function (){}
            if (path.type === 'FunctionExpression'
                && path.parentPath.type === 'VariableDeclarator'
                && path.parentPath.parentPath.parentPath.type === 'ExportNamedDeclaration'
                && hasJSXElement
            ) {
                // @ts-ignore
                iden = path.parentPath.node.id.name
                comps.add(iden)

                path.replaceWith(geneClassDec(path))
            }

            // export default () => {}
            if (path.type === 'ArrowFunctionExpression'
                && path.parentPath.type === 'ExportDefaultDeclaration'
                && hasJSXElement
            ) {

                path.replaceWith(geneClassDec(path))
            }

            // export default function () {}
            if (path.type === 'FunctionDeclaration'
                && path.parentPath.type === 'ExportDefaultDeclaration'
                && hasJSXElement
            ) {
                path.replaceWith(geneClassDec(path))
            }

            // export default (function () {})
            if (path.type === 'FunctionExpression'
                && path.parentPath.type === 'ExportDefaultDeclaration'
                && hasJSXElement
            ) {
                path.replaceWith(geneClassDec(path))
            }
        }
    })



    info.outComp.push(...Array.from(comps))

    return ast
}

function geneClassDec(path) {

    const funcPathNode = path.node

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
        // @ts-ignore
        path.node.id,
        t.memberExpression(t.identifier('React'), t.identifier('FuncComponent')),
        t.classBody([
            t.classMethod(
                'method',
                t.identifier('renderComp'),
                [],
                funcPathNode.body
            ),
            t.classMethod(
                'method',
                t.identifier('render'),
                [],
                t.blockStatement([
                    t.expressionStatement(
                        t.assignmentExpression(
                            '=',
                            t.memberExpression(
                                t.memberExpression(
                                    t.identifier('React'),
                                    t.identifier('Current')
                                ),
                                t.identifier('current')
                            ),
                            t.thisExpression()
                        )
                    ),
                    t.expressionStatement(
                        t.assignmentExpression(
                            '=',
                            t.memberExpression(
                                t.memberExpression(
                                    t.identifier('React'),
                                    t.identifier('Current')
                                ),
                                t.identifier('index')
                            ),
                            t.numericLiteral(0)
                        )
                    ),
                    t.variableDeclaration('const', [
                        t.variableDeclarator(
                            t.identifier('comp'),
                            t.callExpression(
                                t.memberExpression(
                                    t.thisExpression(),
                                    t.identifier('renderComp')
                                ),
                                []
                            )
                        )
                    ]),
                    t.expressionStatement(
                        t.assignmentExpression(
                            '=',
                            t.memberExpression(
                                t.memberExpression(
                                    t.identifier('React'),
                                    t.identifier('Current')
                                ),
                                t.identifier('current')
                            ),
                            t.nullLiteral()
                        )
                    ),
                    t.returnStatement(
                        t.identifier('comp')
                    )
                ])
            )
        ])
    )

    if (funcPathNode.type === 'FunctionDeclaration') {
        // @ts-ignore
        classDec.type = 'ClassDeclaration'
    }

    return classDec
}
