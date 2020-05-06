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
import {wxBaseComp, originElementAttrName,  innerTextOrigin, outerTextOrigin,} from '../constants'
import {getModuleInfo} from './cacheModuleInfos'
import {judgeLibPath} from './util'

import configure from '../configure'


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


//TODO 由于babel-loader 无法直接传递AST，所以需要先生成code
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

/**
 * 调用链处理为数组： a.b.c --> ['a', 'b', 'c']
 * @param memberExpression
 * @returns {any[]}
 */
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

/**
 * 生成独立JSX片段的对应template片段
 * @param name
 * @param rs
 * @returns {JSXElement}
 */
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

/**
 * 判断是否是JSX的子元素
 *
 * var x = <A><B/><C/></A>
 *
 * 其中 A不是， B，C都是JSX子元素。
 * @param path
 * @returns {boolean}
 */
export function isJSXChild(path) {
    return (
        path.inList
        && path.listKey === 'children'
        && path.type === 'JSXElement'
    )
}

/**
 * 子元素是否需要被处理为 generic：抽象节点，一般来说，所有自定义组件都需要
 * @param name
 * @returns {boolean}
 */
export function isChildComp(name, filepath) {
    if (wxBaseComp.has(name) || configure.configObj.miniprogramComponents[name]) return false

    // 基本组件children 需要转化为childrencpt的组件
    if (extChildComp.has(name)) {
        return true
    }

    const {im} = getModuleInfo(filepath)
    // 基本组件children 不需要转化为childrencpt的组件
    if (allBaseComp.has(name)) {
        if (im[name] && !judgeLibPath(im[name].source)) {
            console.log(`${filepath.replace(configure.inputFullpath, '')} 组件名为${name} 与 ${name}基础组件名称重复，可能会导致渲染不成功，建议将${name}重新命名！`.warn)
        }
        return false
    }

    // 自定义组件 children都需要转化为childrencpt
    return true
}

/**
 * 判断 子元素是否是需要被处理为 generic： 抽象节点的情况
 * @param path
 * @returns {any}
 */
export function isChildCompChild(path, filepath) {
    const jc = isJSXChild(path)
    if (!jc) return false

    const parentElement = path.parentPath
    const name = parentElement.node.openingElement.name.name


    return isChildComp(name, filepath)
}

/**
 * 是否是文本节点
 * @param openingElement
 * @returns {any}
 */
export function isTextElement(openingElement) {
    if (openingElement.name.name !== 'view') return false

    return openingElement.attributes.some(item =>
        item.type === 'JSXAttribute'
        && item.name.name === originElementAttrName
        && (item.value.value === outerTextOrigin || item.value.value === innerTextOrigin))
}



/**
 * render方法直接返回JSX
 *
 * class A extends Component {
 *    render() {
 *        return <XX/>
 *    }
 *
 * }
 *
 * class B extends Component {
 *    render() {
 *        if (c1) {
 *            return <X/>
 *        } else {
 *            return <Y/>
 *        }
 *    }
 * }
 *
 * 以上： A的返回值 是true， B的返回值是false
 *
 * 微信小程序的自定义组件会退化为一个节点，需要有render的节点上报样式，对于A可以简化处理，
 * 对于B 理论上来说 任何一个独立JSX片段 都可能是上报的源
 *
 * @type {boolean}
 */
export function isRenderReturn(path) {

    const  pp = path.parentPath.parentPath
    if (pp.type !== 'ReturnStatement') return false


    if (pp.parentPath.parentPath) {
        const pppp = pp.parentPath.parentPath

        if (pppp.type === 'ClassMethod'
            && pppp.node.key.name === 'render'
        ) {
            return true
        }
    }
}

/**
 *
 * @param path
 * @returns {any}
 */
export function getOriginal(path) {
    const attr = getAttri(path, originElementAttrName)
    if (attr) {
        return attr.value.value
    }
    return ''
}

/**
 * 获取JSXElement的属性
 * @param path
 * @param name
 * @returns {any}
 */
export function getAttri(path, name) {
    const attris = path.node.attributes
    for (let i = 0; i< attris.length; i ++) {
        const item = attris[i]
        if (item.type === 'JSXAttribute' && item.name.name === name) {
            return item
        }
    }
}

/**
 * 给JSXOpeningElement 添加class类名，
 *
 * 1. <view/>  ---> <view class="xx"/>
 * 2. <View class="aa"/> ---> <view class="aa xx"/>
 *
 * @param jsxOp
 * @param className
 */
export function elementAddClass(jsxOp, className) {
    let hasClassAttr = false
    jsxOp.attributes.forEach(attr => {
        if (attr.type === 'JSXAttribute' && attr.name.name === 'class') {
            hasClassAttr = true
            attr.value.value = `${attr.value.value} ${className}`
        }
    })

    if (!hasClassAttr) {
        jsxOp.attributes.push(
            t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(className))
        )
    }
}

/**
 * 是否是React.Fragment节点
 * @param node
 * @returns {any}
 */
export function isReactFragment(node) {
    const name = node.name
    if (name && name.type === 'JSXMemberExpression') {
        return isReactFragmentExpression(name)
    }
    return false
}

/**
 * 是否是React.Fragment表达式
 * @param node
 * @returns {any}
 */
export function isReactFragmentExpression(jsxOp) {
    const object = jsxOp.object
    const property = jsxOp.property
    if (object
        && object.name === 'React'
        && property
        && property.name === 'Fragment'
    ) {
        return true
    }
    return false
}
