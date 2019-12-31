import * as path from "path";

import {getModuleInfo} from '../util/cacheModuleInfos'
import {getLibPath, judgeLibPath} from "../util/util"
import configure from "../configure";

import {getCompPath} from './copyPackageWxComponents'



export const handleChanged = (resouce, info, finalJSPath) => {

    const newWxOutFiles = {}
    const {json, outComp} = info.RFInfo

    const chunks = info.chunks

    for(let i = 0; i < chunks.length; i ++ ) {
        const chunk = chunks[i]

        const renderUsingComponents = getUsedCompPaths(resouce, chunk)

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
    return newWxOutFiles
}



function getUsedCompPaths(resouce, chunk) {

    const info = getModuleInfo(resouce)

    const usedComps = {}

    info.JSXElements.forEach(element => {

        if (!info.im[element]) {
            usedComps[element] = `./${element}`
            return
        }

        const { source, defaultSpecifier} = info.im[element]
        if (isRnBaseSkipEle(element, source)) {
            // 退化为view的节点，不需要在usingComponents 写明路径
            return
        }

        const elementKey = source === 'react-native' ? `WX${element}` : element

        try {
            //TODO getFinalPath参数耦合太紧，切分为各独立函数模块。
            usedComps[elementKey] = getFinalPath(element, source, resouce, info, defaultSpecifier, chunk)
        } catch (e) {
            console.log(`${resouce.replace(configure.inputFullpath, '')} 组件${element} 搜索路径失败！`.error)
            console.log(e)
        }

    })

    return usedComps
}

function isRnBaseSkipEle(element, source) {

    if (source === 'react-native' && (
        element === 'View'
        || element === 'Text'
        || element === 'TouchableWithoutFeedback'
        || element === 'TouchableOpacity'
        || element === 'TouchableHighlight'
        || element === 'Image'
    )) {
        return true
    }

    if (source === '@areslabs/wx-animated' && (
        element === 'AnimatedView'
        || element === 'AnimatedImage'
        || element === 'AnimatedText'
    )) {
        return true
    }

    return false
}


function getFinalPath(element, source, module, info, defaultSpecifier, chunk) {

    let requireAbsolutePath = null
    let requireDefault = true
    if (source === 'react-native') {
        requireAbsolutePath = getCompPath(chunk, source, `WX${element}`)
    } else if (judgeLibPath(source) && source === getLibPath(source) && getCompPath(chunk, source, element)) {
        requireAbsolutePath = getCompPath(chunk, source, element)
    } else {
        const deepSeekResult = deepSeekPath(element, info.deps[source], defaultSpecifier, chunk)
        requireAbsolutePath = deepSeekResult.absolutePath
        requireDefault = deepSeekResult.defaultSpecifier
    }

    if (chunk !== '_rn_') {
        const subpageDir = chunk.replace('/_rn_', '')
        module = module
            .replace(configure.inputFullpath, configure.inputFullpath + '/' + subpageDir)
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


    if (!(info.chunks.length === 1 && info.chunks[0] === '_rn_')) {
        const subpageDir = chunk === '_rn_' ? '': chunk.replace('/_rn_', '')
        absolutePath = absolutePath
            .replace(configure.inputFullpath, configure.inputFullpath + '/' + subpageDir)
    }

    return {
        absolutePath,
        defaultSpecifier,
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



