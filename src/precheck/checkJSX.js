import traverse from "@babel/traverse";
import {RNCOMPSET} from '../constants'
import {printError, printWarn} from './util'

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const ignoreCompSet = new Set([
    'PureComponent',
    'HocComponent',
    'WrappedComponent',
    'Component'
])

const unsupportRNAPI = new Set([
    'NativeModules',
    'Keyboard',
    'PanResponder',
    'Linking',
    'LayoutAnimation',

    'AccessibilityInfo',
    'ActionSheetIOS',
    'AlertIOS',
    'AppRegistry',
    'AppState',
    'BackHandler',
    'CameraRoll',
    'Clipboard',
    'DatePickerAndroid',
    'Easing',
    'Geolocation',
    'ImageEditor',
    'ImagePickerIOS',
    'InteractionManager',
    'Keyboard',
    'LayoutAnimation',
    'Linking',
    'PanResponder',
    'PermissionsAndroid',
    'PushNotificationIOS',
    'Systrace',
    'TimePickerAndroid',
    'ToastAndroid',
    'Vibration',
])

const unsupportRNComponents = new Set([
    'DatePickerIOS',
    'ViewPagerAndroid',
    'StatusBar',
    'DatePickerAndroid',
    'DrawerAndroid',
    'MaskedView',
    'ProgressBarAndroid',
    'ProgressViewIOS',
    'SegmentedControlIOS',
    'TabBarIOS',
    'TimePickerAndroid',
    'ToastAndroid',
    'ToolbarAndroid',
    'ViewPager',
    'ImageBackground',

    'ActivityIndicator',
    'KeyboardAvoidingView',
    'MaskedViewIOS',
    'SafeAreaView',
    'ToolbarAndroid',
    'VirtualizedList'
])

