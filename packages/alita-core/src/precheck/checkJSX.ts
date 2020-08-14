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
import {isReactFragmentExpression, isJSXContextExpression} from '../util/uast'

import { allBaseComp} from '../util/getAndStorecompInfos'


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
    traverse(ast, {

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


        },

        Identifier(path) {

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
            if (isReactFragmentExpression(path.node)
                || isJSXContextExpression(path)) return
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

}
