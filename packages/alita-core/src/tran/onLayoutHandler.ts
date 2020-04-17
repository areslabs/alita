/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

 /**
 * 收集 JSX 中的所有 onLayout 事件
 * @param ast
 * @param info
 * @returns {*}
 */

import errorLogTraverse from '../util/ErrorLogTraverse'
import {LayoutConstsMap} from '../constants'
import * as t from "@babel/types"

let id = 1

export default function onLayoutHandler (ast, info) {
    let hasOnLayoutAttr = false

    errorLogTraverse(ast, {
        enter: path => {
            if (path.type === 'JSXOpeningElement') {
                const attris = path.node.attributes
                const onLayoutAttr = attris.filter(item => item.type === 'JSXAttribute' 
                                                && item.name.type === 'JSXIdentifier' 
                                                && item.name.name === 'onLayout'
                                                && item.value.type === 'JSXExpressionContainer')

                if (onLayoutAttr && onLayoutAttr.length)  {
                    hasOnLayoutAttr = true
                    const elementId = `${LayoutConstsMap.LayoutEventPrefix}_${id++}`
                    attris.push(
                        t.jsxAttribute(t.jsxIdentifier(LayoutConstsMap.LayoutEventKey), t.stringLiteral(elementId))
                    )
                    attris.push(
                        t.jsxAttribute(
                            t.jsxIdentifier(LayoutConstsMap.CollectOnLayoutEvent), 
                            t.jsxExpressionContainer(
                                t.callExpression(
                                    t.memberExpression(
                                        t.memberExpression(
                                            t.thisExpression(),
                                            t.identifier(LayoutConstsMap.CollectOnLayoutEvent)
                                        ),
                                        t.identifier('bind')
                                    ),
                                    [t.thisExpression()]
                                )
                            )
                        )
                    )
                }
            }

        },

        exit: path => {
            if (path.type === 'ClassBody' && hasOnLayoutAttr) {
                path.node.body.push(
                    t.classMethod(
                        'method', 
                        t.identifier(LayoutConstsMap.CollectOnLayoutEvent), 
                        [t.identifier('event')], 
                        t.blockStatement([
                            t.expressionStatement(
                                t.callExpression(
                                    t.memberExpression(
                                        t.identifier('wx'),
                                        t.identifier(LayoutConstsMap.CollectOnLayoutEvent)
                                    ),
                                    [t.identifier('event'), t.thisExpression()]
                                )
                            ) 
                        ])
                    )
                )
                path.node.body.push(
                    t.classMethod(
                        'method',
                        t.identifier(LayoutConstsMap.UpdateLayoutEvents),
                        [], 
                        t.blockStatement([
                            t.expressionStatement(
                                t.callExpression(
                                    t.memberExpression(
                                        t.identifier('wx'),
                                        t.identifier(LayoutConstsMap.UpdateLayoutEvents)
                                    ),
                                    [t.thisExpression()]
                                )
                            ) 
                        ])
                    )
                )
            }
        }

    })
    return ast
}
