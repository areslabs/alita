/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as npath from 'path'
import errorLogTraverse from '../util/ErrorLogTraverse'
import * as t from '@babel/types'
import {isStaticRes} from '../util/util'

import {geneOrder} from '../util/util'

import configure from '../configure'
import {LayoutConstsMap} from '../constants'

import {setEntryModuleInfo} from '../util/cacheModuleInfos'
import * as fse from "fs-extra";
import * as path from "path";


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


    const moduleMap = {}
    const pngMap = {}

    const pageInfos = []
    const tabInfos = []


    const go = geneOrder()
    errorLogTraverse(ast, {
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

                const originPath = getOriginPath(rs, filepath)
                const specifiers = pnode.specifiers
                specifiers.forEach(spe => {
                    const name = spe.local.name
                    moduleMap[name] = {
                        originPath,
                        // @ts-ignore
                        attri: spe.imported ? spe.imported.name:  'default',
                        source: source,
                    }//originPath
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

                const originPath = getOriginPath(rs, filepath)

                // @ts-ignore
                const id = path.parentPath.node.id
                if (id.type === 'Identifier') {
                    moduleMap[id.name] = {
                        originPath,
                        attri: '',
                        source: source,
                    }
                } else if (id.type === 'ObjectPattern') {
                    id.properties.map(pro => {
                        if (pro.type === 'ObjectProperty') {
                            moduleMap[pro.value.name] = {
                                originPath,
                                attri: pro.key.name,
                                source: source,
                            }
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
                let subpage = null

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

                    if (ele.name.name === 'subpage') {

                        if (ele.value.type === 'JSXExpressionContainer' && ele.value.expression.type === 'StringLiteral') {
                            subpage = ele.value.expression.value
                        }

                        if (ele.value.type === 'StringLiteral') {
                            subpage = ele.value.value
                        }
                    }
                })


                const name = compAttri.value.expression.name

                pageInfos.push({
                    comp: name,
                    subpage: subpage,
                    key: key,
                })

                pnode.attributes.push(t.jsxAttribute(t.jsxIdentifier('diuu'), t.stringLiteral(`DIUU${go.next}`)))

                if (subpage) {
                    // 分包的依赖将会被处理为异步加载，固这里需要处理其引用，以免报错
                    path.node.name.name = 'view'
                    path.parentPath.node.closingElement && (path.parentPath.node.closingElement.name.name = 'view')

                    // @ts-ignore
                    pnode.attributes = pnode.attributes.filter(attri => attri.name.name !== 'component')
                }

                return
            }

            // @ts-ignore
            if (path.type === 'JSXOpeningElement' && path.node.name.name === 'TabRouter') {
                const pp = path.parentPath
                // @ts-ignore
                const children = pp.node.children

                let initKey = null
                for(let i = 0; i< children.length; i++) {
                    const child = children[i]
                    if (child.type === 'JSXElement' && child.openingElement.name.name === 'Route') {
                        const oe = child.openingElement
                        const keyAttr = oe.attributes.filter(ele => ele.name.name === 'key')[0]

                        if (keyAttr.value.type === 'JSXExpressionContainer' && keyAttr.value.expression.type === 'StringLiteral') {
                            initKey = keyAttr.value.expression.value
                        }

                        if (keyAttr.value.type === 'StringLiteral') {
                            initKey = keyAttr.value.value
                        }

                        break
                    }
                }



                const tabBarElement: any = {
                    initKey: initKey,
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

                tabInfos.push(tabBarElement)
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

    const tabBarList = getTabbarList(tabInfos, pageInfos, moduleMap)
    if (tabBarList.length > 0) {
        appJSON.tabBar = {
            list: tabBarList,
        }
    }

    const {
        historyMap,
        pageCompPaths,
        pagePaths,
        pages,
        subpackages,
        removeModules,
        ensureStatements,
        allChunks
    } = miscPageInfos(pageInfos, moduleMap)

    configure.allChunks = allChunks

    appJSON.pages = pages
    if (subpackages.length > 0) {
        appJSON.subpackages = subpackages
    }


    errorLogTraverse(ast, {

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

            if (path.type === 'ImportDeclaration') {
                const pnode = path.node as t.ImportDeclaration
                const source = pnode.source.value

                if (removeModules.has(source)) {
                    path.remove()
                }

                return
            }

            if (path.type === 'CallExpression' && path.node.callee.type === 'Identifier' && path.node.callee.name === 'require'
            ) {
                // @ts-ignore
                const source = path.node.arguments[0].value

                if (removeModules.has(source)) {
                    path.parentPath.parentPath.remove()
                }

                return
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
                        t.identifier(`wx._historyConfig = ${JSON.stringify(historyMap, null)}`)
                    )
                )

                // be lazy
                pnode.body.push(t.expressionStatement(t.assignmentExpression(
                    '=',
                    t.identifier('wx._pageCompMaps'),
                    t.objectExpression(pageCompPaths)
                )))


                pnode.body.push(
                    t.expressionStatement(
                        t.identifier(`wx._getCompByPath = function(path) {
                        return new Promise((resolve) =>{
        if (wx._pageCompMaps[path]) {
            resolve(wx._pageCompMaps[path])
        } else {
            wx._pageCompMaps[path] = resolve
        }
    })
                        }`)
                    )
                )

                // 定义收集onLayout事件方法
                pnode.body.push(
                    t.expressionStatement(
                        t.identifier(`wx["${LayoutConstsMap.CollectOnLayoutEvent}"] = function(event, inst) {
                            if (!inst["${LayoutConstsMap.OnLayoutEvents}"]) {
                                inst["${LayoutConstsMap.OnLayoutEvents}"] = []
                            }
                            if (!inst["${LayoutConstsMap.OnLayoutIdMap}"]) {
                                inst["${LayoutConstsMap.OnLayoutIdMap}"] = {}
                            }
                            if (inst["${LayoutConstsMap.OnLayoutIdMap}"][event.id]) {
                                inst["${LayoutConstsMap.OnLayoutIdMap}"][event.id]++
                                event.id = event.id + '_' + inst["${LayoutConstsMap.OnLayoutIdMap}"][event.id]
                            } else {
                                inst["${LayoutConstsMap.OnLayoutIdMap}"][event.id] = 1
                            }
                            inst["${LayoutConstsMap.OnLayoutEvents}"].push(event)
                        }`)
                    )
                )

                // 定义触发onLayout事件方法
                pnode.body.push(
                    t.expressionStatement(
                        t.identifier(`wx["${LayoutConstsMap.UpdateLayoutEvents}"] = function(inst) {
                            if (inst["${LayoutConstsMap.OnLayoutEvents}"].length) {
                                inst["${LayoutConstsMap.OnLayoutEvents}"].forEach(event => {
                                    if (!event.selectorQuery) {
                                        event.selectorQuery = wx.createSelectorQuery().in(inst.getWxInst())
                                    }
                                    event.selectorQuery.select('#' + event.id).boundingClientRect().exec(function(res){
                                        if (res && res[0]) {
                                            if (!event.isRender) {
                                                event.isRender = true
                                                
                                                event.onLayout.call(inst, {
                                                    nativeEvent: {
                                                        layout: {
                                                            height: res[0].height,
                                                            width: res[0].width,
                                                            x: res[0].left,
                                                            y: res[0].top
                                                        }
                                                    }
                                                })
                                            }
                                        } else {
                                            event.isRender = false
                                        }
                                    })
                                })
                            }
                        }`)
                    )
                )

                ensureStatements.forEach(state => {
                    pnode.body.push(state)
                })
            }
        }
    })


    setEntryModuleInfo(filepath, {
        appJSON,
    })

    return {
        entryAst: ast,
        allCompSet: new Set(pagePaths)
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
 * @param filepath
 * @param source
 */
export function getFinalSource(filepath, source) {
    const originalPath = path
        .resolve(path.dirname(filepath), source)

    if (fse.existsSync(originalPath)) {
        return `${source}/index`
    }

    return source
}

function getTabbarList(tabInfos, pageInfos, moduleMap) {
    const tabBarList = []
    for (let i = 0; i < tabInfos.length; i++) {
        const tabInfo = tabInfos[i]

        const initKey = tabInfo.initKey
        const initCompInfo = pageInfos.filter(info => info.key === initKey)[0]

        // tab页必需在主包
        initCompInfo.subpage = null


        const projectRelativePath = moduleMap[initCompInfo.comp].originPath

        tabBarList.push({
            pagePath: projectRelativePath,
            text: tabInfo.text,
            iconPath: tabInfo.iconPath,
            selectedIconPath: tabInfo.selectedIconPath
        })
    }

    return tabBarList
}

function miscPageInfos(pageInfos, moduleMap) {
    const pages = []
    const subpages = {}
    const pagePaths = []
    const historyMap = {}
    const pageCompPaths = []

    const allChunks = ['_rn_']

    const removeModules = new Set()

    for (let i = 0; i < pageInfos.length; i++) {
        const info = pageInfos[i]
        const {comp, subpage, key} = info

        const projectRelativePath = moduleMap[comp].originPath
        pagePaths.push(projectRelativePath)

        if (!subpage) {
            pages.push(projectRelativePath)
            historyMap[key] = `/${projectRelativePath}`

            pageCompPaths.push(t.objectProperty(
                t.stringLiteral(projectRelativePath),
                t.identifier(comp)
            ))
        } else {
            if (!subpages[subpage]) {
                subpages[subpage] = []
            }

            subpages[subpage].push(comp)
            removeModules.add(moduleMap[comp].source)
            historyMap[key] = `/${subpage}/${projectRelativePath}`
        }
    }


    const ensureStatements = []
    const subpackages = []

    const allSubPages = Object.keys(subpages)
    for(let i = 0; i < allSubPages.length; i ++ ) {
        const subpage = allSubPages[i]

        allChunks.push(`${subpage}/_rn_`)

        const allComps = subpages[subpage]

        const depsStr = allComps.map(comp => `"${moduleMap[comp].source}"`)
            .join(',')

        let requireStr = allComps.map(comp => {
            const {source, attri} = moduleMap[comp]

            return `var ${comp} = require("${source}")${attri ? `.${attri}`: ''}`
        }).join(';')


        const pageCompResolve = allComps.map(comp => {
            return `
            compOrResolve = wx._pageCompMaps["${moduleMap[comp].originPath}"];
            if (typeof compOrResolve === "function") {
                compOrResolve(${comp});
            };
            wx._pageCompMaps["${moduleMap[comp].originPath}"] = ${comp};
            `
        }).join(';')


        let callbackStr = `(require) => {${requireStr}; 
        var compOrResolve;
        
        ${pageCompResolve}}`

        let chunkName = `"${subpage}/_rn_"`

        const ensureStatement = t.expressionStatement(t.identifier(`require.ensure([${depsStr}], ${callbackStr}, ${chunkName});`))

        ensureStatements.push(ensureStatement)

        subpackages.push({
            root: subpage,
            name: subpage,
            pages: allComps.map(comp => moduleMap[comp].originPath)
        })
    }


    return {
        pages,
        subpackages,
        ensureStatements,
        removeModules,
        pagePaths,
        historyMap,
        pageCompPaths,
        allChunks,
    }
}

