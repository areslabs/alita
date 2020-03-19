import * as path from 'path'
import * as fse from 'fs-extra'

import {getModuleInfo, updateModuleOutFiles} from '../util/cacheModuleInfos'

import {handleChanged as wxssChanged} from './extractWxssFile'
import {handleChanged as wxmlChanged} from './extractWxmlFile'
import {handleChanged as jsChanged} from './extractJSFile'
import {handleChanged as jsonChanged} from './extractJSONFile'
import {handleChanged as entryChanged} from './extractEntryFile'
import {getRootPathPrefix, miscNameToJSName, RootPrefixPlaceHolader} from "../util/util";

import configure from '../configure'

export const handleChanged = (resource) => {
    const info = getModuleInfo(resource)

    if (!info) {
        return
    }


    let newFiles = null
    if (info.isEntry) {
        newFiles = entryChanged(info)
    } else if (!info.isRF) {
        newFiles = {}
    } else {
        const finalJSPath = miscNameToJSName(resource).replace(configure.inputFullpath, configure.outputFullpath)



        const newWxssFiles = wxssChanged(info, finalJSPath)
        const newWxmlFiles = wxmlChanged(info, finalJSPath)
        const newJSFiles = jsChanged(info, finalJSPath)


        newFiles = expandWithChunks({
            ...newWxssFiles,
            ...newWxmlFiles,
            ...newJSFiles,
        }, info.chunks)

        // JSON文件的产生规则特殊，不能统一用expandWithChunks处理
        const newJSONFiles = jsonChanged(resource, info, finalJSPath)
        newFiles = {
            ...newFiles,
            ...newJSONFiles
        }

    }

    const oldFiles = info.outFiles || {}
    const newFileKeys = Object.keys(newFiles)
    const oldFileKeys = Object.keys(oldFiles)

    // 对改变的文件内容 重新写入
    for (let i = 0; i < newFileKeys.length; i ++) {
        const outPath = newFileKeys[i]
        const outCode = newFiles[outPath]

        const oldOutCode = oldFiles[outPath]

        if (outCode !== oldOutCode) {
            fse.ensureDirSync(path.dirname(outPath))
            fse.writeFileSync(outPath, outCode)
        }
    }

    // 删除无效文件
    for(let i = 0; i < oldFileKeys.length; i ++ ) {
        const outPath = oldFileKeys[i]

        if (!newFiles[outPath]) {
            fse.removeSync(outPath)
        }
    }

    updateModuleOutFiles(resource, newFiles)
}

export const handleDeleted = (resource) => {
    const info = getModuleInfo(resource)

    if (!info) {
        return
    }

    const outFiles = info.outFiles || {}

    const allKeys = Object.keys(outFiles)
    for(let i = 0; i < allKeys.length; i ++ ) {
        const outPath = allKeys[i]
        fse.removeSync(outPath)
    }

    info.outFiles = {}
}


function expandWithChunks(obj, allChunks) {

    const expandFiles = {}

    for(let i = 0; i < allChunks.length; i ++ ) {
        const chunk = allChunks[i]

        const allpaths = Object.keys(obj)
        for(let j = 0; j < allpaths.length; j ++ ) {
            const filepath = allpaths[j]


            let filepathWithChunk = null
            if (chunk === '_rn_') {
                filepathWithChunk = filepath
            } else {
                const subpageDir = chunk.replace('/_rn_', '')
                filepathWithChunk = filepath
                    .replace(configure.outputFullpath, configure.outputFullpath + '/' + subpageDir)
            }


            const rootPrefix = getRootPathPrefix(filepathWithChunk)
            const fileStr = obj[filepath].replace( new RegExp(RootPrefixPlaceHolader, 'g'), rootPrefix)

            expandFiles[filepathWithChunk] = fileStr

        }
    }
    return expandFiles
}


export const handleJSONUpdate = (resource) => {

    const info = getModuleInfo(resource)
    if (!info) {
        return
    }

    const finalJSPath = miscNameToJSName(resource).replace(configure.inputFullpath, configure.outputFullpath)

    const newJSONFiles = jsonChanged(resource, info, finalJSPath)

    const newFileKeys = Object.keys(newJSONFiles)
    // 对改变的文件内容 重新写入
    for (let i = 0; i < newFileKeys.length; i ++) {
        const outPath = newFileKeys[i]
        const outCode = newJSONFiles[outPath]

        const oldOutCode = info.outFiles[outPath]

        if (outCode !== oldOutCode) {
            fse.writeFileSync(outPath, outCode)
            info.outFiles[outPath] = outCode
        }
    }
}