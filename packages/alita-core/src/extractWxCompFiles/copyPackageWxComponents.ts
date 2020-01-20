import * as path from 'path'
import * as fse from 'fs-extra'
import {packageInfos} from '../util/getAndStorecompInfos'
import {getModuleInfos} from '../util/cacheModuleInfos'
import configure from '../configure'


const compPathInfos = {}

const realPackChunks = {}

export default function () {

    const allKeys = Object.keys(packageInfos)

    for(let i = 0; i < allKeys.length; i ++ ) {
        const packageName = allKeys[i]
        const packageInfo = packageInfos[packageName]

        if (!packageInfo.wxComponents) {
            continue
        }

        const chunks = getRelativeChunks(getModuleInfos(), packageInfo.dirname)
        realPackChunks[packageInfo.aliasPackName] = chunks


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

            configure.allChunks.forEach(chunk => {
                if (!chunks.has(chunk)) {
                    const chunkDic = chunk === '_rn_' ? '' : chunk.replace('/_rn_', '')
                    const targetDic = path.resolve(configure.outputFullpath, chunkDic, 'npm', packageInfo.aliasPackName)

                    if (fse.existsSync(targetDic)) {
                        fse.removeSync(targetDic)
                    }
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

export function isWxComponentPackage(packageName) {
    return compPathInfos[packageName]
}


export function getCompPath(chunk, packageName, element) {
    if (!compPathInfos[packageName]) {
        return
    }

    const {chunks, pathMap} = compPathInfos[packageName]

    if (pathMap[element]) {

        if (chunks.size === 1 && chunks.has('_rn_')) {
            return pathMap[element]
        } else {
            return `/${chunk.replace('/_rn_', '')}${pathMap[element]}`
        }
    }
}

export function getRealPackChunks(realPackName) {
    return realPackChunks[realPackName]
}


function getRelativeChunks(moduleInfos, dirname) {
    const chunks = new Set()

    const allModuleRes = Object.keys(moduleInfos)
    for(let i = 0; i < allModuleRes.length; i ++) {
        const res = allModuleRes[i]

        if (res.includes(`${dirname}${path.sep}`)) {
            moduleInfos[res].chunks.forEach(c => {
                chunks.add(c)
            })
        }
    }

    return chunks
}