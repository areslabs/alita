/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import traverse from "@babel/traverse"
import * as t from '@babel/types'
import fse from 'fs-extra'
import {isStaticRes, RNWXLIBMaps} from '../util/util'
import isReactCompFile from '../util/isReactCompFile'
import {RNCOMPSET} from "../constants";
const npath = require('path')


/**
 * 1. 移除unused的import/require
 * 2. 处理RN和小程序的import/require的差异
 * @param ast
 * @param info
 * @returns {*}
 */
export default function (ast, info) {
    const {filepath} = info

    const allIden = new Set(['React'])
    traverse(ast, {
        JSXIdentifier: path => {
            allIden.add(path.node.name)
        },

        Identifier: path => {
            if (path.key !== 'property' && path.key !== 'local' && path.key !== 'imported') {
                allIden.add(path.node.name)
            }
        },

        exit: path => {
            if (path.node.type === 'Program') {
                const body = path.node.body

                path.node.body = body.filter(ele => {
                    if (ele.type === 'ImportDeclaration') {
                        ele.specifiers = ele.specifiers.filter(spe => allIden.has(spe.local.name))
                        if (ele.specifiers.length === 0) {
                            return false
                        }
                    }

                    return true
                })
            }
        }
    })

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

                const spes = path.node.specifiers
                for(let i = 0; i< spes.length; i++) {
                    const spe = spes[i]
                    const name = spe.local.name
                    if (RNCOMPSET.has(name)) {
                        spe.local.name = `WX${name}`
                        spe.imported.name = `WX${name}`
                    }
                }
            }

            if (isTopRequire(path, 'react-native')) {
                const id = path.parentPath.node.id
                if (id.type === 'ObjectPattern') {
                    id.properties.forEach(pro => {
                        const {key, value} = pro

                        if (RNCOMPSET.has(key)) {
                            key.name = `WX${key.name}`
                            value.name = `WX${value.name}`
                        }
                    })
                } else {
                    console.log(`${filepath.replace(global.execArgs.OUT_DIR, '')}： 需要使用解构的方式引入react-native组件!`.error)
                }
            }

            // import 配置在dependenciesMap的npm包
            if (path.type === 'ImportDeclaration' && getWxNpmPackageName(path.node.source.value)) {
                const newV = getWxNpmPackageName(path.node.source.value)
                path.node.source.value = newV
                return
            }

            // export {x} from 'xxx'
            if (path.type === 'ExportNamedDeclaration' && path.node.source && getWxNpmPackageName(path.node.source.value)) {
                const newV = getWxNpmPackageName(path.node.source.value)
                path.node.source.value = newV
                return
            }


            // require 其他 配置在dependenciesMap的npm包
            if (path.type === 'CallExpression'
                && path.node.callee.name === 'require'
                && path.node.arguments.length === 1
                && getWxNpmPackageName(path.node.arguments[0].value)
            ) {
                const newV = getWxNpmPackageName(path.node.arguments[0].value)
                path.node.arguments[0].value = newV
                return
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


                const rs = getRealSource(source, filepath)

                path.node.arguments[0].value = rs
                return
            }


            // 1. import 目录， 小程序不支持需要处理
            // 2. export {x} from './xxx' 这种情况
            if (path.type === 'ImportDeclaration' || (path.type === 'ExportNamedDeclaration' && path.node.source)) {
                const source = path.node.source.value
                const rs = getRealSource(source, filepath)
                path.node.source.value = rs
                return
            }

            // require 目录 小程序不支持需要处理
            if (path.type === 'CallExpression'
                && path.node.callee.type === 'Identifier'
                && path.node.callee.name === 'require'
            ) {
                const source = path.node.arguments[0].value
                const rs = getRealSource(source, filepath)
                path.node.arguments[0].value = rs
                return
            }
        }
    })
    return ast
}

function getRealSource(source, filepath) {
    if (npath.extname(source) !== '') {
        return source
    }


    // 小程序不支持require/import 一个目录
    if (source.startsWith('/')
        || source.startsWith('./')
        || source.startsWith('../')
    ) {
        return getFinalSource(filepath, source)
    } else {
        return source
    }
}

