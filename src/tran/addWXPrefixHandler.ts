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

import {textComp} from '../util/getAndStorecompInfos'

/**
 * RN基本组件 添加前缀WX，以免RN button和小程序原生button 混淆
 * @param ast
 * @returns {*}
 */
export default function addWXPrefixHandler (ast, info?: any) {
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
    if (textComp.has(name) && isInText(path)) {
        path.node.name.name = `view`
        addViewOriginalAttri(path, "InnerText")
        return
    }

    if (textComp.has(name) && !isInText(path)) {
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

        return textComp.has(op.name.name)
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
                const nv = resizeMode(attri.value.value)
                attri.value.value = nv
            }
        }
    })
    // resizeMode在React Native上的默认值是cover
    if (!hasMode) {
        path.node.attributes.push(
            t.jsxAttribute(t.jsxIdentifier('mode'), t.stringLiteral('aspectFill'))
        )
    }
}

function addViewOriginalAttri(path, v) {
    if (path.type === 'JSXClosingElement') return

    path.node.attributes.push(
        t.jsxAttribute(t.jsxIdentifier('original'), t.stringLiteral(v))
    )
}


/**
 * 同 wx-react 里面的resizeMode 方法，注意修改的时候，要修改这两处
 * @param newVal
 * @returns {string}
 */
function resizeMode(newVal){
    if(newVal === 'cover'){
        return 'aspectFill';
    } else if (newVal === 'contain'){
        return 'aspectFit';
    } else if (newVal === 'stretch'){
        return 'scaleToFill';
    } else if (newVal === 'repeat') {
        console.warn('Image的resizeMode属性小程序端不支持repeat')
        return 'aspectFill'
    } else if (newVal === 'center') {
        return 'aspectFill'
    } else{
        return 'aspectFill';
    }
}