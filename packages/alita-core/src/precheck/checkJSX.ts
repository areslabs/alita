/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import traverse from "@babel/traverse"
import * as t from '@babel/types'
import {RNCOMPSET, backToViewNode} from '../constants'
import {printError, printWarn} from './util'

import {jsxPropsMap, allBaseComp} from '../util/getAndStorecompInfos'


const ignoreCompSet = new Set([
    'PureComponent',
    'HocComponent',
    'WrappedComponent',
    'Component',
    'encodeURIComponent',
    'decodeURIComponent'
])

const supportRNAPI = new Set([
    'StyleSheet',
    'Platform',
    'Dimensions',
    'Alert',
    'PixelRatio',
    'AsyncStorage',
    'unstable_batchedUpdates',
])

const notSupportCommonAttris = new Set([
    'onStartShouldSetResponder',
    'onMoveShouldSetResponder',
    'onResponderGrant',
    'onResponderReject',
    'onResponderMove',
    'onResponderRelease',
    'onResponderTerminationRequest',
    'onResponderTerminate'
])

const notSupportJSXElementAttris = {
    FlatList: new Set([
        'ItemSeparatorComponent',
        'columnWrapperStyle',
        'extraData',
        'inverted',
        'onViewableItemsChanged',
        'progressViewOffset',
        'legacyImplementation',
    ]),
    ScrollView: new Set([
        'onMomentumScrollBegin',
        'onMomentumScrollEnd',
        'pagingEnabled',
        'scrollEnabled',
    ])
    //TODO 补充。。。
}

/**
 *  在转化之前，提前check一次代码，并对错误给出友好提示。
 *
 * @param ast
 * @param filepath
 * @param rawCode
 */
