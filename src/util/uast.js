/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import * as babel from "@babel/core";
import traverse from "@babel/traverse"
import { parse } from '@babel/parser'
import generator from '@babel/generator'
import * as t from "@babel/types"


export function parseCode(code, extname) {
    const plugins = [
            'classProperties',
            'objectRestSpread',
            'optionalChaining',
            ['decorators', {decoratorsBeforeExport: true}],
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


const babelTransformJSX = babel.createConfigItem(require("../misc/transformJSX"), {type: 'plugin'})


const babelFlow = babel.createConfigItem(require("@babel/preset-flow"), {type: 'presets'})
const babelTSX = babel.createConfigItem([require("@babel/preset-typescript"), {isTSX: true, allExtensions: true, allowNamespaces: true}], {type: 'plugin'})
const babelTS = babel.createConfigItem([require("@babel/preset-typescript"), {isTSX: false, allExtensions: true, allowNamespaces: true}], {type: 'plugin'})

const babelRestSpread = babel.createConfigItem([require("@babel/plugin-proposal-object-rest-spread"), { "loose": true, "useBuiltIns": true }])
const babelClassProperties = babel.createConfigItem([require("@babel/plugin-proposal-class-properties"), {"loose": true}])
const babelOptionalChaining = babel.createConfigItem(require("@babel/plugin-proposal-optional-chaining"))
const babelDecorators = babel.createConfigItem([require("@babel/plugin-proposal-decorators"), {"legacy": true }])
const babelTransformRuntime = babel.createConfigItem(
    [
        require("@babel/plugin-transform-runtime"),
        {
            helpers: true,
        }]
)

export function geneJSXCode(ast) {
    let code = generator(ast, {
        comments: false,
        jsescOption: {
            minimal: true,
        },
    }).code

    return code
}

export function geneReactCode(ast, extname) {
    let code = generator(ast, {
        comments: false,
        jsescOption: {
            minimal: true,
        },
    }).code

    const presets = []
    const plugins = [
        babelDecorators,
        babelRestSpread,
        babelClassProperties,
        babelOptionalChaining,
        babelTransformJSX,
    ]
    if (extname === '.tsx') {
        presets.push(babelTSX)
    } else if (extname === '.ts') {
        presets.push(babelTS)
    } else {
        presets.push(babelFlow)
    }

    code = babel.transformSync(code, {
        babelrc: false,
        configFile: false,
        presets,
        plugins,
    }).code

    return code
}


export function isReactComponent(superClass) {
    if (!superClass) return false

    // Component, PureComponent
    if (superClass.type === 'Identifier'
        && ( superClass.name === 'Component' || superClass.name === 'PureComponent')) {
        return true
    }

    // React.Component, React.PureComponent
    if (superClass.type === 'MemberExpression'
        && superClass.object.name === 'React'
        && (superClass.property.name === 'Component' || superClass.property.name === 'PureComponent')
    ) {
        return true
    }

    return false
}


export function getFileInfo(ast) {
    let isRF = false
    let isEntry = false
    let isClassComp = false
    let isRNEntry = false

    traverse(ast, {
        ClassDeclaration: path => {
            const sc = path.node.superClass
            isClassComp = isReactComponent(sc)
        },

        JSXOpeningElement: path => {
            if (path.node.name.name === 'Router') {
                isEntry = true
            }

            isRF = true
        },

        Identifier: path => {
            // Expo root
            if (path.node.name === 'registerRootComponent') {
                isRNEntry = true
            }
        },

        CallExpression: path => {
            const callee = path.node.callee
            if (callee.type === 'MemberExpression'
                && callee.object
                && callee.object.name === 'AppRegistry'
                && callee.property
                && callee.property.name === 'registerComponent'
            ) {
                isRNEntry = true
            }
        }
    })

    if (isClassComp) {
        isRF = true
    }

    const isFuncComp = isRF && !isClassComp

    return {
        isRF,
        isRNEntry,
        isEntry,
        isFuncComp,
    }
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
    if (global.execArgs.extChildComp.has(name)) {
        return true
    }

    // 基本组件children 不需要转化为childrencpt的组件
    if (global.execArgs.allBaseComp.has(name)) {
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

    if (global.execArgs.allBaseComp.has(name)) {
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




