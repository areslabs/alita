/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import errorLogTraverse from '../util/ErrorLogTraverse'
import * as t from "@babel/types"

import {isJSXChild, isChildCompChild, isChildComp, isTextElement} from "../util/uast";
import {geneOrder} from '../util/util'
export default function addTempName (ast, info) {

	let tempNameCount = geneOrder()
	let diuuCount = geneOrder('_') // _的传递，防止是 "diuu + 属性" 和 "diuu自增" 重复
	let datakeyCount = geneOrder()

	errorLogTraverse(ast, {
        exit: path => {
            if (path.type === 'JSXElement'
                && (!isJSXChild(path) || isChildCompChild(path, info.filepath))
            ) {
                const jsxOp = path.node.openingElement

                const tempName = tempNameCount.next
                jsxOp.attributes.push(t.jsxAttribute(t.jsxIdentifier('tempName'), t.stringLiteral(tempName)))
            }


			// 如果只使用一个child 小程序会报递归， 然后就不渲染了
			if (path.type === 'JSXElement'
				&& !isChildComp(path.node.openingElement.name.name, info.filepath)
			) {
				const children = path.node.children
				let tempName = null

				const isTextEle = isTextElement(path.node.openingElement)

				path.node.children = children.map(ele => {
					if (ele.type === 'JSXExpressionContainer') {

						if (!tempName) {
							tempName = tempNameCount.next
						}

						const datakey = datakeyCount.next


						const templateAttris = [
							t.jsxAttribute(t.jsxIdentifier('datakey'), t.stringLiteral(datakey)),
							t.jsxAttribute(t.jsxIdentifier('tempVnode'), ele),
							t.jsxAttribute(t.jsxIdentifier('wx:if'), t.stringLiteral(`{{${datakey}}} !== undefined`)),
							t.jsxAttribute(t.jsxIdentifier('is'), t.stringLiteral(tempName)),
							t.jsxAttribute(t.jsxIdentifier('data'), t.stringLiteral(`{{d: ${datakey}}}`))
						]

						if (isTextEle) {
							templateAttris.push(t.jsxAttribute(t.jsxIdentifier('isTextElement')))
						}

						return t.jsxElement(
							t.jsxOpeningElement(
								t.jsxIdentifier('template'),
								templateAttris
							),
							t.jsxClosingElement(
								t.jsxIdentifier('template')
							),
							[],
							true
						)
					}
					return ele
				})

				if (tempName && !isTextEle) {
					info.childTemplates.push(tempName)
				}
			}


            if (path.type === 'JSXOpeningElement') {
                const jsxOp = path.node

                const key = diuuCount.next

                jsxOp.attributes.push(
                    t.jsxAttribute(t.jsxIdentifier('diuu'), t.stringLiteral(key))
                )
            }
        }
    })

    return ast

}