const notSupportCommonAttris = new Set([
    'onLayout',
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

const backToView = new Set([
    'Image',
    'Text',
    'TextInner',
    'View',
    'TouchableHighlight',
    'TouchableOpacity',
    'TouchableWithoutFeedback',
])

/**
 *  在转化之前，提前check一次代码，并对错误给出友好提示。
 *
 *  printError： 后续转化停止 checkPass设置为false
 *  printWarn：  由于平台判断等情况存在，后续转化继续
 *
 * @param ast
 * @param filepath
 * @param rawCode
 */
export default function checkJSX(ast, filepath, rawCode) {
    let checkPass = true

    // 收集所有 import/require 组件
    const allModuleVarSet  = new Set([])

    // 单文件单组件
    let alreadyHasComponent = false

    // 收集所有JSX fun

    let jsxFuncs = new Set([])
    let hasJSXTag = false

    let hasAttributeJSXTag = false


    const ALLCPTCOMPMAP = global.execArgs.jsxPropsMap

    traverse(ast, {

        enter: path => {
            if (path.type === 'ImportDeclaration') {
                path.node.specifiers.forEach(item => {
                    allModuleVarSet.add(item.local.name)
                })
            }

            if (path.type === 'CallExpression'
                && path.node.callee.name === 'require'
                && path.node.arguments.length === 1
            ) {

                const pp = path.parentPath
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
            if (path.type === 'JSXOpeningElement') {

                if (path.node.name.type === 'JSXIdentifier') {
                    const name = path.node.name.name
                    if (!allModuleVarSet.has(name)) {
                        printError(filepath, path, rawCode, `组件${name}的导入，需要在import/require语句`)
                        checkPass = false
                    }

                }

            }


            if (path.type === 'ImportDeclaration' && path.node.source.value === 'react-native') {
                path.node.specifiers.forEach(item => {
                    const importedName = item.imported.name
                    const localName = item.local.name

                    if ((RNCOMPSET.has(importedName) || backToView.has(importedName)) && importedName !== localName) {
                        printError(filepath, path, rawCode, `导入RN组件的时候，不能使用import {xx as yy} 写法`)
                        checkPass = false
                    }
                })
            }

            if (path.type === 'ClassProperty' && path.node.key.name === 'wxNavigationOptions' && path.node.static === true) {
                const v = path.node.value

                v.properties.forEach(op => {
                    if (!op.value.type.endsWith('Literal')) {
                        printError(filepath, path, rawCode, `wxNavigationOptions 属性值，值需要是字面量`)
                        checkPass = false
                    }
                })
            }

            if ((path.type === 'ClassMethod' || path.type === 'ClassProperty') && hasJSXTag) {
                jsxFuncs.add(path.node.key.name)
            }

            if (path.type === 'JSXAttribute' && hasAttributeJSXTag) {
                const JSXName = path.parentPath.node.name.name
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
                    checkPass = false
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
                    checkPass = false
                }
            }

            if (path.node.name === "h") {
                printError(filepath, path, rawCode, `不允许声明/导入 名字为h的变量`)
                checkPass = false
            }

            if (path.node.name === 'HocComponent') {
                printError(filepath, path, rawCode, `HOC组件，需要使用React.createElement创建元素`)
                checkPass = false
            }
        },


        JSXSpreadAttribute: (path) => {
            const elementName = path.parentPath.node.name.name
            if (global.execArgs.allBaseComp.has(elementName) ||  backToView.has(elementName)) {
                printError(filepath, path, rawCode, `基本组件不支持属性展开`)
                checkPass = false
            }
        },

        JSXMemberExpression: path => {
            printWarn(filepath, path, rawCode, `小程序不允许存在<A.B/> 形式`)
        },


        ImportDeclaration: (path) => {
            const node = path.node
            if (node.source.value !== 'react-native') return

            node.specifiers.forEach(item => {
                if (item.local.name === 'Animated')  {
                    printWarn(filepath, path, rawCode, `不支持Animated组件， 需要使用@areslabs/wx-animated库替换`)
                }

                if (item.local.name === 'WebView') {
                    printWarn(filepath, path, rawCode, `小程序webview占满全屏，和RN不同, 避免使用`)
                }

                if (unsupportRNAPI.has(item.local.name)) {
                    printWarn(filepath, path, rawCode, `React Native API ${item.local.name}尚未支持，可以提个issue`)
                }

                if (unsupportRNComponents.has(item.local.name)) {
                    printWarn(filepath, path, rawCode, `React Native 组件 ${item.local.name}尚未支持，可以提个issue`)
                }
            })
        },

        JSXAttribute: (path) => {
            const node = path.node
            const name = node.name.name
            if (notSupportCommonAttris.has(name)) {
                printWarn(filepath, path, rawCode, `不支持${name}属性`)
            } else {
                const jop = path.parentPath
                const elementName = jop.node.name.name

                const jsxEleAttr = notSupportJSXElementAttris[elementName]
                if (jsxEleAttr && jsxEleAttr.has(name)) {
                    printWarn(filepath, path, rawCode, `组件${elementName}不支持${name}属性`)
                }
            }
        },

        ClassDeclaration: (path) => {
            const node = path.node
            if (isReactComp(node.superClass)) {
                if (alreadyHasComponent) {
                    printError(filepath, path, rawCode, `一个文件最多只允许存在一个组件`)
                    checkPass = false
                }

                alreadyHasComponent = true
            }
        },
    })


    traverse(ast, {


        // this.xx
        JSXAttribute(path) {
            const jsxOp = path.parentPath.node
            const JSXName = jsxOp.name.name
            const attrName = path.node.name.name

            if (RNCOMPSET.has(JSXName)) {
                return
            }

            // 配置的jsx属性，不需要check
            if (ALLCPTCOMPMAP[JSXName] && ALLCPTCOMPMAP[JSXName][attrName]) {
                return
            }

            if (path.node.value.type === 'JSXExpressionContainer'
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
            if (path.node.value.type === 'JSXExpressionContainer'
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

    return checkPass
}

function isReactComp(superClass) {
    if (!superClass) return false

    let suName = ""
    if (superClass.type === 'MemberExpression') {
        suName = superClass.property.name
    }

    if (superClass.type === 'Identifier')  {
        suName = superClass.name
    }

    if (suName === 'Component'
        || suName === 'PureComponent'
        || suName === 'StaticComponent'
    ) {
        return true
    }

    return false
}
