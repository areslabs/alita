/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import traverse from "@babel/traverse";
import * as t from "@babel/types"

import {getPropsChain, isReactComponent} from '../util/uast'


/**
 * 预处理
 * 1. <A name={"yk"}/> 修改为 <A name="yk"/>
 *
 * 2. wxNavigationBarTitleText 设置到 小程序的 window.navigationBarTitleText
 *
 * 3. 移除JSX里面的注释
 *
 * ...
 *
 * @param ast
 * @param info
 * @returns {*}
 */
export default function compPreHandle(ast, info) {
    traverse(ast, {
        exit: path => {
            // 移除注释
            if (path.node.leadingComments) {
                path.node.leadingComments = []
            }
            if (path.node.trailingComments) {
                path.node.trailingComments = []
            }


            // 标明组件的无状态信息，render的时候会使用
            if (path.type === 'ClassDeclaration' && isReactComponent(path.node.superClass)) {
                const statelessCp = t.classProperty(
                    t.identifier('__stateless__'),
                    t.booleanLiteral(info.isStatelessComp),
                )
                path.node.body.body.push(statelessCp)
                return
            }


            //  <A name={"yk"}/> 修改为 <A name="yk"/>
            if (path.type === 'JSXAttribute'
                && path.node.value
                && path.node.value.type === 'JSXExpressionContainer'
                && path.node.value.expression.type === 'StringLiteral'
            ) {
                path.node.value = path.node.value.expression
                return
            }

            if (path.type === 'ClassProperty'
                && path.node.static
                && path.node.key.name === 'wxNavigationOptions'
            ) {
                const v = path.node.value
                if (v.type === 'ObjectExpression') {
                    const props = v.properties
                    for(let i = 0; i < props.length; i++) {
                        const p = props[i]
                        const k = p.key.name
                        const v = p.value.value
                        info.json[k] = v
                    }
                }
                return
            }


            // 去掉注释 {/**/}
            if (path.type === 'JSXEmptyExpression') {
                path.parentPath.remove()
                return
            }
        }
    })

    return ast
}