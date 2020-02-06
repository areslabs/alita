/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as npath from 'path'
import errorLogTraverse from '../util/ErrorLogTraverse'

import * as t from '@babel/types'
import {isStaticRes} from '../util/util'

import {addUsedImage} from '../util/cacheImageInfos'

import configure from '../configure'

/**
 * 1. 移除unused的import/require
 * 2. 处理RN和小程序的import/require的差异
 * @param ast
 * @param info
 * @returns {*}
 */
export default function (ast, info) {
    const {filepath} = info

    errorLogTraverse(ast, {
        exit: path => {
            // import 定义 React
            if (path.type === 'ImportDeclaration'
                && (path.node as t.ImportDeclaration).source.value === 'react'
                && isImportDecReact(path)
            ) {
                const hDec = t.identifier('const h = React.h')
                path.insertAfter(hDec)
            }
            // require 定义 React
            if (isTopRequire(path, 'react') && isRequireDecReact(path)) {
                const hDec = t.identifier('const h = React.h')
                path.parentPath.parentPath.insertAfter(hDec)
            }

            // import 静态资源
            if (path.type === 'ImportDeclaration'
                && isStaticRes((path.node as t.ImportDeclaration).source.value)
            )  {

                const pnode = path.node as t.ImportDeclaration

                const picName = pnode.specifiers[0].local.name

                const imagePathWithSize = getImagePath(filepath, pnode.source.value)

                path.replaceWith(
                    t.variableDeclaration('const', [
                        t.variableDeclarator(
                            t.identifier(picName),
                            t.stringLiteral(imagePathWithSize)
                        )
                    ])
                )
                return
            }

            // require 静态资源
            // @ts-ignore
            if (path.type === 'CallExpression' && path.node.callee.type === 'Identifier' && path.node.callee.name === 'require'
            ) {
                // @ts-ignore
                const source = path.node.arguments[0].value

                if (isStaticRes(source)) {
                    const pp = path.parentPath

                    const imagePathWithSize = getImagePath(filepath, source)

                    if (pp.type === 'JSXExpressionContainer') { // image source
                        pp.replaceWith(t.stringLiteral(imagePathWithSize))
                    } else {
                        path.replaceWith(t.stringLiteral(imagePathWithSize))
                    }

                    return
                }
            }


            // 移除动画的注解， 小程序天然支持
            // @ts-ignore
            if (path.type === 'Decorator' && path.node.expression && path.node.expression.name === 'AnimationEnable') {
                path.remove()
                return
            }
        }
    })
    return ast
}


function getImagePath(filepath, source) {

    let finals = npath
        .resolve(npath.dirname(filepath), source)

    addUsedImage(finals)

    finals = finals.replace(configure.inputFullpath, '')
        .replace('node_modules', 'npm')
        .replace(/\\/g, '/')


    return finals
}



function isTopRequire(nodepath, moduleName) {
    const node = nodepath.node
    return (node.type === 'CallExpression'
        && node.callee.name === 'require'
        && node.arguments.length === 1
        && node.arguments[0].type === 'StringLiteral'
        && node.arguments[0].value === moduleName
    )
}


function isImportDecReact(path) {
    return path.node.specifiers.some(spe => spe.local.name === 'React')
}

function isRequireDecReact(path) {
    const pp = path.parentPath
    return pp.type === 'VariableDeclarator'&& pp.node.id.name === 'React'
}



