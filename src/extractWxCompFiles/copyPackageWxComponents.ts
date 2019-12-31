import * as path from 'path'
import * as fse from 'fs-extra'
import {packageInfos} from '../util/getAndStorecompInfos'
import {getModuleInfos} from '../util/cacheModuleInfos'
import configure from '../configure'


const compPathInfos = {}

export default function () {

    const allKeys = Object.keys(packageInfos)

    for(let i = 0; i < allKeys.length; i ++ ) {
        const packageName = allKeys[i]
        const packageInfo = packageInfos[packageName]

        if (!packageInfo.wxComponents) {
            continue
        }

        const chunks = getRelativeChunks(getModuleInfos(), packageInfo.dirname)

        let wxCompPathRelative = ''
        if (packageInfo.wxComponents.path) {
            // 需要copy 微信组件
            wxCompPathRelative = (packageInfo.wxComponents.path.startsWith('/') ? "." + packageInfo.wxComponents.path : packageInfo.wxComponents.path)


            chunks.forEach(chunk => {
                const chunkDic = chunk === '_rn_' ? '' : chunk.replace('/_rn_', '')
                const targetDic = path.resolve(configure.outputFullpath, chunkDic, 'npm', packageInfo.aliasPackName)

                if (!fse.existsSync(targetDic)) {
                    const sourcePath = path.resolve(packageInfo.dirname, wxCompPathRelative)
                    const targetPath = path.resolve(configure.outputFullpath, chunkDic, 'npm', packageInfo.aliasPackName, wxCompPathRelative)

                    fse.copySync(sourcePath, targetPath)
                }
            })
        }


        const pathMap = {}
        packageInfo.wxComponents.components.forEach(comp => {
            const {name, path: compPath} = comp
            const relativePath = compPath.startsWith('/') ? `.${compPath}` : compPath
            pathMap[name] = path.posix.resolve('/npm', packageInfo.aliasPackName, wxCompPathRelative, relativePath)
        })

        compPathInfos[packageName] = {
            chunks,
            pathMap,
        }
    }
}


export function getCompPath(chunk, packageName, element) {
    if (!compPathInfos[packageName]) {
        return
    }

    const {chunks, pathMap} = compPathInfos[packageName]

    if (pathMap[element]) {

        if (chunks.length === 1 && chunks[0] === '_rn_') {
            return pathMap[element]
        } else {
            return `/${chunk.replace('/_rn_', '')}${pathMap[element]}`
        }
    }
}


function getRelativeChunks(moduleInfos, dirname) {
    const chunks = new Set()

    const allModuleRes = Object.keys(moduleInfos)
    for(let i = 0; i < allModuleRes.length; i ++) {
        const res = allModuleRes[i]

        if (res.includes(`${dirname}/`)) {
            moduleInfos[res].chunks.forEach(c => {
                chunks.add(c)
            })
        }
    }

    return Array.from(chunks)
}