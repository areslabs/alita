/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {isRenderReturn, getOriginal, getAttri} from '../util/uast'
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
                && isRenderReturn(path)
				&& !getAttri(path, 'onLayout') // 有onLayout属性的，无法转化为block
            ) {
                const original = getOriginal(path)
                /*
                    没有origial属性的view，可能是直接使用的小程序内置组件，这个时候view可能有其他属性，故无法转化为block
                    同时也需要满足origial不是为TouchableWithoutFeedback、TouchableOpacity、TouchableHighlight、
                    AnimatedView、AnimatedImage和AnimatedText，因为origial为这些内容的话，可能需要在view元素绑定一
                    些事件（比如点击事件），如果退化为block，则事件就失效了
                */
                if (original
                    && original !== 'TouchableWithoutFeedback'
                    && original !== 'TouchableOpacity'
                    && original !== 'TouchableHighlight'
                    && original !== 'AnimatedView'
                    && original !== 'AnimatedImage'
                    && original !== 'AnimatedText'
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
