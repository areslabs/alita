/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as npath from 'path'
import * as fse from 'fs-extra'
import traverse from "@babel/traverse"
import * as t from "@babel/types"
import {RNNOTSUPPORTCOMP} from '../constants'
import {compInfos, getBackUpPath} from '../util/getAndStorecompInfos'
import {getLibPath, judgeLibPath, getFinalSource} from '../util/util'

import configure from '../configure'


export default function (ast, info){
    const {filepath, json, webpackContext} = info
    const usedComponent = {};

    const JSXElements = new Set([])

    traverse(ast, {
        JSXOpeningElement: path => {
            const name = (path.node.name as t.JSXIdentifier).name
            JSXElements.add(name)
        },
    })

    traverse(ast, {
        exit(path) {
            if (path.type === 'ImportDeclaration') {
                handleImport(path, filepath, JSXElements, usedComponent);
                return
            }

            // @ts-ignore
            if (path.type === 'CallExpression' && path.node.callee.name === 'require' && path.key === 'init'
            ) {
                handleRequire(path, filepath, JSXElements, usedComponent)
                return
            }
        },
    })

    const jsxElementsArray = Array.from(JSXElements)
    for(let i = 0; i < jsxElementsArray.length; i ++) {
        const item = jsxElementsArray[i]
        if (item === 'view' || item === 'block' || item === 'image' || item === 'template') continue
        if (item.endsWith('CPT')) continue

        if (!usedComponent[item]) {
            const backUpPath = getBackUpPath(item)
            if (backUpPath) {
                console.log(`${filepath.replace(configure.inputFullpath, '')}：${item} 组件未发现规则路径！将使用${backUpPath}，请规范组件的导入！`.warn)
                usedComponent[item] = backUpPath
            }
        }
    }

    json.usingComponents = usedComponent
    return ast
}


function geneUsedComps(idens, relativePath, JSXElements, usedComponent, filepath) {
    const isCompModule = idens.some(iden => JSXElements.has(iden))
    if (!isCompModule) {
        return
    }

    const relativeFilePath = filepath.replace(configure.inputFullpath, '')
    const isLibPath = judgeLibPath(relativePath)

    if (!isLibPath) {
        const finalPath = getFinalSource(filepath, relativePath)

        for (let i = 0; i < idens.length; i ++ ) {
            const importElement = idens[i]

            if(JSXElements.has(importElement)){
                usedComponent[importElement] = finalPath
            }
        }
    } else {
        const packagePath = getLibPath(relativePath)
        const compMaps = compInfos[packagePath]

        for (let i = 0; i < idens.length; i ++ ) {
            let importElement = idens[i]

            if(JSXElements.has(importElement)){
                const compPath = compMaps[importElement]

                if (packagePath === 'react-native' && RNNOTSUPPORTCOMP.has(importElement)) {
                    console.log(`${relativeFilePath}: 暂不支持React Native平台相关组件${importElement}！`.warn)
                } else if (!compPath) {
                    console.log(`${relativeFilePath}: 未在${packagePath}配置正确的${importElement}组件路径！`.error)
                } else {
                    usedComponent[importElement] = compMaps[importElement]
                }
            }
        }
    }
}

function handleImport(path, filepath, JSXElements, usedComponent) {
    const relativePath = path.node.source.value

    const idens = path.node.specifiers.map(item => item.local.name)

    geneUsedComps(idens, relativePath, JSXElements, usedComponent, filepath)
}

function handleRequire(path, filepath, JSXElements, usedComponent) {
    const relativePath = path.node.arguments[0].value

    const idens = []

    const id = path.parentPath.node.id
    if (id.type === 'Identifier') {
        idens.push(id.name)
    } else if (id.type === 'ObjectPattern') {
        const opp = id.properties
        for(let i = 0; i < opp.length; i++) {
            const item = opp[i]
            if (item.type === 'ObjectProperty') {
                idens.push(item.key.name)
            }
        }
    }
    geneUsedComps(idens, relativePath, JSXElements, usedComponent, filepath)
}

