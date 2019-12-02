/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as npath from 'path'
import * as fse from 'fs-extra'
import traverse from "@babel/traverse"
import * as t from '@babel/types'
import {isStaticRes, miscNameToJSName} from '../util/util'

import {geneOrder} from '../util/util'

import configure from '../configure'


const appJSON: any = {
    pages: [
    ],

    window: {
        "backgroundTextStyle":"light",
        'backgroundColor': '#E9E9E9',
        'enablePullDownRefresh': false,
    },
}

export default function (ast, filepath, webpackContext) {

    const historyMap = {}
    const pageCompPaths = []

    const moduleMap = {}
    const compImportMap = {}
    const pngMap = {}


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
                const rs = getRealSource(source, filepath)
                path.node.source.value = rs

                const originPath = getOriginPath(rs, filepath)
                const specifiers = path.node.specifiers
                specifiers.forEach(spe => {
                    const name = spe.local.name
                    moduleMap[name] = originPath
                })

                return
            }

            // require 目录 小程序不支持需要处理
            if (path.type === 'CallExpression'
                && path.node.callee.type === 'Identifier'
                && path.node.callee.name === 'require'
            ) {
                const source = path.node.arguments[0].value
                const rs = getRealSource(source, filepath)
                path.node.arguments[0].value = rs


                const originPath = getOriginPath(rs, filepath)

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


                const pageCompPath = configure.configObj.subDir.endsWith('/') ? configure.configObj.subDir + projectRelativePath : configure.configObj.subDir  + '/' + projectRelativePath

                historyMap[configure.configObj.subDir + key]
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



                const tabBarElement: any = {
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

    webpackContext.emitFile(
        'app.json',
        JSON.stringify(appJSON, null, '\t')
    )



    const appJSCode = `require('./_rn_.js')
App({})
    `
    webpackContext.emitFile(
        'app.js',
        appJSCode
    )


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

/**
 * 获取 最终的导入路径，如果导入的是目录，需要补全index
 * 如果导入的是组件，需要添加.comp
 * @param filepath
 * @param source
 */
function getFinalSource(filepath, source) {
    const originalPath = npath
        .resolve(npath.dirname(filepath), source)
        .replace(/\\/g, '/')

    const extname = npath.extname(filepath)

    let fileSufix = '.js'
    let backupSufix = '.ts'
    if (extname === '.ts' || extname === '.tsx') {
        fileSufix = '.ts'
        backupSufix = '.js'
    }

    let finalSource = getFinalSourceByExtname(fileSufix, originalPath, source)

    // backupSufix 重新查找
    if (!finalSource) {
        finalSource = getFinalSourceByExtname(backupSufix, originalPath, source)
    }

    if (!finalSource) {
        console.log(`${filepath.replace(configure.inputFullpath, '')}: 未找到${source}模块！`.error)
    }
    return finalSource
}

function getFinalSourceByExtname(fileSufix, originalPath, source) {
    const allFiles = [
        `${originalPath}.wx${fileSufix}`,
        `${originalPath}${fileSufix}`,
        `${originalPath}.wx${fileSufix}x`,
        `${originalPath}${fileSufix}x`
    ]

    for(let i = 0; i < allFiles.length; i ++ ) {
        const filePath = allFiles[i]

        if (fse.existsSync(filePath)) {
            return source
        }
    }

    const indexFiles = npath.resolve(originalPath, 'index')
    const allIndexFiles = [
        `${indexFiles}.wx${fileSufix}`,
        `${indexFiles}${fileSufix}`,
        `${indexFiles}.wx${fileSufix}x`,
        `${indexFiles}${fileSufix}x`
    ]

    for(let i = 0; i < allIndexFiles.length; i ++ ) {
        const filePath = allIndexFiles[i]

        if (fse.existsSync(filePath)) {
            return `${source}/index`
        }
    }
}