/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as npath from 'path'
import * as fse from 'fs-extra'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import {isStaticRes} from '../util/util'
import {RNCOMPSET} from "../constants";

import configure from '../configure'

const backToViewNode = new Set([
    'View',
    'TouchableWithoutFeedback',
    'TouchableOpacity',
    'TouchableHighlight',
    'Image',
    'Text',
    'AnimatedView',
    'AnimatedImage',
    'AnimatedText'
])


/**
 * 1. 移除unused的import/require
 * 2. 处理RN和小程序的import/require的差异
 * @param ast
 * @param info
 * @returns {*}
 */
export default function (ast, info) {
    const {filepath} = info

    traverse(ast, {
        exit: path => {
            // import 定义 React
            if (path.type === 'ImportDeclaration'
                && path.node.source.value === 'react'
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


            if (path.type === 'ImportDeclaration'
                && path.node.source.value === 'react-native'
            ) {

                path.node.specifiers = path.node.specifiers.filter(spe => {
                    const name = spe.local.name
                    if (RNCOMPSET.has(name)) {
                        spe.local.name = `WX${name}`
                        spe.imported.name = `WX${name}`
                    }

                    if (backToViewNode.has(name)) {
                        return false
                    }

                    return true
                })
            }

            if (isTopRequire(path, 'react-native')) {
                const id = path.parentPath.node.id
                if (id.type === 'ObjectPattern') {
                    id.properties = id.properties.filter(pro => {
                        const {key, value} = pro

                        if (RNCOMPSET.has(key)) {
                            key.name = `WX${key.name}`
                            value.name = `WX${value.name}`
                        }

                        if (backToViewNode.has(key)) {
                            return false
                        }

                        return true
                    })
                } else {
                    console.log(`${filepath.replace(configure.inputFullpath, '')}： 需要使用解构的方式引入react-native组件!`.error)
                }
            }


            // import 静态资源
            if (path.type === 'ImportDeclaration'
                && isStaticRes(path.node.source.value)
            )  {
                const picName = path.node.specifiers[0].local.name

                const imagePathWithSize = getImagePath(filepath, path.node.source.value)

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
            if (path.type === 'CallExpression'
                && path.node.callee.type === 'Identifier'
                && path.node.callee.name === 'require'
            ) {
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
        }
    })
    return ast
}


function getImagePath(filepath, source) {

    let finals = npath
        .resolve(npath.dirname(filepath), source)

    copyIfNotExists(finals)

    finals = finals.replace(configure.inputFullpath, '')
        .replace(/\\/g, '/')


    const subDir = configure.configObj.subDir
    if (subDir !== '/') {
        if (subDir.endsWith('/')) {
            finals = subDir.substring(0, subDir.length - 1) + finals
        } else {
            finals = subDir + finals
        }
    }

    return finals
}


function copyIfNotExists(imagePath: string) {
    const targetPath = imagePath.replace(configure.inputFullpath, configure.outputFullpath)

    // 已经copy过，不在处理
    if (fse.existsSync(targetPath)) {
        return
    }

    let sourcePath: string = null

    const extname = npath.extname(imagePath)
    if (fse.existsSync(imagePath.replace(extname, `@3x${extname}`))) {
        sourcePath = imagePath.replace(extname, `@3x${extname}`)
    } else if (fse.existsSync(imagePath.replace(extname, `@2x${extname}`))) {
        sourcePath = imagePath.replace(extname, `@2x${extname}`)
    } else {
        sourcePath = imagePath
    }

    fse.copySync(sourcePath, targetPath)
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



