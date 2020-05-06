/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as t from '@babel/types'
import errorLogTraverse from '../util/ErrorLogTraverse'
import {isReactFragment} from '../util/uast'
import {reactFragmentFlag} from '../constants'

/**
 * 处理 <> xxx </> 和  <React.Fragment> xxx </React.Fragment> 
 *
 * 上述写法转化为： <block> xxx </block>
 *
 * @param ast
 * @param info
 * @returns {any}
 */
export default function (ast, info) {

    errorLogTraverse(ast, {
        exit: path => {
            if (path.type === 'JSXFragment') {
                replaceElement(path)
            }
            if (path.type === 'JSXElement') {
                if (isReactFragment(path.node.openingElement)
                    && isReactFragment(path.node.closingElement)
                ) {
                    replaceElement(path)
                }
            }
        }
    })
    return ast
}

function replaceElement(path) {
    let newEle = t.jsxElement(
        t.jsxOpeningElement(
            t.jsxIdentifier('block'),
            [
                t.jsxAttribute(t.jsxIdentifier(reactFragmentFlag), t.jsxExpressionContainer(t.booleanLiteral(true)))
            ]
        ), 
        t.jsxClosingElement(
            t.jsxIdentifier('block')
        ),
        path.node.children,
        true
    )
    path.replaceWith(newEle)
}
