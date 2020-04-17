/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import errorLogTraverse from '../util/ErrorLogTraverse'

import * as t from '@babel/types'
import {decTemlate, isJSXChild, isChildCompChild, isChildComp, isRenderReturn} from '../util/uast';
import { isEventProp } from '../util/util';
import {wxBaseComp} from "../constants";
import {allBaseComp} from "../util/getAndStorecompInfos";
import { LayoutConstsMap } from '../constants'
import configure from '../configure'

/**
 * 生成template集合
 * @param ast
 * @param info
 * @returns {*}
 */
export default function(ast, info) {

    let directRenderJSX = false

    errorLogTraverse(ast, {
        exit: path => {
            if (path.type === 'JSXOpeningElement'
                && isRenderReturn(path)
            ) {
                directRenderJSX = true

                path.node.directRenderJSX = true
            }

        }
    })

    errorLogTraverse(ast, {
        enter: path => {
            if (path.type === 'JSXOpeningElement'
                && path.node.name.name !== 'template'
            ) {
                const diuuAttr = getAttr(path.node, 'diuu')
                path.node.diuu = diuuAttr.value.value
            }

            if (path.type === 'JSXOpeningElement') {
                const attris = path.node.attributes
                const layoutIdAttr = attris.filter(item => item.type === 'JSXAttribute' 
                                                && item.name.type === 'JSXIdentifier' 
                                                && item.name.name === LayoutConstsMap.LayoutEventKey)
                if (layoutIdAttr && layoutIdAttr.length) {
                    const id = layoutIdAttr[0].value.value
                    // 通过 key 是否存在，来判断是否是不是由数组渲染出来的，如果是的话，则调整下id生成规则
                    attris.push(
                        t.jsxAttribute(t.jsxIdentifier('id'), t.stringLiteral(`{{(key && key > 1) ? "${id}_" + key : "${id}"}}`))
                    )
                }
            }
        },


        exit: path => {
            if (path.type === 'JSXOpeningElement'
                && path.node.name.name === 'view') {

                const originAttr = getAttr(path.node, 'original')

                if (!originAttr) {
                    return
                }

                if (originAttr.value.value === 'ErrorView') {
                    path.node.attributes = [
                        t.jsxAttribute(
                            t.jsxIdentifier('style'),
                            t.stringLiteral('color: red; text-align: center;')
                        )
                    ]
                    return
                }


                const jsxOp = path.node
                // view节点由其他节点退化而来， 只保留hover-xxx, catchxxx, bindxxx属性
                jsxOp.attributes = jsxOp.attributes.filter(attri => {
                    if (attri.type === 'JSXAttribute'
                        && ( attri.name.name === 'style'
                            || attri.name.name === 'class'
                            || attri.name.name === 'id'
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



            if (path.type === "JSXOpeningElement"
                && allBaseComp.has(path.node.name.name)
            ) {
                const diuuKey = path.node.diuu

                const jsxOp = path.node

                const styleAttr = getAttr(jsxOp, 'style')
                if (!styleAttr) {
                    jsxOp.attributes.push(
                        t.jsxAttribute(t.jsxIdentifier('style'), t.stringLiteral(`{{t.s(${diuuKey}style)}}`))
                    )
                }

                // 把refreshControl的refreshing， onRefresh 属性移动到 ScrollView 上， 需要配合wx-react 使用
                if (path.node.name.name === 'WXScrollView') {
                    jsxOp.attributes.push(
                        t.jsxAttribute(t.jsxIdentifier('refreshing'), t.stringLiteral(`{{${diuuKey}refreshing}}`)),
                        t.jsxAttribute(t.jsxIdentifier('onRefreshPassed'), t.stringLiteral(`{{${diuuKey}onRefreshPassed}}`))
                    )
                }
            }

            if (path.type === 'JSXOpeningElement'
                && !(allBaseComp.has(path.node.name.name)
                    || wxBaseComp.has(path.node.name.name)
                    || configure.configObj.miniprogramComponents[path.node.name.name]
                )
            ) {
                const diuuKey = path.node.diuu

                const jsxOp = path.node


                jsxOp.attributes.push(
                    t.jsxAttribute(t.jsxIdentifier('style'), t.stringLiteral(`{{t.s(${diuuKey}style)}}`))
                )
                jsxOp.attributes.push(
                    t.jsxAttribute(t.jsxIdentifier('wx:if'), t.stringLiteral(`{{${diuuKey}style !== false}}`)),
                )

                return
            }


            if (path.type === 'JSXElement'
                && isChildComp(path.node.openingElement.name.name)
            ) {
                path.node.children = []
            }


            /**
             * 1. 独立JSX片段需要提取为 tempName
             * 2. <A>
             *        <B/>
             *        <B/>
             *     </A>
             *
             *    若A是自定义组件，需要将其children转化为 generic：抽象节点的形式，传递出去，也需要提取为  tempName
             */
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

            /**
             * 独立JSX片段可以能存在上报节点的情况， 所以必然要接收style属性，来处理上报之后的情况
             * 1. 当directRenderJSX 为false， 所有独立JSX片段 都可能上报 都需要有style属性
             * 2. 当directRenderJSX 为 true， 只有render的那个JSX片段需要上报，需要有style属性
             */
            if (path.type === 'JSXElement'
                && !isJSXChild(path)
            ) {
                const jsxOp = path.node.openingElement
                if (!directRenderJSX || jsxOp.directRenderJSX) {
                    const diuuKey = jsxOp.diuu

                    // 防止样式是直接字符串的形式
                    jsxOp.attributes = jsxOp.attributes.filter(attr => !(attr.type === 'JSXAttribute' && attr.name.name === 'style'))

                    jsxOp.attributes.push(
                        t.jsxAttribute(t.jsxIdentifier('style'), t.stringLiteral(`{{t.s(${diuuKey}style)}}`))
                    )
                }
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

                const diuuKey = jsxOp.diuu


                const attr = path.node


                if (wxBaseComp.has(jsxOp.name.name) || configure.configObj.miniprogramComponents[jsxOp.name.name]) {
                    // 小程序基本组件 view/button/input等

                    if (name === 'style') {
                        if (path.node.value.type === 'StringLiteral') {
                            // 微信基本组件 <view style="height: 90px"/>
                            return
                        } else {
                            attr.value = t.stringLiteral(`{{t.s(${diuuKey}style)}}`)
                        }
                        return
                    }

                    if (name === 'diuu') {
                        path.remove()
                        return
                    }

                    if (attr.value.type === 'JSXExpressionContainer') {
                        // 当小程序出现类似 <view class="{{x-y-z}}"/> 指绑定的时候会，会无效，需要处理
                        const yName = name.replace(/-/g, 'Y')
                        attr.value = t.stringLiteral(`{{${diuuKey}${yName}}}`)
                    }
                    return
                } else if (allBaseComp.has(jsxOp.name.name)) {
                    //RN 基本组件 Button, Switch的属性传递

                    if (isEventProp(name)) {
                        // 基本组件的方法参数, 不需要传递
                        path.remove()
                        return
                    }

                    if (name === 'style') {
                        if (path.node.value.type === 'StringLiteral') {
                            // 微信基本组件 <view style="height: 90px"/>
                            return
                        } else {
                            attr.value = t.stringLiteral(`{{t.s(${diuuKey}style)}}`)
                        }
                        return
                    }

                    if (name === 'diuu') {
                        attr.value.value = `{{${attr.value.value}}}`
                        return
                    }

                    if (attr.value.type === 'JSXExpressionContainer') {
                        attr.value = t.stringLiteral(`{{${diuuKey}${name}}}`)
                    }

                    return
                }  else {
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
