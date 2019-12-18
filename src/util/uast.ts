/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { parse, ParserPlugin } from '@babel/parser'
import generator from '@babel/generator'
import * as t from "@babel/types"

import {allBaseComp, extChildComp} from './getAndStorecompInfos'


export function parseCode(code, extname) {
    const plugins: ParserPlugin[] = [
            'classProperties',
            'objectRestSpread',
            'optionalChaining',
            ['decorators', {decoratorsBeforeExport: true}],
            'classPrivateProperties',
            'doExpressions',
            'exportDefaultFrom',
            'exportNamespaceFrom',
            'throwExpressions'
        ]


    if (extname === '.ts') {
        plugins.push('typescript')
    } else if (extname === '.tsx') {
        plugins.push('typescript')
        plugins.push('jsx')
    } else {
        plugins.push('flow')
        plugins.push('jsx')
    }

    return parse(code, {
        sourceType: "module",
        plugins
    })
}


// 由于babel-loader 无法直接传递AST，所以需要先生成code
export function geneReactCode(ast) {
    let code = generator(ast, {
        comments: false,
        jsescOption: {},
    }).code
    return code
}


export function isReactComponent(superClass) {
    if (!superClass) return false

    // Component, PureComponent
    if (superClass.type === 'Identifier'
        && ( superClass.name === 'Component' || superClass.name === 'PureComponent' || superClass.name === 'FuncComponent')) {
        return true
    }

    // React.Component, React.PureComponent
    if (superClass.type === 'MemberExpression'
        && superClass.object.name === 'React'
        && (superClass.property.name === 'Component' || superClass.property.name === 'PureComponent' || superClass.property.name === 'FuncComponent')
    ) {
        return true
    }

    return false
}

export function getPropsChain(memberExpression) {
    const chain = []

    let me = memberExpression
    while (me.type === 'MemberExpression') {
        if (me.property.type === 'Identifier') {
            chain.push(me.property.name)
        } else if (me.property.type === 'NumericLiteral') {
            chain.push(me.property.value)
        }

        me = me.object
    }

    if (me.type === 'ThisExpression') {
        chain.push('this')
    } else if (me.type === 'Identifier') {
        chain.push(me.name)
    }

    return chain.reverse()
}


export function decTemlate(name, rs) {
    let arr = null
    if (rs.type === 'ArrayExpression') {
        arr = [t.jsxText('\n'), ...rs.elements, t.jsxText('\n')]
    } else {
        arr = [t.jsxText('\n'), rs, t.jsxText('\n')]
    }

    return t.jsxElement(
        t.jsxOpeningElement(
            t.jsxIdentifier('template'),
            [
                t.jsxAttribute(t.jsxIdentifier('name'), t.stringLiteral(name))
            ]
        ),
        t.jsxClosingElement(t.jsxIdentifier('template')),
        arr,
        false
    )
}

export function isJSXChild(path) {
    return (
        path.inList
        && path.listKey === 'children'
        && path.type === 'JSXElement'
    )
}


export function isChildComp(name) {
    if (name === 'block') return false
    if (name === 'view') return false
    if (name === 'image') return false

    // 基本组件children 需要转化为childrencpt的组件
    if (extChildComp.has(name)) {
        return true
    }

    // 基本组件children 不需要转化为childrencpt的组件
    if (allBaseComp.has(name)) {
        return false
    }

    // 自定义组件 children都需要转化为childrencpt
    return true
}

export function isChildCompChild(path) {
    const jc = isJSXChild(path)
    if (!jc) return false

    const parentElement = path.parentPath
    const name = parentElement.node.openingElement.name.name


    return isChildComp(name)
}



export function isBindElement(jsxOp) {

    let name = null
    if (jsxOp.name.type === 'JSXMemberExpression') {
        name = jsxOp.name.object.name
    } else {
        name = jsxOp.name.name
    }


    return isBindElementByName(name)
}

export function isBindElementByName(name) {

    if (name === 'view' || name === 'block' || name === 'image') {
        return true
    }

    if (allBaseComp.has(name)) {
        return true
    }

    return false
}


export function isTextElement(openingElement) {
    if (openingElement.name.name !== 'view') return false

    return openingElement.attributes.some(item =>
        item.type === 'JSXAttribute'
        && item.name.name === 'original'
        && (item.value.value === 'OuterText' || item.value.value === 'InnerText'))
}




