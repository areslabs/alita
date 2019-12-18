/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import errorLogTraverse from '../util/ErrorLogTraverse'
import * as t from "@babel/types"
import {InnerTemplateNamePrefix} from "../constants";
import {isJSXChild, isChildCompChild} from "../util/uast";
import {geneOrder} from '../util/util'
export default function addTempName (ast) {
    const go = geneOrder()
    errorLogTraverse(ast, {
        exit: path => {
            if (path.type === 'JSXElement'
                && (!isJSXChild(path) || isChildCompChild(path))
            ) {
                const jsxOp = path.node.openingElement

                const tempName = `${InnerTemplateNamePrefix}${go.next}`
                jsxOp.attributes.push(t.jsxAttribute(t.jsxIdentifier('tempName'), t.stringLiteral(tempName)))
            }


            if (path.type === 'JSXOpeningElement') {
                const jsxOp = path.node

                const key = `DIUU${go.next}`

                jsxOp.attributes.push(
                    t.jsxAttribute(t.jsxIdentifier('diuu'), t.stringLiteral(key))
                )
            }
        }
    })

    return ast

}