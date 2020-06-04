
/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import traverse from "@babel/traverse"
import * as t from "@babel/types"
import * as npath from "path"
import * as webpack from 'webpack'

import {LoaderTmpResult} from './interfaces'
import configure from "../configure";
import {isReactComponent, parseCode, isReactFragment} from "../util/uast"

import {getModuleInfo, setModuleInfo} from '../util/cacheModuleInfos'
import {getLibCompInfos} from "../util/getAndStorecompInfos";
import {judgeLibPath} from "../util/util";
import deleteNoWxCode from "../preproccessCode/deleteNoWxCode"
import optimizeImports from "../preproccessCode/importOptimize"

/**
 * 收集alita 处理所必须的信息
 * @param context
 */

export default function (this: webpack.loader.LoaderContext,  context: string): LoaderTmpResult {

    const filepath = this.resourcePath

    console.log(`开始处理：${filepath.replace(configure.inputFullpath, '')} ...`.info)
    let ast = parseCode(context, npath.extname(filepath))
    //删除非wx平台的代码
    ast = deleteNoWxCode(ast)
    //移除无用的的Import，减少import不支持转化的模块导致转化错误（包括移除非wx平台的代码，导致的无用import）
    ast = optimizeImports(ast)

    //TODO 暂时通过此方式，让ast和sourceCode/filepath 建立联系
    // @ts-ignore
    ast.__sourceCode = context
    // @ts-ignore
    ast.__filepath = filepath

    const {isEntry, isRF, isFuncComp, imports, exports, JSXElements} = getFileInfo(ast, filepath)

    const moduleInfo = getModuleInfo(filepath)
    if (moduleInfo) {
        checkImports(moduleInfo.im, imports, filepath)
    }

    setModuleInfo(filepath, imports, exports, isRF, isEntry, JSXElements)

    return {
        ast,
        isEntry,
        isRF,
        isFuncComp,
        rawCode: context
    }
}

function checkImports(oldIm, newIm, filepath) {
    const oldKeys = Object.keys(oldIm)

    for(let i = 0; i < oldKeys.length; i ++ ) {
        const k = oldKeys[i]
        if (newIm[k]) {
            if (oldIm[k].source !== newIm[k].source) {
                console.log(`${filepath.replace(configure.inputFullpath, '')} 检测到 ${k} 导入路径改变 ${oldIm[k].source} --> ${newIm[k].source} ，\n若 ${k}是组件，可能出现usingComponents路径错误，需要重新执行 alita --dev`.warn)
            }
        }
    }
}


function getFileInfo(ast, filepath) {
    let isRF = false
    let isEntry = false
    let isClassComp = false
    let isRNEntry = false

    const JSXElements = new Set<string>()

    const im = {}
    const ex = {}

    traverse(ast, {
        ClassDeclaration: path => {
            const sc = path.node.superClass
            isClassComp = isReactComponent(sc)
        },

        JSXOpeningElement: path => {
            if (isReactFragment(path.node)) {
                return
            }
            const name = (path.node.name as t.JSXIdentifier).name

            if (name === 'Router') {
                isEntry = true
            }
            
            JSXElements.add(name)

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
                // @ts-ignore
                && callee.object.name === 'AppRegistry'
                && callee.property
                && callee.property.name === 'registerComponent'
            ) {
                isRNEntry = true
            }
        }
    })


    if (!isEntry) {
        // 处理小程序组件信息
        // 必须在JSXElement收集结束之后 处理
        traverse(ast, {
            exit(path) {
                if (path.type === 'ImportDeclaration') {
                    handleImport(path, filepath, JSXElements, im);
                    return
                }

                // export {A} from './A'
                if (path.type === 'ExportNamedDeclaration' && (path.node as t.ExportNamedDeclaration).source) {
                    // TODO
                    handleExportSource(path, filepath, JSXElements, im)
                    return
                }

                // @ts-ignore
                if (path.type === 'CallExpression' && path.node.callee.name === 'require' && path.key === 'init') {
                    handleRequire(path, filepath, JSXElements, im)
                    return
                }
            },
        })
    }

    if (isClassComp) {
        isRF = true
    }

    const isFuncComp = isRF && !isClassComp

    return {
        isRF,
        isRNEntry,
        isEntry,
        isFuncComp,

        imports: im,
        exports: ex,
        JSXElements,
    }
}

function handleRequire(path, filepath, JSXElements, im) {
    const relativePath = path.node.arguments[0].value

    const idens = []
    const id = path.parentPath.node.id
    if (id.type === 'Identifier') {
        im[id.name] = {
            source: relativePath,
            defaultSpecifier: true,
        }
        idens.push(id.name)
    } else if (id.type === 'ObjectPattern') {
        const opp = id.properties
        for(let i = 0; i < opp.length; i++) {
            const item = opp[i]
            if (item.type === 'ObjectProperty') {
                im[item.value.name] = {
                    source: relativePath,
                    defaultSpecifier: false,
                    imported: item.key.name
                }
                idens.push(item.value.name)
            }
        }
    }

    const isLibPath = judgeLibPath(relativePath)
    if (!isLibPath) return

    const isCompPack = idens.some(iden => JSXElements.has(iden))
    if (!isCompPack) return

    getLibCompInfos(idens, JSXElements, filepath, relativePath)
}

function handleImport(path, filepath, JSXElements, im) {
    const relativePath = path.node.source.value

    const idens = []
    path.node.specifiers.forEach(spe => {
        //spe = spe as t.ImportSpecifier
        const name = spe.local.name
        im[name] = {
            source: relativePath,
            defaultSpecifier: spe.type === 'ImportDefaultSpecifier',
            // @ts-ignore
            imported: spe.type === 'ImportSpecifier' ? spe.imported.name : null,
        }

        idens.push(name)
    })

    const isLibPath = judgeLibPath(relativePath)
    if (!isLibPath) return

    const isCompPack = idens.some(iden => JSXElements.has(iden))
    if (!isCompPack) return

    getLibCompInfos(idens, JSXElements, filepath, relativePath)
}


function handleExportSource(path, filepath, JSXElements, im) {
    const relativePath = path.node.source.value

    const idens = []
    path.node.specifiers.forEach(spe => {
        //spe = spe as t.ImportSpecifier
        const name = spe.exported.name
        im[name] = {
            source: relativePath,
            defaultSpecifier: false,
            // @ts-ignore
            imported:  spe.local.name
        }

        idens.push(name)
    })

    const isLibPath = judgeLibPath(relativePath)
    if (!isLibPath) return

    const isCompPack = idens.some(iden => JSXElements.has(iden))
    if (!isCompPack) return

    getLibCompInfos(idens, JSXElements, filepath, relativePath)
}

