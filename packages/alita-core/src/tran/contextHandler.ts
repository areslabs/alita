/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as t from '@babel/types'
import errorLogTraverse from '../util/ErrorLogTraverse'
import {isJSXContextExpression} from '../util/uast'

export default function (ast, info) {
    errorLogTraverse(ast, {
        exit: path => {
            if (path.type === 'JSXMemberExpression' && isJSXContextExpression(path)) {
              const propertyName = path.node.property.name 
              if (propertyName === 'Provider'
                && path.parentPath.type === 'JSXOpeningElement'
              ) {
                const contextName = path.node.object.name
                const jsxPath = path.parentPath.parentPath
                const valueAttr = path.parentPath.node.attributes.find(a => t.isJSXIdentifier(a.name) && a.name.name === 'value')

                const value = t.isStringLiteral(valueAttr.value) ? valueAttr.value : valueAttr.value!.expression
                const expr = t.expressionStatement(t.callExpression(
                  t.memberExpression(t.identifier(contextName), t.identifier('Provider')),
                  [value]
                ))
        
                jsxPath.getStatementParent().insertBefore(expr)
                jsxPath.replaceWith(t.jsxElement(
                  t.jsxOpeningElement(t.jsxIdentifier('block'), []),
                  t.jsxClosingElement(t.jsxIdentifier('block')),
                  jsxPath.node.children,
                  false
                ))
              } else if (propertyName === 'Consumer'
                && path.parentPath.type === 'JSXOpeningElement'
              ) {
                const contextName = path.node.object.name
                const jsxPath = path.parentPath.parentPath
                const expressNode = jsxPath.node.children.find(node => node.type === 'JSXExpressionContainer')
                
                if (expressNode
                  && expressNode.expression
                  && expressNode.expression.type === 'ArrowFunctionExpression'
                ) {
                  const expr = t.callExpression(
                    t.memberExpression(
                      t.functionExpression(
                        null,
                        [],
                        t.blockStatement(
                          [
                            t.variableDeclaration(
                              'let',
                              [
                                t.variableDeclarator(
                                  expressNode.expression.params[0],
                                  t.callExpression(
                                    t.memberExpression(
                                      t.identifier(contextName),
                                      t.identifier('Consumer')
                                    ),
                                    [
                                      t.thisExpression()
                                    ]
                                  )
                                )
                              ]
                            ),
                            t.returnStatement(expressNode.expression.body)
                          ]
                        )
                      ),
                      t.identifier('call')
                    ),
                    [
                      t.thisExpression()
                    ]
                  )
                  jsxPath.replaceWith(t.jsxElement(
                    t.jsxOpeningElement(t.jsxIdentifier('block'), []),
                    t.jsxClosingElement(t.jsxIdentifier('block')),
                    [
                      t.jsxExpressionContainer(expr)
                    ],
                    false
                  ))
                  // console.log('expressNode', expressNode.expression.body)
                }
              }
            }
        }
    })
    return ast
}
