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

    let funcPath = null
    let hasJSXElement = false
    let iden = null

    let comps = new Set([])

    let totalComps = 0

    errorLogTraverse(ast, {
        enter: path => {

            // function x {}
            if (path.type === 'FunctionDeclaration' && path.parentPath.type === 'Program') {
                funcPath = path
                hasJSXElement = false
                // @ts-ignore
                iden = path.node.id.name
            }

            // export function x {}
            if (path.type === 'FunctionDeclaration' && path.parentPath.type === 'ExportNamedDeclaration') {
                funcPath = path
                hasJSXElement = false
                // @ts-ignore
                iden = path.node.id.name
            }

            // const x = () => {}
            if (path.type === 'ArrowFunctionExpression'
                && path.parentPath.type === 'VariableDeclarator'
                && path.parentPath.parentPath.parentPath.type === 'Program'
            ) {
                funcPath = path
                hasJSXElement = false

                // @ts-ignore
                iden = path.parentPath.node.id.name
            }

            // export const x = () => {}
            if (path.type === 'ArrowFunctionExpression'
                && path.parentPath.type === 'VariableDeclarator'
                && path.parentPath.parentPath.parentPath.type === 'ExportNamedDeclaration'
            ) {
                funcPath = path
                hasJSXElement = false

                // @ts-ignore
                iden = path.parentPath.node.id.name
            }

            // const b = function (){}
            if (path.type === 'FunctionExpression'
                && path.parentPath.type === 'VariableDeclarator'
                && path.parentPath.parentPath.parentPath.type === 'Program'
            ) {
                funcPath = path
                hasJSXElement = false

                // @ts-ignore
                iden = path.parentPath.node.id.name
            }

            // export const b = function (){}
            if (path.type === 'FunctionExpression'
                && path.parentPath.type === 'VariableDeclarator'
                && path.parentPath.parentPath.parentPath.type === 'ExportNamedDeclaration'
            ) {
                funcPath = path
                hasJSXElement = false

                // @ts-ignore
                iden = path.parentPath.node.id.name
            }


            // export default () => {}
            if (path.type === 'ArrowFunctionExpression'
                && path.parentPath.type === 'ExportDefaultDeclaration'
            ) {
                funcPath = path
                hasJSXElement = false

                iden = "default"
            }

            // export default function () {}
            if (path.type === 'FunctionDeclaration'
                && path.parentPath.type === 'ExportDefaultDeclaration'
            ) {
                funcPath = path
                hasJSXElement = false

                iden = "default"
            }

            // export default (function () {})
            if (path.type === 'FunctionExpression'
                && path.parentPath.type === 'ExportDefaultDeclaration'
            ) {
                funcPath = path
                hasJSXElement = false

                iden = "default"
            }


            if (path.type === 'JSXOpeningElement') {
                hasJSXElement = true
            }
        },

        exit: path => {
            if (path.type === 'ClassDeclaration' || path.type === 'ClassExpression') {

                // @ts-ignore
                if (isReactComponent(path.node.superClass)) {

                    totalComps ++

                    if (path.parentPath.type === 'ExportDefaultDeclaration') {
                        comps.add('default')
                        // @ts-ignore
                    } else if (path.node.id) {
                        // @ts-ignore
                        comps.add(path.node.id.name)
                    }
                }

                return
            }


            if (path.type === 'ExportDefaultDeclaration' ) {
                comps.add('default')

                // @ts-ignore
                if (path.node.declaration.type === 'Identifier') {
                    // @ts-ignore
                    const name = path.node.declaration.name
                    if(comps.has(name)) {
                        comps.delete(name)
                    }
                }
            }

            // module.exports = A
            if (path.type === 'AssignmentExpression'
                && path.parentPath.type === 'ExpressionStatement'
                && path.parentPath.parentPath.type === 'Program'
                // @ts-ignore
                && path.node.left.type === 'MemberExpression'
                // @ts-ignore
                && path.node.left.property.name === 'exports'
                // @ts-ignore
                && path.node.left.object.name === 'module'
            ) {
                comps.add('default')

                // @ts-ignore
                if (path.node.right.type === 'Identifier') {
                    // @ts-ignore
                    const name = path.node.right.name
                    if(comps.has(name)) {
                        comps.delete(name)
                    }
                }
            }

            // 有默认导出的情况
            if (path.type === 'Program') {

                if (totalComps === 1 && comps.has('default')) {
                    // 只有一个组件且有默认导出，特殊处理
                    info.outComp = ['default']
                } else {
                    info.outComp = Array.from(comps)
                }

                if (info.outComp.length > 1) {
                    console.log(`${info.filepath.replace(configure.inputFullpath, '')} 检测到多个组件，建议一个文件只存在一个组件！`.warn)
                }
            }


            if (path === funcPath && hasJSXElement) {
                const funcPathNode = funcPath.node

                comps.add(iden)

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
                            t.identifier('render'),
                            [],
                            funcPathNode.body
                        )
                    ])
                )

                if (funcPathNode.type === 'FunctionDeclaration') {
                    // @ts-ignore
                    classDec.type = 'ClassDeclaration'
                }

                path.replaceWith(classDec)
            }
        }
    })

    return ast
}
