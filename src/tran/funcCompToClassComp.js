/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import {miscNameToJSName} from '../util/util'

const npath = require('path')


/**
 * 把函数声明的组件， 转化为class
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
 * @param info
 * @returns {*}
 */
export default function (ast, info) {
    let compName = npath.basename(miscNameToJSName(info.filepath), '.js')
    compName = compName.substring(0, 1).toUpperCase() + compName.substring(1)

    traverse(ast, {
        exit: path => {
            if (path.type === 'ExportDefaultDeclaration') {
                const declaration = path.node.declaration

                let renderBody = getRenderBody(declaration)
                path.node.declaration = t.classDeclaration(
                    t.identifier(compName),
                    t.memberExpression(t.identifier('React'), t.identifier('FuncComponent')),
                    t.classBody([
                        t.classMethod(
                            'method',
                            t.identifier('render'),
                            [],
                            t.blockStatement(renderBody)
                        )
                    ])
                )
            }
        }
    })

    return ast
}


function getRenderBody(declaration) {
    let renderBody = null
    let params = null
    if (declaration.type === 'AssignmentExpression') {
        const { operator, right} = declaration
        if (operator === '=' && (right.type === 'ArrowFunctionExpression' || right.type === 'FunctionExpression')) {

            params = right.params

            if (right.body.body) {
                renderBody = [...right.body.body]
            } else {
                renderBody = [
                    t.returnStatement(right.body)
                ]
            }
        }
    }

    if (declaration.type === 'ArrowFunctionExpression') {
        const func = declaration
        params = func.params
        if (func.body.body) {
            renderBody = [...func.body.body]
        } else {
            renderBody = [
                t.returnStatement(func.body)
            ]
        }
    }

    if (declaration.type === 'FunctionDeclaration') {
        const func = declaration
        params = func.params
        renderBody = [
            ...func.body.body
        ]
    }


    const propsVar = params[0]
    if (propsVar) {
        const propDec = t.variableDeclaration('const', [
            t.variableDeclarator(propsVar, t.memberExpression(t.thisExpression(), t.identifier('props')))
        ])

        renderBody.unshift(propDec)
    }

    const contextVar = params[1]
    if (contextVar) {
        const contextDec = t.variableDeclaration('const', [
            t.variableDeclarator(contextVar, t.memberExpression(t.thisExpression(), t.identifier('context')))
        ])

        renderBody.unshift(contextDec)
    }

    return renderBody
}