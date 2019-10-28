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
import {RNCOMPSET} from "../constants";
const npath = require('path')
const colors = require('colors');

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
            // import react
            if (path.type === 'ImportDeclaration'
                && path.node.source.value === 'react'
            ) {
                path.node.source.value = RNWXLIBMaps['react']

                const spes = path.node.specifiers

                // h = createElement
                spes.push(t.importSpecifier(t.identifier('h'), t.identifier('h')))
                return
            }
            // require react
            if (isTopRequire(path, 'react')) {
                path.node.arguments[0].value = RNWXLIBMaps['react']

                insertIntoRequireBody(path, t.variableDeclaration([
                    t.variableDeclarator(t.identifier('h'), t.memberExpression(t.identifier('React'), t.identifier('h')))
                ], 'const'))

                return
            }


            if (path.type === 'ImportDeclaration'
                && path.node.source.value === 'react-native'
            ) {
                path.node.source.value = RNWXLIBMaps['react-native']

                const spes = path.node.specifiers
                for(let i = 0; i< spes.length; i++) {
                    const spe = spes[i]
                    const name = spe.local.name
                    if (RNCOMPSET.has(name)) {
                        spe.local.name = `WX${name}`
                        spe.imported.name = `WX${name}`
                    }
                }

                return
            }

            if (isTopRequire(path, 'react-native')) {
                path.node.arguments[0].value = RNWXLIBMaps['react-native']

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
                    console.log(colors.error(`需要使用解构的方式引入react-native组件， error file:, ${filepath}`))
                }
                return
            }

            // import 其他 配置在dependenciesMap的npm包
            if (path.type === 'ImportDeclaration' && getWxNpmPackageName(path.node.source.value)) {
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


            // import 目录， 小程序不支持需要处理
            if (path.type === 'ImportDeclaration') {
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
        const originalPath = npath
            .resolve(npath.dirname(filepath), source)
            .replace(global.execArgs.OUT_DIR, global.execArgs.INPUT_DIR)
            .replace(/\\/g, '/')

        if(fse.existsSync(originalPath + '.js')
            || fse.existsSync(originalPath + '.jsx')
            || fse.existsSync(originalPath + '.wx.js')
        ) {
            return source
        } else {
            return source + '/index'
        }
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
    const ppp = nodepath.parentPath.parentPath.parentPath
    ppp.insertAfter(newnode)
}
