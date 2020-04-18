import * as t from '@babel/types'
import errorLogTraverse from "../util/ErrorLogTraverse"
import {elementAddClass} from '../util/uast'


/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


/**
 * 处理onLayout
 *
 * <View onLayout={() => {}}/> 转化为： <View class="m-lt" data-parent="{{parentDiuu}}"/>
 *
 * @param ast
 * @param info
 * @returns {any}
 */
export default function (ast, info) {

    errorLogTraverse(ast, {
        exit: path => {
            if (path.type === 'JSXOpeningElement') {

                const attris = path.node.attributes || []

                let hasLayout = false
                let hasDataDiuu = false
                let diuuValue = ""
                path.node.attributes = attris.filter(attr => {

                    if (attr.type === 'JSXAttribute' && attr.name.name === 'onLayout') {
                        hasLayout = true
                        return false
                    }

                    if (attr.type === 'JSXAttribute' && attr.name.name === 'data-diuu') {
                        hasDataDiuu = true
                    }

                    if (attr.type === 'JSXAttribute' && attr.name.name === 'diuu') {
                        diuuValue = attr.value.value
                    }

                    return true
                })

                if (!hasLayout) {
                    // 没有onLayout属性
                    return
                }

                elementAddClass(path.node, 'm-lt')


                path.node.attributes.push(
                    t.jsxAttribute(t.jsxIdentifier('data-parent'), t.stringLiteral(`{{parentDiuu}}`)),
                )

                if (!hasDataDiuu) {
                    path.node.attributes.push(
                        t.jsxAttribute(t.jsxIdentifier('data-diuu'), t.stringLiteral(`{{${diuuValue}}}`)),
                    )
                }
            }
        }
    })
    return ast
}

