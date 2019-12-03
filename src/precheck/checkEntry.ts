/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as t from "@babel/types"
import traverse from "@babel/traverse";
import {printError} from './util'

export default function checkEntry(ast, filepath, rawCode) {

    let checkPass = true

    // 收集所有 import/require 组件
    const allModuleVarSet  = new Set([])

    traverse(ast, {
        enter: path => {
            if (path.type === 'ImportDeclaration') {
                ;(path.node as t.ImportDeclaration).specifiers.forEach(item => {
                    allModuleVarSet.add(item.local.name)
                })
            }

            if (path.type === 'CallExpression'
                // @ts-ignore
                && path.node.callee.name === 'require'
                // @ts-ignore
                && path.node.arguments.length === 1
            ) {

                const pp = path.parentPath
                // @ts-ignore
                const id = pp.node.id


                if (id && id.type === 'Identifier') {
                    allModuleVarSet.add(id.name)
                }

                if (id && id.type === 'ObjectPattern') {
                    id.properties.forEach(pro => {
                        if (pro.type === 'Property') {
                            allModuleVarSet.add(pro.value.name)
                        }
                    })
                }
            }

        },

        exit: path => {
            // @ts-ignore
            if (path.type === 'JSXOpeningElement' && path.node.name.name === 'Route') {
                const parentJSX = path.parentPath.parentPath

                if (parentJSX.type === 'JSXElement'
                    // @ts-ignore
                    && (parentJSX.node.openingElement.name.name === 'Router' || parentJSX.node.openingElement.name.name === 'TabRouter')) {

                } else {
                    printError(filepath, path, rawCode, `入口文件限制：Route标签需要直接放置在 Router/TabRouter 下`)
                    checkPass = false
                }

                const pnode = path.node as t.JSXOpeningElement

                // @ts-ignore
                const hasKey = pnode.attributes.some(attr => attr.name.name === 'key')
                if (!hasKey) {
                    printError(filepath, path, rawCode, `Route标签 缺少key属性`)
                    checkPass = false
                }

                // @ts-ignore
                const hasComponent = pnode.attributes.some(attr => attr.name.name === 'component')
                if (!hasComponent) {
                    printError(filepath, path, rawCode, `Route标签 缺少component属性`)
                    checkPass = false
                }

            }

            // @ts-ignore
            if (path.type === 'JSXOpeningElement' && path.node.name.name === 'TabRouter') {
                const parentJSX = path.parentPath.parentPath

                if (parentJSX.type === 'JSXElement'
                    // @ts-ignore
                    && parentJSX.node.openingElement.name.name === 'Router') {

                } else {
                    printError(filepath, path, rawCode, `入口文件限制：TabRouter标签需要直接放置在 TabRouter 下`)
                    checkPass = false
                }
            }

            // @ts-ignore
            if (path.type === 'JSXAttribute' && path.node.name.name === 'key') {
                // @ts-ignore
                const v = path.node.value

                if (v.type === 'StringLiteral') return

                if (v.type === 'JSXExpressionContainer' && v.expression && v.expression.type === 'StringLiteral') return

                printError(filepath, path, rawCode, `Route标签 key属性需要字符串常量`)
                checkPass = false
            }

            // @ts-ignore
            if (path.type === 'JSXAttribute' && path.node.name.name === 'component') {
                // @ts-ignore
                const v = path.node.value

                if (v.type !== 'JSXExpressionContainer') {
                    printError(filepath, path, rawCode, `Route标签 component属性值需要为组件`)
                    checkPass = false
                } else {
                    const expre = v.expression

                    if (!allModuleVarSet.has(expre.name)) {
                        printError(filepath, path, rawCode, `Route标签 component属性值需要为直接导入的组件`)
                        checkPass = false
                    }
                }
            }

            // @ts-ignore
            if (path.type === 'JSXAttribute' && path.node.name.name === 'wxNavigationOptions') {
                // @ts-ignore
                const v = path.node.value

                if (v.type !== 'JSXExpressionContainer') {
                    printError(filepath, path, rawCode, `Router标签 wxNavigationOptions属性值需要为对象`)
                    checkPass = false
                } else {
                    const expre = v.expression

                    expre.properties.forEach(op => {
                        if (!op.value.type.endsWith('Literal')) {
                            printError(filepath, path, rawCode, `wxNavigationOptions 属性值，值需要是字面量`)
                            checkPass = false
                        }
                    })
                }

            }
        },
    })

    return checkPass
}