import * as path from 'path'
import * as fse from 'fs-extra'

import {getModuleInfo, updateModuleOutFiles, removeModuleInfo} from '../util/cacheModuleInfos'

import {handleChanged as wxssChanged} from './extractWxssFile'
import {handleChanged as wxmlChanged} from './extractWxmlFile'
import {handleChanged as jsChanged} from './extractJSFile'
import {handleChanged as jsonChanged} from './extractJSONFile'
import {miscNameToJSName} from "../util/util";

import configure from '../configure'

export const handleChanged = (module) => {
    const info = getModuleInfo(module)

    if (info.isEntry) {
        //TODO
        return
    }

    const finalJSPath = miscNameToJSName(module).replace(configure.inputFullpath, configure.outputFullpath)

    let newFiles = null
    if (!info.isRF) {
        newFiles = {}
    } else {
        const newWxssFiles = wxssChanged(info, finalJSPath)
        const newWxmlFiles = wxmlChanged(info, finalJSPath)
        const newJSFiles = jsChanged(info, finalJSPath)
        const newJSONFiles = jsonChanged(module, info, finalJSPath)

        newFiles = {
            ...newWxssFiles,
            ...newWxmlFiles,
            ...newJSFiles,
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

    updateModuleOutFiles(module, newFiles)
}

export const handleDeleted = (module) => {
    const info = getModuleInfo(module)
    const outFiles = info.outFiles || {}

    const allKeys = Object.keys(outFiles)
    for(let i = 0; i < allKeys.length; i ++ ) {
        const outPath = allKeys[i]
        fse.removeSync(outPath)
    }

    removeModuleInfo(module)
}