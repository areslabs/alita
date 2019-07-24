/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import traverse from '@babel/traverse';
import * as t from '@babel/types'
import {decTemlate, isBindElement, isJSXChild, isChildCompChild, isChildComp} from '../util/uast';
import { isEventProp } from '../util/util';

/**
 * 生成template集合
 * @param ast
 * @param info
 * @returns {*}
 */
export default function(ast, info) {

    traverse(ast, {
        exit: path => {
            if (path.type === 'JSXOpeningElement'
                && path.node.name.name === 'view') {
                const diuuKey = getDiuuKey(path)
                addStyleAttr(path, diuuKey)

                const jsxOp = path.node
                // view节点由其他节点退化而来， 只保留hover-xxx, catchxxx, bindxxx属性
                jsxOp.attributes = jsxOp.attributes.filter(attri => {
                    if (attri.type === 'JSXAttribute'
                        && ( attri.name.name === 'style'
                            || attri.name.name === 'class'
                            || attri.name.name === 'tempName'
                            || attri.name.name.startsWith('hover-')
                            || attri.name.name.startsWith('catch')
                            || attri.name.name.startsWith('bind')
                            || attri.name.name.startsWith('data-')
                            || attri.name.name === 'animation'
                        )
                    ) {
                        return true
                    }
                })

                return
            }

            if (path.type === 'JSXOpeningElement'
                && path.node.name.name !== 'template'
                && path.node.name.name !== 'view'
            ) {
                const diuuKey = getDiuuKey(path)
                addStyleAttr(path, diuuKey)


                const jsxOp = path.node
                // 把refreshControl的refreshing， onRefresh 属性移动到 ScrollView 上， 需要配合wx-react 使用
                if (path.node.name.name === 'WXScrollView') {
                    jsxOp.attributes.push(
                        t.jsxAttribute(t.jsxIdentifier('refreshing'), t.stringLiteral(`{{${diuuKey}refreshing}}`)),
                        t.jsxAttribute(t.jsxIdentifier('onRefreshPassed'), t.stringLiteral(`{{${diuuKey}onRefreshPassed}}`))
                    )
                }

                if(!isBindElement(jsxOp)) {
                    jsxOp.attributes.push(
                        t.jsxAttribute(t.jsxIdentifier('_r'), t.stringLiteral(`{{${diuuKey}R}}`)),
                    )
                }

                return
            }

            if (path.type === 'JSXElement'
                && isChildComp(path.node.openingElement.name.name)
            ) {
                path.node.children = []
            }

            if (path.type === 'JSXElement'
                && (!isJSXChild(path) || isChildCompChild(path))
            ) {
                const jsxOp = path.node.openingElement
                let tempName = ''
                jsxOp.attributes = jsxOp.attributes.filter(attr => {
                    if (attr.name && attr.name.name === 'tempName') {
                        tempName = attr.value.value
                        return false
                    }

                    return true
                })

                info.templates.push(decTemlate(tempName, path.node))
            }


            if (path.type === 'JSXSpreadAttribute') {
                path.remove()
            }

            if (path.type === 'JSXAttribute') {
                const name = path.node.name.name
                if (name === 'tempName') {
                    // 与生成template的name一致， 需要保留
                    return
                }

                if (name === 'tempVnode'
                    || name === 'CPTVnode'
                    || name === 'key'
                    || name === 'datakey'
                ) {
                    path.remove()
                    return
                }


                const jsxOp = path.parentPath.node

                if (jsxOp.name.name === 'template') {
                    return
                }


                const diuuAttr = getAttr(jsxOp, 'diuu')
                const diuuKey = diuuAttr.value.value


                const attr = path.node

                const isBaseElement = isBindElement(jsxOp)

                if (isBaseElement) {
                    // 基本组件的属性传递 依赖小程序
                    if (isEventProp(name)) {
                        // 基本组件的方法参数, 不需要传递
                        path.remove()
                        return
                    }

                    if (name === 'style') {
                        path.remove()
                        return
                    }

                    if (name === 'diuu') {
                        attr.value.value = `{{${attr.value.value}}}`
                        return
                    }

                    if (attr.value.type === 'JSXExpressionContainer') {
                        attr.value = t.stringLiteral(`{{${diuuKey}${name}}}`)
                    }

                } else {
                    // 自定义组件属性传递， 与小程序无关， 是react运行时在处理
                    if (name === 'diuu') {
                        attr.value.value = `{{${attr.value.value}}}`
                        return
                    }

                    // 小程序动画相关
                    if (name === 'animation') {
                        attr.value = t.stringLiteral(`{{${diuuKey}${name}}}`)
                        return
                    }

                    if (!name.startsWith('generic:')) {
                        path.remove()
                    }
                }
            }
        }
    })

    return ast
}

function getAttr(jsxOp, key) {
    for (let i = 0; i < jsxOp.attributes.length; i++) {
        const attr = jsxOp.attributes[i]

        if (attr.name && attr.name.name === key) {
            return attr
        }
    }
}

function getDiuuKey(path) {
    const jsxOp = path.node
    const diuuAttr = getAttr(jsxOp, 'diuu')

    let diuuKey = diuuAttr.value.value
    if (diuuKey.startsWith('{{')) {
        diuuKey = diuuKey.substring(2, diuuKey.length - 2)
    }

    return diuuKey
}

function addStyleAttr(path, diuuKey) {
    const jsxOp = path.node

    const styleAttr = getAttr(jsxOp, 'style')
    if (!styleAttr) {
        jsxOp.attributes.push(
            t.jsxAttribute(t.jsxIdentifier('style'), t.stringLiteral(`{{t.s(${diuuKey}style)}}`))
        )
    }
}
