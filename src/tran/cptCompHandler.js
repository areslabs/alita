/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import traverse from "@babel/traverse"
import {InnerComponentNamePrefix, RNCOMPSET} from "../constants"
import * as t from "@babel/types"
import {geneOrder, getGenericName} from "../util/util"
import {getPropsChain, isChildComp} from "../util/uast"


export default function addWXPrefixHandler (ast, info) {
    const ALLCPTCOMPMAP = global.execArgs.jsxPropsMap
    const go = geneOrder()
    traverse(ast, {
        enter: path => {
            // 处理直接是<V>{this.props.children}</V> 这种情况
            if (path.type === 'JSXExpressionContainer'
                && path.node.expression.type === 'MemberExpression'
            ) {
                const pc = getPropsChain(path.node.expression)

                let directSlot = false
                if (pc.length === 2
                    && pc[0] === 'props'
                    && pc[1] === 'children') {
                    directSlot = true
                }

                if (pc.length === 3
                    && pc[0] === 'this'
                    && pc[1] === 'props'
                    && pc[2] === 'children') {
                    directSlot = true
                }

                if (directSlot) {
                    path.replaceWith(
                        t.jsxExpressionContainer(
                            t.callExpression(
                                t.memberExpression(
                                    path.node.expression,
                                    t.identifier('map')
                                ),

                                [
                                    t.arrowFunctionExpression(
                                        [
                                            t.identifier('item'),
                                            t.identifier('index'),
                                        ],

                                        t.blockStatement([
                                            t.returnStatement(
                                                t.jsxElement(
                                                    t.jsxOpeningElement(t.jsxIdentifier('block'), [t.jsxAttribute(t.jsxIdentifier('key'), t.jsxExpressionContainer(t.identifier('index')))]),
                                                    t.jsxClosingElement(t.jsxIdentifier('block')),
                                                    [
                                                        t.jsxExpressionContainer(t.memberExpression(path.node.expression, t.identifier('index'), true))
                                                    ],
                                                    false
                                                )
                                            )
                                        ])
                                    )
                                ]
                            )
                        )
                    )
                    return
                }
            }


        },

        exit: path => {
            // 基本组件的 props = xxComponent / renderItem 等
            if (path.type === 'JSXAttribute') {
                const jsxOp = path.parentPath.node
                const name = jsxOp.name.name
                //不一定是CPT属性
                if (ALLCPTCOMPMAP[name] && ALLCPTCOMPMAP[name][path.node.name.name]) {
                    // 有可能是<V xComponent={this.props.yComponent}/> 这种情况， 这种情况在下面MemberExpression 已经处理
                    const genericName = `generic:${ALLCPTCOMPMAP[name][path.node.name.name]}`
                    if (jsxOp.attributes.some(ele => ele.name.name === genericName)) {
                        return
                    }

                    const key = `${InnerComponentNamePrefix}${go.nextString}`
                    jsxOp.attributes.push(
                        t.jsxAttribute(t.jsxIdentifier(genericName), t.stringLiteral(key))
                    )

                    info.outComp.push(key)

                    return
                }
            }

            // 处理<A xxComponent={}/>
            if (path.type === 'JSXAttribute'
                && path.node.name.name.endsWith('Component')
            ) {

                const jsxOp = path.parentPath

                const jsxName = jsxOp.node.name.name
                if (jsxName.startsWith('WX') && RNCOMPSET.has(jsxName.substring(2))) {
                    return
                }


                // 有可能是<V xComponent={this.props.yComponent}/> 这种情况， 这种情况在下面MemberExpression 已经处理
                const genericName = `generic:${getGenericName(path.node.name.name)}`
                if (jsxOp.node.attributes.some(ele => ele.name.name === genericName)) {
                    return
                }


                const key = `${InnerComponentNamePrefix}${go.nextString}`
                jsxOp.node.attributes.push(
                    t.jsxAttribute(t.jsxIdentifier(genericName), t.stringLiteral(key))
                )

                info.outComp.push(key)
                return
            }


            // 处理this.props.children
            // TODO 只支持 <V>{this.props.children}</V> <V>{props.children}</V>  （直接引用children的需要直接在jsx标签内部）
            // this.props.children[index]  props.children[index]
            // 处理this.props.xxComponent
            if (path.type === 'MemberExpression') {
                const pc = getPropsChain(path.node)


                let compGenericName = null
                if (pc.length === 2
                    && pc[0] === 'props'
                    && (pc[1].endsWith('Component') || pc[1] === 'children')) {

                    if (pc[1] === 'children') {
                        const parentPath = path.parentPath
                        if (parentPath.type === 'MemberExpression'
                            && ((parentPath.node.property.type === 'Identifier' && parentPath.node.property.name === 'index')
                                || parentPath.node.property.type === 'NumericLiteral')) {
                            compGenericName = getGenericName(pc[1])
                        }
                    } else {
                        compGenericName = getGenericName(pc[1])
                    }
                }

                if (pc.length === 3
                    && pc[0] === 'this'
                    && pc[1] === 'props'
                    && (pc[2].endsWith('Component') || pc[2] === 'children')) {

                    if(pc[2] === 'children') {
                        const parentPath = path.parentPath
                        if (parentPath.type === 'MemberExpression'
                            && ((parentPath.node.property.type === 'Identifier' && parentPath.node.computed)
                                || parentPath.node.property.type === 'NumericLiteral')) {
                            compGenericName = getGenericName(pc[2])
                        }
                    } else {
                        compGenericName = getGenericName(pc[2])
                    }
                }


                // 处理属性是JSX 并且这个JSX多级传递的情况，由于小程序的限制， 只能处理形如：
                // <V  headerComponent={this.props.hhComponent}/> 这种简单情形， 对于负责的对于hhComponent处理， 然后再传递的情况
                // 无法支持
                if (compGenericName && isPropsComp(path) && compGenericName !== getGenericName('children') ) {
                    info.json.componentGenerics[compGenericName] = "true"
                    const jsxAttr = path.parentPath.parentPath

                    const nowGeneName = getGenericName(jsxAttr.node.name.name)
                    const jsxOp = jsxAttr.parentPath
                    jsxOp.node.attributes.push(
                        t.jsxAttribute(
                            t.jsxIdentifier(`generic:${nowGeneName}`),
                            t.stringLiteral(compGenericName)
                        )
                    )
                    return
                }



                if (compGenericName) {
                    const fpath = getFinalPath(path)
                    info.json.componentGenerics[compGenericName] = "true"
                    const pp = fpath.parentPath
                    let reElement = null
                    if (pp.type === 'CallExpression') {
                        if (isCPTVnodeAttri(pp)) {
                            return
                        }

                        reElement = t.jsxElement(
                            t.jsxOpeningElement(
                                t.jsxIdentifier(compGenericName),
                                [
                                    t.jsxAttribute(t.jsxIdentifier('CPTVnode'), t.jsxExpressionContainer(pp.node)),
                                ]
                            ),
                            t.jsxClosingElement(
                                t.jsxIdentifier(compGenericName)
                            ),
                            [],
                            true
                        )

                        let ppp = pp.parentPath
                        if (ppp.type === 'JSXExpressionContainer') {
                            ppp.replaceWith(reElement)
                        } else {
                            pp.replaceWith(reElement)
                        }
                    } else {
                        if (isCPTVnodeAttri(fpath)) {
                            return
                        }

                        reElement = t.jsxElement(
                            t.jsxOpeningElement(
                                t.jsxIdentifier(compGenericName),
                                [
                                    t.jsxAttribute(t.jsxIdentifier('CPTVnode'), t.jsxExpressionContainer(fpath.node)),
                                ]
                            ),
                            t.jsxClosingElement(
                                t.jsxIdentifier(compGenericName)
                            ),
                            [],
                            true
                        )

                        if (pp.type === 'JSXExpressionContainer') {
                            pp.replaceWith(reElement)
                        } else {
                            fpath.replaceWith(reElement)
                        }
                    }
                }

                return
            }

            if (path.type === 'JSXElement'
                && isChildComp(path.node.openingElement.name.name)
                && path.node.children.length > 0
            ) {
                const pe = path.node.openingElement
                const key = `${InnerComponentNamePrefix}${go.nextString}`
                pe.attributes.push(
                    t.jsxAttribute(t.jsxIdentifier(`generic:childrenCPT`), t.stringLiteral(key))
                )
                info.outComp.push(key)
                return
            }


        }

    })
    return ast
}


function isCPTVnodeAttri(path) {
    const pp = path.parentPath
    if (!pp) return false

    const ppp = pp.parentPath
    if (!ppp) return false

    return (pp.type === 'JSXExpressionContainer'
        && ppp.type === 'JSXAttribute'
        && ppp.node.name.name === 'CPTVnode'
    )
}


function getFinalPath(path) {
    let p = path
    if (p.parentPath.type === 'MemberExpression') {
        p = p.parentPath
    }
    return p
}


function isPropsComp(path) {

    const pp = path.parentPath
    const ppp = pp.parentPath

    return pp.type === 'JSXExpressionContainer'
        && ppp.type === 'JSXAttribute'
        && ppp.node.name.name.endsWith('Component')
}
