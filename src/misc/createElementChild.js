/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {isBindElementByName} from '../util/uast'

/**
 * 对于属性是 字符串常量的 可以直接忽略
 * @returns {{visitor: {CallExpression: {exit: exit}}}}
 */

export default function () {
    const visitor = {
        CallExpression: {
            exit: path => {

                if (isReactCreateElement(path.node)) {
                    const argus = path.node.arguments

                    // template, cpt, block 直接返回
                    if (argus[0].type === 'StringLiteral') {
                        return
                    }


                    if (argus[0].type === 'Identifier'
                        && !isBindElementByName(argus[0].name)
                    ) {
                        return
                    }


                    const props = argus[1]


                    if (props.type === 'ObjectExpression') {
                        props.properties = props.properties.filter(pro => {
                            const key = pro.key.name
                            if (key === 'diuu'
                                || key === 'tempName'
                            ) {
                                return true
                            }


                            if (pro.value && pro.value.type === 'StringLiteral') {
                                return false
                            }

                            return true
                        })
                    }


                    path.node.arguments = path.node.arguments.filter((argu, index) => {
                        if (index < 2) {
                            return true
                        }

                        if (argu.type === 'StringLiteral') {
                            return false
                        }

                        return true
                    })
                }
            }
        }

    }

    return {
        visitor
    };
}


function isReactCreateElement(node) {
    if (node.type !== 'CallExpression') return false
    return node.callee.name && node.callee.name === 'h'
}