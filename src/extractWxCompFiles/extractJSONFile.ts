import * as path from "path";

import {getModuleInfo} from '../util/cacheModuleInfos'
import {getLibPath, judgeLibPath} from "../util/util"
import configure from "../configure";
import {compInfos} from "../util/getAndStorecompInfos";



export const handleChanged = (module, info, finalJSPath) => {

    const newWxOutFiles = {}
    const {json, outComp} = info.RFInfo

    const renderUsingComponents = getUsedCompPaths(module)

    for(let i = 0; i < outComp.length; i ++) {
        const name = outComp[i]
        if (name === 'render') {
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

        const comppath = (name === 'render' ? finalJSPath.replace('.js', `.json`) : finalJSPath.replace('.js', `${name}.json`))
        newWxOutFiles[comppath] = renderJSONStr
    }

    return newWxOutFiles
}



function getUsedCompPaths(module) {

    const info = getModuleInfo(module)

    const usedComps = {}

    info.JSXElements.forEach(element => {

        if (!info.im[element]) {
            //TODO 配合移除 "单文件单组件"
            usedComps[element] = `./${element}`
            return
        }

        const source = info.im[element].source
        if (isRnBaseSkipEle(element, source)) {
            return
        }

        const elementKey = source === 'react-native' ? `WX${element}` : element
        usedComps[elementKey] = getFinalPath(element, source, module, info)
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


function getFinalPath(element, source, module, info) {
    if (source === 'react-native') {
        return compInfos[source][`WX${element}`]
    }

    // import {xx} from 'xx'
    if (judgeLibPath(source) && source === getLibPath(source) && compInfos[source][element]) {
        return compInfos[source][element]
    }

    const absolutePath = info.deps[source]     //syncResolve(path.dirname(filepath), source)

    return deepSeekPath(element, absolutePath, module)
}


function deepSeekPath(element, absolutePath, module) {

    let info = getModuleInfo(absolutePath)
    let im = info.im

    while (im[element]) {
        const source = im[element].source
        absolutePath = info.deps[source]
        info = getModuleInfo(absolutePath)
        im = info.im
    }

    return shortPath(absolutePath, module)
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

    const relativePath = `${backPath || '.'}/${toPath}`

    const absolutePath = ao.replace(configure.inputFullpath, '')
        .replace('node_modules', 'npm')

    const shortPath = relativePath.length > absolutePath.length ? absolutePath : relativePath

    const extname = path.extname(shortPath)

    // remove ext
    return shortPath.replace(`.wx${extname}`, '')
        .replace(extname, '')
}



