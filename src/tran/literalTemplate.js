/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import traverse from "@babel/traverse";
import * as t from "@babel/types"

/**
 * 如果 由childrenToTemplate生成的template 最终运行的结果是literal，那直接展示
 * @param ast
 * @param info
 * @returns {*}
 */
export default function literalTemplate (ast, info) {

    traverse(ast, {
        exit: path => {
            if (path.type === 'JSXElement'
                && isTextElement(path.node.openingElement)
            ) {
                const newChildren = []
                path.node.children.forEach(item => {
                    if (
                        item.type === 'JSXElement'
                        && item.openingElement.name.name === 'template'
                    ) {

                        let datakey = null
                        item.openingElement.attributes.forEach(attr => {
                            if (attr.type === 'JSXAttribute' && attr.name.name === 'wx:if') {
                                attr.name.name = 'wx:else'
                                attr.value = null
                            }

                            if (attr.type === 'JSXAttribute' && attr.name.name === 'datakey') {
                                datakey = attr.value.value
                            }
                        })

                        newChildren.push(
                            t.jsxText(`<block wx:if="{{t.l(${datakey})}}">{{${datakey}}}</block>`)
                        )
                    }

                    newChildren.push(item)
                })

                path.node.children = newChildren
            }

        }

    })

    return ast
}

function isTextElement(openingElement) {
    if (openingElement.name.name !== 'view') return false

    return openingElement.attributes.some(item =>
        item.type === 'JSXAttribute'
        && item.name.name === 'original'
        && (item.value.value === 'OuterText' || item.value.value === 'InnerText'))
}