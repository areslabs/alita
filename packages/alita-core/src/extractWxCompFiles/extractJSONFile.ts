import * as path from "path";

import {getModuleInfo, setJsonRelativeFiles} from '../util/cacheModuleInfos'
import {getLibPath, judgeLibPath} from "../util/util"
import configure from "../configure";

import {getCompPath, getRealPackChunks} from './copyPackageWxComponents'

export const handleChanged = (resouce, info, finalJSPath) => {

    const newWxOutFiles = {}
    const {json, outComp} = info.RFInfo

    const chunks = info.chunks

    const jsonRelativeFiles = new Set()

    for(let i = 0; i < chunks.length; i ++ ) {
        const chunk = chunks[i]

        const renderUsingComponents = getUsedCompPaths(resouce, chunk, jsonRelativeFiles)

        for(let i = 0; i < outComp.length; i ++) {
            const name = outComp[i]
            if (name === 'default') {
                continue
            } else {
                renderUsingComponents[name] = path.basename(finalJSPath).replace('.js', `${name}`)
            }
        }

        const renderJSON = {
            ...json,
            usingComponents: renderUsingComponents
        }

        let renderJSONStr =  JSON.stringify(renderJSON, null, '\t')

        for(let i = 0; i < outComp.length; i ++) {
            const name = outComp[i]

            const comppath = (name === 'default' ? finalJSPath.replace('.js', `.json`) : finalJSPath.replace('.js', `${name}.json`))
            let filepathWithChunk = null

            if (chunk === '_rn_') {
                filepathWithChunk = comppath
            } else {
                const subpageDir = chunk.replace('/_rn_', '')
                filepathWithChunk = comppath
                    .replace(configure.outputFullpath, configure.outputFullpath + '/' + subpageDir)
            }

            newWxOutFiles[filepathWithChunk] = renderJSONStr
        }
    }


    setJsonRelativeFiles(resouce, jsonRelativeFiles)
    return newWxOutFiles
}



function getUsedCompPaths(resouce, chunk, jsonRelativeFiles) {

    const info = getModuleInfo(resouce)

    const usedComps = {}

    info.JSXElements.forEach(element => {

        if (!info.im[element]) {
            // 非import/required组件，有两种情况，1：本文件声明了此组件， 2：组件在其他文件，引入方式非法

            // 本文件声明了此组件
            if (info.RFInfo.outComp.includes(element)) {
                usedComps[element] = `./${element}`
            } else if (configure.configObj.componentPaths && configure.configObj.componentPaths[element]) {
                // 全局声明

                const globalPath = configure.configObj.componentPaths[element]
                usedComps[element] = getGlobalChunkPath(globalPath, chunk, resouce, jsonRelativeFiles)
            } else {
                console.log(`${resouce.replace(configure.inputFullpath, '')} : 组件${element} 搜索路径失败！`.error)
            }
            return
        }

        const { source, defaultSpecifier} = info.im[element]

        try {
            //TODO getFinalPath参数耦合太紧，切分为各独立函数模块。
            usedComps[element] = getFinalPath(element, source, resouce, info, defaultSpecifier, chunk, jsonRelativeFiles)
        } catch (e) {
            console.log(`${resouce.replace(configure.inputFullpath, '')} 组件${element} 搜索路径失败！`.error)
            console.log(e)
        }

    })

    return usedComps
}


function getFinalPath(element, source, module, info, defaultSpecifier, chunk, jsonRelativeFiles) {

    let requireAbsolutePath = null
    let requireDefault = true
    if (judgeLibPath(source) && source === getLibPath(source) && getCompPath(chunk, source, element)) {
        requireAbsolutePath = getCompPath(chunk, source, element)
        requireAbsolutePath = path.resolve(configure.inputFullpath, '.' + requireAbsolutePath)
        jsonRelativeFiles.add(source)
    } else {
        const deepSeekResult = deepSeekPath(element, info.deps[source], defaultSpecifier, chunk)
        requireAbsolutePath = deepSeekResult.absolutePath
        requireDefault = deepSeekResult.defaultSpecifier

        jsonRelativeFiles.add(deepSeekResult.rawAbsolutePath)
    }

    if (chunk !== '_rn_') {
        const subpageDir = chunk.replace('/_rn_', '')
        module = module
            .replace(configure.inputFullpath, configure.inputFullpath + path.sep + subpageDir)

    }

    let sp = shortPath(requireAbsolutePath, module)

    if (!requireDefault) {
        sp += element
    }
    return sp
}


function deepSeekPath(element, absolutePath, defaultSpecifier, chunk) {

    let info = getModuleInfo(absolutePath)
    let im = info.im

    while (im[element]) {
        const source = im[element].source
        defaultSpecifier = im[element].defaultSpecifier

        absolutePath = info.deps[source]
        info = getModuleInfo(absolutePath)
        im = info.im
    }


    const rawAbsolutePath = absolutePath

    if (!(info.chunks.length === 1 && info.chunks[0] === '_rn_')) {
        const subpageDir = chunk === '_rn_' ? '': chunk.replace('/_rn_', '')
        absolutePath = absolutePath
            .replace(configure.inputFullpath, configure.inputFullpath + '/' + subpageDir)
    }

    return {
        absolutePath,
        defaultSpecifier,
        rawAbsolutePath,
    }
}

function shortPath(ao, module) {
    const aoArr = ao.split(path.sep)
    const filepathArr = path.dirname(module).split(path.sep)

    var i = 0
    while (filepathArr[i] === aoArr[i]) {
        i ++
    }

    const backPath = filepathArr.slice(i).map(() => '..').join('/')
    const toPath = aoArr.slice(i).join('/')

    const relativePath = `${backPath || '.'}/${toPath}`.replace('node_modules', 'npm')

    const absolutePath = ao.replace(configure.inputFullpath, '')
        .replace('node_modules', 'npm')
        .replace(/\\/g, '/') // 考虑win平台

    const shortPath = relativePath.length > absolutePath.length ? absolutePath : relativePath

    const extname = path.extname(shortPath)

    // remove ext
    return shortPath.replace(`.wx${extname}`, '')
        .replace(extname, '')
}

function getGlobalChunkPath(globalPath, chunk, resouce, jsonRelativeFiles) {

    let subpageDir = ''
    if (chunk !== '_rn_') {
        subpageDir = chunk.replace('/_rn_', '')
        resouce = resouce
            .replace(configure.inputFullpath, configure.inputFullpath + path.sep + subpageDir)
    }

    let absoluteGlobalPath = null
    if (judgeLibPath(globalPath)) {
        const libPath = getLibPath(globalPath)
        jsonRelativeFiles.add(libPath)

        const chunks = getRealPackChunks(libPath)

        if (chunks.size === 1 && chunks.has('_rn_')) {
            absoluteGlobalPath = path.resolve(configure.inputFullpath, 'npm', globalPath)
        } else {
            absoluteGlobalPath = path.resolve(configure.inputFullpath, subpageDir, 'npm', globalPath)
        }
    } else {

        absoluteGlobalPath = path.resolve(configure.inputFullpath, '.' + globalPath)

        jsonRelativeFiles.add(absoluteGlobalPath)

        const chunks = getModuleInfo(absoluteGlobalPath).chunks

        if (chunks.length === 1 && chunks[0] === '_rn_') {
            // do nothing
        } else {
            absoluteGlobalPath = absoluteGlobalPath.replace(configure.inputFullpath, configure.inputFullpath + path.sep + subpageDir)
        }
    }


    return shortPath(absoluteGlobalPath, resouce)

}