export default function checkJSX(ast, filepath, rawCode) {

    // 收集所有JSX fun

    let jsxFuncs = new Set([])
    let hasJSXTag = false

    let hasAttributeJSXTag = false


    const ALLCPTCOMPMAP = jsxPropsMap

    traverse(ast, {

        enter: path => {



            if (path.type === 'ClassMethod' || path.type === 'ClassProperty') {
                hasJSXTag = false
            }

            if (path.type === 'JSXAttribute') {
                hasAttributeJSXTag = false
            }

            if (path.type === 'JSXOpeningElement') {
                hasJSXTag = true
                hasAttributeJSXTag = true
            }

        },

        exit: path => {
            if (path.type === 'ImportDeclaration' && (path.node as t.ImportDeclaration).source.value === 'react-native') {
                ;(path.node as t.ImportDeclaration).specifiers.forEach(item => {
                    item = item as t.ImportSpecifier
                    const importedName = item.imported.name
                    const localName = item.local.name

                    if ((RNCOMPSET.has(importedName) || backToViewNode.has(importedName)) && importedName !== localName) {
                        printError(filepath, path, rawCode, `导入RN组件的时候，不能使用import {xx as yy} 写法`)

                    }
                })
            }

            // @ts-ignore
            if (path.type === 'ClassProperty' && path.node.key.name === 'wxNavigationOptions' && path.node.static === true) {
                // @ts-ignore
                const v = path.node.value

                v.properties.forEach(op => {
                    if (!op.value.type.endsWith('Literal')) {
                        printError(filepath, path, rawCode, `wxNavigationOptions 属性值，值需要是字面量`)

                    }
                })
            }

            if ((path.type === 'ClassMethod' || path.type === 'ClassProperty') && hasJSXTag) {
                // @ts-ignore
                jsxFuncs.add(path.node.key.name)
            }

            if (path.type === 'JSXAttribute' && hasAttributeJSXTag) {
                // @ts-ignore
                const JSXName = path.parentPath.node.name.name
                // @ts-ignore
                const attrName = path.node.name.name

                if (RNCOMPSET.has(JSXName)) {
                    return
                }

                // 配置的jsx属性，不需要check
                if (ALLCPTCOMPMAP[JSXName] && ALLCPTCOMPMAP[JSXName][attrName]) {
                    return
                }

                if (attrName.endsWith('Component')) {
                    return
                }


                printWarn(filepath, path, rawCode, `props为JSX片段的，属性名需要以Component结尾！可改为：<${JSXName} ${attrName}Component={...} >`)
            }
        },

        Identifier(path) {
            if (path.node.name === "children") {
                const p = path.parentPath
                if (p.type !== 'MemberExpression') {
                    printError(filepath, path, rawCode, `禁止直接使用children标识符，若是组件children属性this.props.children/props.children`)

                }
            }

            if (path.node.name.endsWith('Component')) {
                const name = path.node.name

                if (ignoreCompSet.has(name)) {
                    return
                }

                const p = path.parentPath
                if (p.type !== 'MemberExpression') {
                    printError(filepath, path, rawCode, `禁止使用xxComponent标识符，若是组件属性请使用this.props.xxComponent/props.xxComponent 替换`)

                }
            }

            if (path.node.name === "h") {
                printError(filepath, path, rawCode, `不允许声明/导入 名字为h的变量`)

            }

            if (path.node.name === 'HocComponent') {
                printError(filepath, path, rawCode, `HOC组件，需要使用React.createElement创建元素`)

            }
        },


        JSXSpreadAttribute: (path) => {
            // @ts-ignore
            const elementName = path.parentPath.node.name.name
            if (allBaseComp.has(elementName) ||  backToViewNode.has(elementName)) {
                printError(filepath, path, rawCode, `基本组件不支持属性展开`)

            }
        },

        JSXMemberExpression: path => {
            printWarn(filepath, path, rawCode, `小程序不允许存在<A.B/> 形式`)
        },


        ImportDeclaration: (path) => {
            const node = path.node
            if (node.source.value !== 'react-native') return

            node.specifiers.forEach(item => {
                if (backToViewNode.has(item.local.name)
                    || RNCOMPSET.has(item.local.name)
                    || supportRNAPI.has(item.local.name)
                    || item.local.name === 'RefreshControl'
                    || item.local.name === 'StatusBar'
                ) {
                    return
                }

                if (item.local.name === 'Animated')  {
                    printWarn(filepath, path, rawCode, `不支持Animated组件， 需要使用@areslabs/wx-animated库替换`)
                }

                if (item.local.name === 'WebView') {
                    printWarn(filepath, path, rawCode, `小程序webview占满全屏，和RN不同, 避免使用`)
                }

                printWarn(filepath, path, rawCode, `React Native ${item.local.name}尚未支持`)
            })
        },

        JSXAttribute: (path) => {
            const node = path.node
            const name = node.name.name as string
            if (notSupportCommonAttris.has(name)) {
                printWarn(filepath, path, rawCode, `不支持${name}属性`)
            } else {
                const jop = path.parentPath
                // @ts-ignore
                const elementName = jop.node.name.name

                const jsxEleAttr = notSupportJSXElementAttris[elementName]
                if (jsxEleAttr && jsxEleAttr.has(name)) {
                    printWarn(filepath, path, rawCode, `组件${elementName}不支持${name}属性`)
                }
            }
        },
    })


    traverse(ast, {


        // this.xx
        JSXAttribute(path) {
            const jsxOp = path.parentPath.node as t.JSXOpeningElement
            const JSXName = (jsxOp.name as t.JSXIdentifier).name
            const attrName = path.node.name.name as string

            if (RNCOMPSET.has(JSXName)) {
                return
            }

            // 配置的jsx属性，不需要check
            if (ALLCPTCOMPMAP[JSXName] && ALLCPTCOMPMAP[JSXName][attrName]) {
                return
            }

            if (path.node.value
                && path.node.value.type === 'JSXExpressionContainer'
                && path.node.value.expression
                && path.node.value.expression.type === 'MemberExpression'
                && path.node.value.expression.object.type === 'ThisExpression'
            ) {
                const name = path.node.value.expression.property.name

                if (jsxFuncs.has(name) && !attrName.endsWith('Component')) {
                    printWarn(filepath, path, rawCode, `props为JSX片段的，属性名需要以Component结尾！可改为<${JSXName} ${attrName}Component={...}>`)
                }
            }


            // this.xx.bind(this)
            if (path.node.value
                && path.node.value.type === 'JSXExpressionContainer'
                && path.node.value.expression
                && path.node.value.expression.type === 'CallExpression'
                && path.node.value.expression.callee.type === 'MemberExpression'
                && path.node.value.expression.callee.property.name === 'bind'
                && path.node.value.expression.arguments.length > 0
                && path.node.value.expression.arguments[0].type === 'ThisExpression'
            ) {

                const obj = path.node.value.expression.callee.object

                if (obj.type === 'MemberExpression'
                    && obj.object.type === 'ThisExpression'

                ) {
                    const name = obj.property.name
                    if (jsxFuncs.has(name) && !attrName.endsWith('Component')) {
                        printWarn(filepath, path, rawCode, `props为JSX片段的，属性名需要以Component结尾！可改为<${JSXName} ${attrName}Component={...}/>`)
                    }
                }
            }
        },
    })


}
