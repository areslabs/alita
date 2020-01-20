/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import errorLogTraverse from '../util/ErrorLogTraverse'

import * as t from "@babel/types"

export default function touchableToView (ast) {
    errorLogTraverse(ast, {
        exit: path => {
            if (path.type === 'JSXOpeningElement'
                && path.node.name.name === 'view'
                && getOriginal(path).startsWith('Touchable')
            ) {

                const original = getOriginal(path)

                const diuu = getDiuu(path.node.attributes)

                path.node.attributes.push(
                    t.jsxAttribute(t.jsxIdentifier('data-diuu'), t.stringLiteral(`{{${diuu}}}`)),
                    t.jsxAttribute(t.jsxIdentifier('hover-stop-propagation'), t.stringLiteral("")),
                    t.jsxAttribute(t.jsxIdentifier('hover-start-time'), t.stringLiteral("0")),
                    t.jsxAttribute(t.jsxIdentifier('hover-stay-time'), t.stringLiteral("100")),
                )


                path.node.attributes.forEach(attri => {
                    if (attri.type === 'JSXAttribute' && attri.name.name === 'onPress') {
                        attri.name.name = "catchtap"
                        attri.value = t.stringLiteral('eventHandler')
                    }

                    if (attri.type === 'JSXAttribute' && attri.name.name === 'onLongPress') {
                        attri.name.name = "catchlongpress"
                        attri.value = t.stringLiteral('eventHandler')
                    }
                })

                if (original === 'TouchableOpacity') {
                    path.node.attributes.push(
                        t.jsxAttribute(t.jsxIdentifier('hover-class'), t.stringLiteral(`{{${diuu}hoverClass}}`)),
                    )
                }

                if (original === 'TouchableHighlight') {
                    const jsxElement = path.parentPath.node

                    for(let i = 0; i < jsxElement.children.length; i ++) {
                        const child = jsxElement.children[i]
                        if (child.type === 'JSXElement') {
                            child.openingElement.attributes.push(
                                t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral('thFirst')),
                                t.jsxAttribute(t.jsxIdentifier('hover-class'), t.stringLiteral(`{{${diuu}hoverClass}}`)),
                            )
                            break;
                        }
                    }


                    jsxElement.children.push(
                        t.jsxText(`<view class="thFabricate" style="background-color: {{${diuu}underlayColor}}"/>`)
                    )


                    path.node.attributes.push(
                        t.jsxAttribute(t.jsxIdentifier('hover-class'), t.stringLiteral(`thHover`)),
                    )
                }

                return
            }

            if (path.type === 'JSXOpeningElement'
                && path.node.name.name === 'view'
                && getOriginal(path) === 'OuterText'
            ) {
                let hasEvent = false
                path.node.attributes.forEach(attri => {
                    if (attri.type === 'JSXAttribute' && attri.name.name === 'onPress') {
                        attri.name.name = "catchtap"
                        attri.value = t.stringLiteral('eventHandler')
                        hasEvent = true
                    }

                    if (attri.type === 'JSXAttribute' && attri.name.name === 'onLongPress') {
                        attri.name.name = "catchlongpress"
                        attri.value = t.stringLiteral('eventHandler')

                        hasEvent = true
                    }
                })

                const diuu = getDiuu(path.node.attributes)
                if (hasEvent) {
                    path.node.attributes.push(
                        t.jsxAttribute(t.jsxIdentifier('data-diuu'), t.stringLiteral(`{{${diuu}}}`)),
                        t.jsxAttribute(t.jsxIdentifier('hover-stop-propagation'), t.stringLiteral("true")),
                    )
                }

                return
            }

            if (path.type === 'JSXOpeningElement'
                && path.node.name.name === 'image'
            ) {

                let hasEvent = false
                path.node.attributes.forEach(attri => {
                    if (attri.type === 'JSXAttribute' && attri.name.name === 'onLoad') {
                        attri.name.name = "bindload"
                        attri.value = t.stringLiteral('eventHandler')
                        hasEvent = true
                    }

                    if (attri.type === 'JSXAttribute' && attri.name.name === 'onError') {
                        attri.name.name = "binderror"
                        attri.value = t.stringLiteral('eventHandler')

                        hasEvent = true
                    }
                })

                const diuu = getDiuu(path.node.attributes)
                if (hasEvent) {
                    path.node.attributes.push(
                        t.jsxAttribute(t.jsxIdentifier('data-diuu'), t.stringLiteral(`{{${diuu}}}`)),
                    )
                }

                return
            }
        }
    })

    return ast

}

function getDiuu(attris) {
    for(let i = 0; i< attris.length; i ++) {
        const item = attris[i]
        if (item.type === 'JSXAttribute' && item.name.name === 'diuu') {
            return item.value.value
        }
    }
}


function getOriginal(path) {
    const attris = path.node.attributes
    for (let i = 0; i< attris.length; i ++) {
        const item = attris[i]
        if (item.type === 'JSXAttribute' && item.name.name === 'original') {
            return item.value.value
        }
    }
    return ''
}
