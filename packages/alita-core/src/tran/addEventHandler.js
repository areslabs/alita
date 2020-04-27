/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import errorLogTraverse from '../util/ErrorLogTraverse'

import * as t from "@babel/types"
import {wxBaseComp, touchableOpacityOrigin, touchableHighlightOrigin} from '../constants'

import {getOriginal} from '../util/uast'
import configure from "../configure";

export default function addEventHandler (ast) {
    errorLogTraverse(ast, {
        exit: path => {
            if (path.type === 'JSXOpeningElement'
                && path.node.name.name === 'view'
                && getOriginal(path)
            ) {

                const original = getOriginal(path)

                const diuu = getDiuu(path.node.attributes)

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

                    // image的事件
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

				if (!hasEvent) {
                	// 没有事件绑定
                	return
				}

				path.node.attributes.push(
					t.jsxAttribute(t.jsxIdentifier('data-diuu'), t.stringLiteral(`{{${diuu}}}`)),
					t.jsxAttribute(t.jsxIdentifier('hover-stop-propagation')),
				)


                if (original === touchableOpacityOrigin) {
                    path.node.attributes.push(
                        t.jsxAttribute(t.jsxIdentifier('hover-class'), t.stringLiteral(`{{${diuu}hoverClass}}`)),
						t.jsxAttribute(t.jsxIdentifier('hover-start-time'), t.stringLiteral("0")),
						t.jsxAttribute(t.jsxIdentifier('hover-stay-time'), t.stringLiteral("100")),
                    )
                }

                if (original === touchableHighlightOrigin) {
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
						t.jsxAttribute(t.jsxIdentifier('hover-start-time'), t.stringLiteral("0")),
						t.jsxAttribute(t.jsxIdentifier('hover-stay-time'), t.stringLiteral("100")),
                    )
                }

                return
            }

			/**
			 * 当直接使用小程序组件 view/text/image等
			 */
			if (path.type === 'JSXAttribute'
                && (path.node.name.name.startsWith('bind') || path.node.name.name.startsWith('catch'))
                && (wxBaseComp.has(path.parentPath.node.name.name)
                    || configure.configObj.miniprogramComponents[path.parentPath.node.name.name]
                )
            ) {
                path.node.value = t.stringLiteral('eventHandler')

                if (!path.parentPath.node.attributes.some(attr => attr.type === 'JSXAttribute' && attr.name.name === 'data-diuu')) {
                    const diuu = getDiuu(path.parentPath.node.attributes)
                    path.parentPath.node.attributes.push(
                        t.jsxAttribute(t.jsxIdentifier('data-diuu'), t.stringLiteral(`{{${diuu}}}`))
                    )
                }
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

