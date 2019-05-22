/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import traverse from "@babel/traverse";
import {RNCOMPSET} from "../constants";
import * as t from "@babel/types";
import {RNWXLIBMaps} from "../util/util";

/**
 * RN基本组件 添加前缀WX，以免RN button和小程序原生button 混淆
 * @param ast
 * @returns {*}
 */
export default function addWXPrefixHandler (ast) {
    let hasTextInner = false
    traverse(ast, {
        exit: path => {
            if (path.type === 'JSXOpeningElement') {
                addWXPrefix(path)

                if (isInText(path)) {
                    hasTextInner = true
                }
                return
            }

            if (path.type === 'JSXClosingElement') {
                addWXPrefix(path)
                return
            }

            // Text.propTypes 类似这种
            if (path.type === 'Identifier'
                && path.key !== 'property'
                && RNCOMPSET.has(path.node.name)

            ) {
                path.node.name = `WX${path.node.name}`
                return
            }


            if (path.type === 'Program') {
                const body = path.node.body
                if(hasTextInner) {
                    body.unshift(
                        t.expressionStatement(t.identifier(`import {WXTextInner} from '${RNWXLIBMaps["react-native"]}'`))
                    )
                }
                return
            }
        }
    })

    return ast

}

function addWXPrefix(path) {

    // Picker.Item
    if (path.node.name.type === 'JSXMemberExpression') {
        const name = path.node.name.object.name
        if (RNCOMPSET.has(name)) {
            path.node.name.object.name = `WX${name}`
        }

        return
    }


    const name = path.node.name.name

    if (name === 'View'
        || name === 'AnimatedView'
        || name === 'AnimatedText'
        || name === 'TouchableWithoutFeedback'
        || name === 'TouchableOpacity'
        || name === 'TouchableHighlight'
    ) {
        path.node.name.name = `view`
        addViewOriginalAttri(path, name)
        return
    }

    if (name === 'Image' || name === 'AnimatedImage') {
        path.node.name.name = 'image'
        renameImageSourceAttri(path)
        return
    }

    // Text 特殊需要处理
    if (name === 'Text' && isInText(path)) {
        path.node.name.name = `view`
        addViewOriginalAttri(path, "InnerText")
        return
    }

    if (name === 'Text' && !isInText(path)) {
        path.node.name.name = `view`
        addViewOriginalAttri(path, "OuterText")
        return
    }

    if (RNCOMPSET.has(name)) {
        path.node.name.name = `WX${name}`
    }
}

function isInText(path) {
    if (path.parentPath.parentPath.node.openingElement) {
        const op = path.parentPath.parentPath.node.openingElement

        if (op.name.name === 'view') {
            return  op.attributes.some(attri => {
                return attri.type === 'JSXAttribute'
                    &&  attri.name.name === 'original'
                    && attri.value.value === 'OuterText'
            })
        }


        return (
            op.name.name === 'Text'
        )
    }
    return false
}

function renameImageSourceAttri(path) {
    if (path.type === 'JSXClosingElement') return

    let hasMode = false
    path.node.attributes.forEach(attri => {
        if (attri.type === 'JSXAttribute' && attri.name.name === 'source') {
            attri.name.name = 'src'
        }

        if (attri.type === 'JSXAttribute' && attri.name.name === 'resizeMode') {
            hasMode = true
            attri.name.name = 'mode'

            if (attri.value.type === 'StringLiteral') {
                attri.value = t.jsxExpressionContainer(t.StringLiteral(attri.value.value))
            }
        }
    })
    // resizeMode在React Native上的默认值是cover
    if (!hasMode) {
        path.node.attributes.push(
            t.jsxAttribute(t.jsxIdentifier('mode'), t.jsxExpressionContainer(t.StringLiteral('cover')))
        )
    }
}

function addViewOriginalAttri(path, v) {
    if (path.type === 'JSXClosingElement') return

    path.node.attributes.push(
        t.jsxAttribute(t.jsxIdentifier('original'), t.stringLiteral(v))
    )
}