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
 * 2. wxNavigationOptions 设置到 小程序的页面配置上
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



            // JSXExpressionContainer 只可能出现在3个地方： JSXAttribute，JSXElement， JSXFragment。 所以这里可以用else逻辑处理
            if (path.type === 'JSXExpressionContainer'
                && path.node.expression.type === 'StringLiteral'
            ) {
                const pp = path.parentPath

                if (pp.type === 'JSXAttribute') {
                    //  <A name={"yk"}/> 修改为 <A name="yk"/>
                    path.replaceWith(t.stringLiteral(path.node.expression.value))
                } else {
                    //  <A>{"yk"}</A> 修改为 <A>yk</A>
                    path.replaceWith(t.jsxText(path.node.expression.value))
                }
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