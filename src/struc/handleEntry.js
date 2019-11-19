/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import fse from 'fs-extra'
import traverse from "@babel/traverse"
import * as t from '@babel/types'
import {isStaticRes, miscNameToJSName} from '../util/util'
import { geneReactCode } from "../util/uast";

import basetran from '../basetran'
import {geneOrder} from '../util/util'

const npath = require('path')


export default function (ast, filepath) {
    const appJSON = {
        pages: [
        ],

        window: {
            "backgroundTextStyle":"light",
            'backgroundColor': '#E9E9E9',
            'enablePullDownRefresh': false,
        },

        /*tabBar: {
            list: []
        }*/
    }

    const historyMap = {}
    const pageCompPaths = []

    const moduleMap = {}
    const compImportMap = {}
    const pngMap = {}

    basetran(ast, filepath, true)

    const go = geneOrder()
    traverse(ast, {
        enter: path => {
            if (path.type === 'StringLiteral'
                && isStaticRes(path.node.value)
            ) {
                const pp = path.parentPath
                if (pp.type === 'VariableDeclarator') {
                    pngMap[pp.node.id.name] = path.node.value

                    pp.parentPath.remove()
                }

                return
            }

            if (path.type === 'ImportDeclaration') {
                const source = path.node.source.value

                const originPath = getOriginPath(source, filepath)

                const specifiers = path.node.specifiers
                specifiers.forEach(spe => {
                    const name = spe.local.name
                    moduleMap[name] = originPath
                })
                return
            }

            if (path.type === 'CallExpression'
                && path.node.callee.name === 'require'
                && path.key === 'init'
            ) {
                const source = path.node.arguments[0].value
                const originPath = getOriginPath(source, filepath)

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

            }


        },

        exit: path => {
            if (path.type === 'JSXAttribute'
                && (path.node.name.name === 'image' || path.node.name.name === 'selectedImage')
                && path.parentPath.node.name.name === 'TabRouter'
            ) {

                const v = path.node.value
                if (v.type === 'JSXExpressionContainer') {
                    const picName = v.expression.name
                    path.node.value = t.stringLiteral(pngMap[picName])
                }

                return
            }

            if (path.type === 'JSXOpeningElement' && path.node.name.name === 'Route') {
                let compAttri = null
                let key = null
                path.node.attributes.forEach(ele => {
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
                const projectRelativePath = moduleMap[name].replace('.comp', '') // 组件的.comp 后缀需要移除
                compImportMap[name] = moduleMap[name]


                const pageCompPath = global.execArgs.configObj.subDir.endsWith('/') ? global.execArgs.configObj.subDir + projectRelativePath : global.execArgs.configObj.subDir  + '/' + projectRelativePath

                historyMap[global.execArgs.packageName + key]
                    = pageCompPath

                pageCompPaths.push(t.objectProperty(
                    t.stringLiteral(pageCompPath),
                    t.identifier(name)
                ))

                appJSON.pages.push(projectRelativePath)

                path.node.attributes = [t.jsxAttribute(t.jsxIdentifier('diuu'), t.stringLiteral(`DIUU${go.next}`))]
                return
            }

            if (path.type === 'JSXOpeningElement' && path.node.name.name === 'TabRouter') {
                const pp = path.parentPath
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



                const tabBarElement = {
                    pagePath: initRoute,
                }
                path.node.attributes.forEach(attri => {
                    if (attri.name.name === 'text') {
                        tabBarElement.text = attri.value.value
                    }

                    if (attri.name.name === 'image') {
                        tabBarElement.iconPath = attri.value.value
                    }

                    if (attri.name.name === 'selectedImage') {
                        tabBarElement.selectedIconPath = attri.value.value
                    }
                })


                appJSON.tabBar = appJSON.tabBar || {}
                appJSON.tabBar.list = appJSON.tabBar.list || []
                appJSON.tabBar.list.push(tabBarElement)

                path.node.attributes = [t.jsxAttribute(t.jsxIdentifier('diuu'), t.stringLiteral(`DIUU${go.next}`))]

                return
            }

            if (path.type === 'JSXOpeningElement') {
                const jsxOp = path.node

                const key = `DIUU${go.next}`

                jsxOp.attributes.push(
                    t.jsxAttribute(t.jsxIdentifier('diuu'), t.stringLiteral(key))
                )
                return
            }

            if (path.type === 'JSXAttribute'
                && path.node.name.name === 'wxNavigationOptions'
            ) {
                const value = path.node.value


                if (value.type === 'JSXExpressionContainer'
                    && value.expression.type === 'ObjectExpression'
                ) {
                    const v = value.expression
                    const props = v.properties
                    for(let i = 0; i < props.length; i++) {
                        const p = props[i]
                        const k = p.key.name
                        const v = p.value.value
                        appJSON.window[k] = v
                    }
                }

                path.remove()
                return
            }
        }
    })

    traverse(ast, {

        exit: path => {
            if (path.type === 'ExportDefaultDeclaration') {
                if (path.node.declaration.type === 'ClassDeclaration') {
                    // TODO 可能存在其他情况吗
                    path.node.declaration.type = 'ClassExpression'
                }

                path.replaceWith(
                    t.variableDeclaration('const', [
                        t.variableDeclarator(t.identifier('RNAppClass'), path.node.declaration)
                    ])
                )
            }

            // module.exports = A => const RNAppClass = A
            if (path.type === 'AssignmentExpression'
                && path.node.operator === '='
                && path.node.left.type === 'MemberExpression'
                && path.node.left.object.name === 'module'
                && path.node.left.property.name === 'exports'
            ) {
                path.parentPath.replaceWith(
                    t.variableDeclaration('const', [
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

                // be lazy
                path.node.body.push(
                    t.expressionStatement(
                        t.identifier(`React.renderApp(RNAppClass)`)
                    )
                )


                /**
                 * 初始化路由
                 */

                // be lazy
                path.node.body.push(
                    t.expressionStatement(
                        t.identifier(`wx._historyConfig = {...(wx._historyConfig || {}), ...${JSON.stringify(historyMap, null)}}`)
                    )
                )

                // be lazy

                path.node.body.push(t.variableDeclaration(
                    'const',
                    [
                        t.variableDeclarator(
                            t.identifier('__pageCompPath'),
                            t.objectExpression(pageCompPaths)
                        )
                    ]
                ))
                path.node.body.push(
                    t.expressionStatement(
                        t.identifier(`wx._pageCompMaps = {...(wx._pageCompMaps || {}), ...__pageCompPath}`)
                    )
                )
            }
        }
    })

    const appJSONPATH = npath.resolve(global.execArgs.OUT_DIR, 'app.json')
    fse.writeFileSync(
        appJSONPATH,
        JSON.stringify(appJSON, null, '\t')
    )


    const entryRequirePath = filepath.replace(global.execArgs.OUT_DIR + npath.sep, '')
        .replace(/\\/g, '/')

    const appJSPATH = npath.resolve(global.execArgs.OUT_DIR, 'app.js')
    const appJSCode = `require('./${entryRequirePath}') 
wx._beta = ${global.execArgs.beta ? 'true' : 'false'}
App({})
    `
    fse.writeFileSync(
        appJSPATH,
        appJSCode
    )




    const entryCode = geneReactCode(ast, npath.extname(filepath))
    const dirname = npath.dirname(filepath)
    fse.mkdirsSync(dirname)

    const realFilePath = miscNameToJSName(filepath)
    fse.writeFileSync(
        realFilePath,
        entryCode
    )
    
    return {
        realFilePath,
        allCompSet: new Set(Object.values(compImportMap).map(compPath => compPath.replace('.comp', '')))
    }
}


function getOriginPath(source, filepath) {
    let originPath = null
    // 外部库， 外部库做为页面， 需要补全miniprogram_npm 路径
    if (!(source.startsWith('.') || source.startsWith('/'))) {
        originPath = `miniprogram_npm/${source}`
    } else {
        originPath = npath
            .resolve(npath.dirname(filepath), source)
            .replace(global.execArgs.OUT_DIR + npath.sep, '')
            .replace(/\\/g, '/') // 考虑win平台
    }
    return originPath
}