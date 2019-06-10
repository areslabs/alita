/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import traverse from "@babel/traverse"
import * as t from '@babel/types'


const historyPrefixSet = new Set([
    'push',
    'popTo',
    'popToWithProps',
    'replace'
])

export default function (ast, {isFuncComp}) {
    let leftIden = null
    traverse(ast, {
        exit: path => {
            /**
             * 由于小程序不存在global变量， 所以对于以下的变量会报错： x is not defined
             * 1. let a = 1;
             *    x;
             *    let b = 2
             *
             * 2. let a = x = 1
             *
             * 3. export default x = 1
             *
             * 由于第三种写法普遍存在， 这里处理以下， 将其转化为
             * const x = 1
             * export default x
             *
             * 函数式组件在后续会被处理为class组件，这里不需要处理
             *
             */

            if (!isFuncComp
                && path.type === 'ExportDefaultDeclaration'
                && path.node.declaration
                && path.node.declaration.type === 'AssignmentExpression'
                && path.node.declaration.left.type === 'Identifier'

            ) {
                //const dec = path.node.declaration

                leftIden = path.node.declaration.left.name

                path.replaceWith(
                    t.variableDeclaration(
                        'const',
                        [
                            t.variableDeclarator(t.identifier(leftIden), path.node.declaration.right),
                        ]
                    )
                )

                return
            }

            // 移除动画的注解， 小程序天然支持
            if (path.type === 'Decorator' && path.node.expression && path.node.expression.name === 'AnimationEnable') {
                path.remove()
                return
            }

            // 分包场景 区别同路径的情况
            if (path.type === 'CallExpression'
                && path.node.callee.type === 'MemberExpression'
                && path.node.callee.object.name === 'history'
                && historyPrefixSet.has(path.node.callee.property.name)
            ) {
                path.node.arguments.unshift(t.stringLiteral(global.execArgs.packageName))

                return
            }

            if (path.type === 'Program') {
                if (leftIden) {
                    path.node.body.push(
                        t.exportDefaultDeclaration(t.identifier(leftIden))
                    )
                }
            }
        }
    })

    return ast
}