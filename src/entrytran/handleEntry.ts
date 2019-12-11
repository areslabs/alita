/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as npath from 'path'
import traverse from "@babel/traverse"
import * as t from '@babel/types'
import {isStaticRes} from '../util/util'

import {geneOrder, getFinalSource} from '../util/util'

import configure from '../configure'

import {setEntryModuleInfo} from '../util/cacheModuleInfos'


export default function (ast, filepath, webpackContext) {

    const appJSON: any = {
        pages: [
        ],

        window: {
            "backgroundTextStyle":"light",
            'backgroundColor': '#E9E9E9',
            'enablePullDownRefresh': false,
        },
    }

    const historyMap = {}
    const pageCompPaths = []

    const moduleMap = {}
    const compImportMap = {}
    const pngMap = {}


    const go = geneOrder()
    traverse(ast, {
        enter: path => {
            if (path.type === 'StringLiteral'
                && isStaticRes((path.node as t.StringLiteral).value)
            ) {
                const pp = path.parentPath
                if (pp.type === 'VariableDeclarator') {
                    // @ts-ignore
                    pngMap[pp.node.id.name] = path.node.value

                    pp.parentPath.remove()
                }

                return
            }


            if (path.type === 'ImportDeclaration') {
                const pnode = path.node as t.ImportDeclaration
                const source = pnode.source.value
                const rs = getRealSource(source, filepath)
                pnode.source.value = rs

                const originPath = getOriginPath(rs, filepath)
                const specifiers = pnode.specifiers
                specifiers.forEach(spe => {
                    const name = spe.local.name
                    moduleMap[name] = originPath
                })

                return
            }

            // require 目录 小程序不支持需要处理
            // @ts-ignore
            if (path.type === 'CallExpression' && path.node.callee.type === 'Identifier' && path.node.callee.name === 'require'
            ) {
                // @ts-ignore
                const source = path.node.arguments[0].value
                const rs = getRealSource(source, filepath)
                // @ts-ignore
                path.node.arguments[0].value = rs


                const originPath = getOriginPath(rs, filepath)

                // @ts-ignore
                const id = path.parentPath.node.id
                if (id.type === 'Identifier') {
                    moduleMap[id.name] = originPath
                } else  if (id.type === 'ObjectPattern') {
                    id.properties.map(pro => {
                        if (pro.type === 'ObjectProperty') {
                            moduleMap[pro.key.name] = originPath
                        }
                    })
                }

                return
            }
        },

        exit: path => {
            if (
                path.type === 'JSXAttribute'
                // @ts-ignore
                && (path.node.name.name === 'image' || path.node.name.name === 'selectedImage')
                // @ts-ignore
                && path.parentPath.node.name.name === 'TabRouter'
            ) {
                // @ts-ignore
                const v = path.node.value
                if (v.type === 'JSXExpressionContainer') {
                    const picName = v.expression.name
                    // @ts-ignore
                    path.node.value = t.stringLiteral(pngMap[picName])
                }

                return
            }

            // @ts-ignore
            if (path.type === 'JSXOpeningElement' && path.node.name.name === 'Route') {
                let compAttri = null
                let key = null

                const pnode = path.node as t.JSXOpeningElement
                pnode.attributes.forEach(ele => {
                    ele = ele as t.JSXAttribute

                    if (ele.name.name === 'component') {
                        compAttri = ele
                    }

                    if (ele.name.name === 'key') {

                        if (ele.value.type === 'JSXExpressionContainer' && ele.value.expression.type === 'StringLiteral') {
                            key = ele.value.expression.value
                        }

                        if (ele.value.type === 'StringLiteral') {
                            key = ele.value.value
                        }
                    }
                })


                const name = compAttri.value.expression.name
                const projectRelativePath = moduleMap[name]
                compImportMap[name] = moduleMap[name]


                const pageCompPath = configure.configObj.subDir.endsWith('/') ? configure.configObj.subDir + projectRelativePath : configure.configObj.subDir  + '/' + projectRelativePath

                historyMap[configure.configObj.subDir + key]
                    = pageCompPath

                pageCompPaths.push(t.objectProperty(
                    t.stringLiteral(pageCompPath),
                    t.identifier(name)
                ))

                appJSON.pages.push(projectRelativePath)

                pnode.attributes.push(t.jsxAttribute(t.jsxIdentifier('diuu'), t.stringLiteral(`DIUU${go.next}`)))
                return
            }

            // @ts-ignore
            if (path.type === 'JSXOpeningElement' && path.node.name.name === 'TabRouter') {
                const pp = path.parentPath
                // @ts-ignore
                const children = pp.node.children

                let initRoute = null
                for(let i = 0; i< children.length; i++) {
                    const child = children[i]
                    if (child.type === 'JSXElement' && child.openingElement.name.name === 'Route') {
                        const oe = child.openingElement
                        const compAttri = oe.attributes.filter(ele => ele.name.name === 'component')[0]
                        const name = compAttri.value.expression.name
                        const projectRelativePath = moduleMap[name].replace('.comp', '') // 组件的.comp 后缀需要移除
                        compImportMap[name] = moduleMap[name]

                        initRoute = projectRelativePath

                        break
                    }
                }



                const tabBarElement: any = {
                    pagePath: initRoute,
                }

                const pnode = path.node as t.JSXOpeningElement

                pnode.attributes.forEach(attri => {
                    attri = attri as t.JSXAttribute
                    const v = (attri.value as t.StringLiteral).value

                    if (attri.name.name === 'text') {
                        tabBarElement.text = v
                    }

                    if (attri.name.name === 'image') {
                        tabBarElement.iconPath = v
                    }

                    if (attri.name.name === 'selectedImage') {
                        tabBarElement.selectedIconPath = v
                    }
                })


                appJSON.tabBar = appJSON.tabBar || {}
                appJSON.tabBar.list = appJSON.tabBar.list || []
                appJSON.tabBar.list.push(tabBarElement)

                pnode.attributes.push(t.jsxAttribute(t.jsxIdentifier('diuu'), t.stringLiteral(`DIUU${go.next}`)))

                return
            }

            if (path.type === 'JSXOpeningElement') {
                const jsxOp = path.node as t.JSXOpeningElement

                const key = `DIUU${go.next}`

                jsxOp.attributes.push(
                    t.jsxAttribute(t.jsxIdentifier('diuu'), t.stringLiteral(key))
                )
                return
            }

            if (path.type === 'JSXAttribute'
                && (path.node as t.JSXAttribute).name.name === 'wxNavigationOptions'
            ) {
                const value = (path.node as t.JSXAttribute).value


                if (value.type === 'JSXExpressionContainer'
                    && value.expression.type === 'ObjectExpression'
                ) {
                    const v = value.expression
                    const props = v.properties
                    for(let i = 0; i < props.length; i++) {
                        const p = props[i] as t.ObjectProperty
                        const k = p.key.name
                        const v = (p.value as t.StringLiteral).value
                        appJSON.window[k] = v
                    }
                }
                return
            }
        }
    })

    traverse(ast, {

        exit: path => {
            if (path.type === 'ExportDefaultDeclaration') {
                // @ts-ignore
                if (path.node.declaration.type === 'ClassDeclaration') {
                    // TODO 可能存在其他情况吗
                    // @ts-ignore
                    path.node.declaration.type = 'ClassExpression'
                }

                path.replaceWith(
                    t.variableDeclaration('const', [
                        // @ts-ignore
                        t.variableDeclarator(t.identifier('RNAppClass'), path.node.declaration)
                    ])
                )
            }

            // module.exports = A => const RNAppClass = A
            if (path.type === 'AssignmentExpression'
                // @ts-ignore
                && path.node.operator === '='
                // @ts-ignore
                && path.node.left.type === 'MemberExpression'
                // @ts-ignore
                && path.node.left.object.name === 'module'
                // @ts-ignore
                && path.node.left.property.name === 'exports'
            ) {
                path.parentPath.replaceWith(
                    t.variableDeclaration('const', [
                        // @ts-ignore
                        t.variableDeclarator(t.identifier('RNAppClass'), path.node.right)
                    ])
                )
            }

            if (path.type === 'Program') {
                /* 导出 RNApp 实例
                 * const RNApp = new RNAppClass()
                 * RNApp.childContext = RNApp.getChildContext ? RNApp.getChildContext() : {}
                 * export default RNApp
                 */

                const pnode = path.node as t.Program

                // be lazy
                pnode.body.push(
                    t.expressionStatement(
                        t.identifier(`React.renderApp(RNAppClass)`)
                    )
                )


                /**
                 * 初始化路由
                 */

                // be lazy
                pnode.body.push(
                    t.expressionStatement(
                        t.identifier(`wx._historyConfig = {...(wx._historyConfig || {}), ...${JSON.stringify(historyMap, null)}}`)
                    )
                )

                // be lazy

                pnode.body.push(t.variableDeclaration(
                    'const',
                    [
                        t.variableDeclarator(
                            t.identifier('__pageCompPath'),
                            t.objectExpression(pageCompPaths)
                        )
                    ]
                ))
                pnode.body.push(
                    t.expressionStatement(
                        t.identifier(`wx._pageCompMaps = {...(wx._pageCompMaps || {}), ...__pageCompPath}`)
                    )
                )
            }
        }
    })


    setEntryModuleInfo(filepath, {
        appJSON,
    })

    return {
        entryAst: ast,
        allCompSet: new Set(Object.keys(compImportMap).map(key => compImportMap[key]))
    }
}


function getOriginPath(source, filepath) {
    const originPath = npath
        .resolve(npath.dirname(filepath), source)
        .replace(configure.inputFullpath  + npath.sep, '')
        .replace(/\\/g, '/') // 考虑win平台

    return originPath
}

function getRealSource(source, filepath) {
    if (npath.extname(source) !== '') {
        return source
    }


    // 小程序不支持require/import 一个目录
    if (source.startsWith('/')
        || source.startsWith('./')
        || source.startsWith('../')
    ) {
        return getFinalSource(filepath, source)
    } else {
        return source
    }
}