function getImagePath(filepath, source) {

    let finals = npath
        .resolve(npath.dirname(filepath), source)

    finals = finals.replace(global.execArgs.OUT_DIR, '')
        .replace(/\\/g, '/')


    const subDir = global.execArgs.configObj.subDir
    if (subDir !== '/') {
        if (subDir.endsWith('/')) {
            finals = subDir.substring(0, subDir.length - 1) + finals
        } else {
            finals = subDir + finals
        }
    }

    return finals
}

/**
 * ture:
 * import xxx from 'xxx'
 * import yyy from 'xxx/yyy'
 *
 * false:
 * import yyy from 'xxx-yyy'
 *
 * @param rnName
 */
function getWxNpmPackageName(rnName) {
    // deprecated
    const dm = global.execArgs.dependenciesMap || global.execArgs.configObj.dependenciesMap

    for(let key in dm) {
        if (dm[key] === false) continue

        // xxx === xxx || aaa/x/y startsWith aaa/
        if (rnName === key || rnName.startsWith(key + '/')) {
            const v = dm[key]

            let wxName = null
            if (typeof v === 'string') {
                wxName = v
            } else if (Array.isArray(v)) {
                wxName = v[0]
            }

            if (wxName) {
                return rnName.replace(key, wxName)
            }
        }
    }
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


function insertIntoRequireBody(nodepath, newnode) {
    const ppp = nodepath.parentPath.parentPath
    ppp.insertAfter(newnode)
}

/**
 * 获取 最终的导入路径，如果导入的是目录，需要补全index
 * 如果导入的是组件，需要添加.comp
 * @param filepath
 * @param source
 */
function getFinalSource(filepath, source) {
    const originalPath = npath
        .resolve(npath.dirname(filepath), source)
        .replace(global.execArgs.OUT_DIR, global.execArgs.INPUT_DIR)
        .replace(/\\/g, '/')

    const extname = npath.extname(filepath)


    let fileSufix = '.js'
    let backupSufix = '.ts'
    if (extname === '.ts' || extname === '.tsx') {
        fileSufix = '.ts'
        backupSufix = '.js'
    }

    let finalSource = getFinalSourceByExtname(fileSufix, originalPath, source)
    if (!finalSource) {
        finalSource = getFinalSourceByExtname(backupSufix, originalPath, source)
    }

    if (!finalSource) {
        console.log(`${filepath.replace(global.execArgs.OUT_DIR, '')}: 未找到${source}模块！`.error)
    }
    return finalSource
}

function getFinalSourceByExtname(fileSufix, originalPath, source) {
    const allFiles = [
        `${originalPath}.wx${fileSufix}`,
        `${originalPath}${fileSufix}`,
        `${originalPath}.wx${fileSufix}x`,
        `${originalPath}${fileSufix}x`
    ]

    for(let i = 0; i < allFiles.length; i ++ ) {
        const filePath = allFiles[i]

        if (fse.existsSync(filePath)) {
            if (isReactCompFile(filePath)) {
                return `${source}.comp`
            } else {
                return source
            }
        }
    }

    const indexFiles = npath.resolve(originalPath, 'index')
    const allIndexFiles = [
        `${indexFiles}.wx${fileSufix}`,
        `${indexFiles}${fileSufix}`,
        `${indexFiles}.wx${fileSufix}x`,
        `${indexFiles}${fileSufix}x`
    ]

    for(let i = 0; i < allIndexFiles.length; i ++ ) {
        const filePath = allIndexFiles[i]

        if (fse.existsSync(filePath)) {
            if (isReactCompFile(filePath)) {
                return `${source}/index.comp`
            } else {
                return `${source}/index`
            }
        }
    }
}

function isImportDecReact(path) {
    return path.node.specifiers.some(spe => spe.local.name === 'React')
}

function isRequireDecReact(path) {
    const pp = path.parentPath
    return pp.type === 'VariableDeclarator'&& pp.node.id.name === 'React'
}