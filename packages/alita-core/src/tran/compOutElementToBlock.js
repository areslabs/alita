/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {isRenderReturn, getOriginal} from '../util/uast'
import errorLogTraverse from '../util/ErrorLogTraverse'
import {viewOrigin, innerTextOrigin, outerTextOrigin} from '../constants'

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
                && isRenderReturn(path)
            ) {
                const original = getOriginal(path)
                /*
                    没有origial属性的view，可能是直接使用的小程序内置组件，这个时候view可能有其他属性，故无法转化为block
                    有origial情况下，只有当origial为 innerTextOrigin / outerTextOrigin / viewOrigin 这3种，且无
                    onXXX 属性，才可以转换为block
                */
                if (original
                    && (
                        original === viewOrigin
                        || original === innerTextOrigin
                        || original === outerTextOrigin
                    )
                    && !hasEventAttri(path)
                ) {
                    path.node.name.name = 'block'

                    if (path.parentPath.node.closingElement) {
                        path.parentPath.node.closingElement.name.name = 'block'
                    }
                }
            }

        }
    })

    return ast

}

function hasEventAttri(path) {
    const attris = path.node.attributes
    return attris.find(attri => attri.type === 'JSXAttribute' && /^on/.test(attri.name.name))
}
