/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {isRenderReturn, getOriginal} from '../util/uast'
import errorLogTraverse from '../util/ErrorLogTraverse'

/**
 * 微信小程序自定义节点会退化为 view， 故把render 直接下的view 替换为block，减少组件层级
 * @param ast
 * @param info
 * @returns {*}
 */
export default function compOutElementToBlock (ast, info) {
    if (info.isPageComp) return ast

    errorLogTraverse(ast, {
        exit: path => {
            if (path.type === 'JSXOpeningElement'
                && path.node.name.name === 'view'
                && getOriginal(path)
                && isRenderReturn(path)
            ) {
                path.node.name.name = 'block'

                if (path.parentPath.node.closingElement) {
                    path.parentPath.node.closingElement.name.name = 'block'
                }
            }

        }
    })

    return ast

}
