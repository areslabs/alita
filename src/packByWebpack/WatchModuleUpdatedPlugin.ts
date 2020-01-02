import * as path from 'path'
import {setModuleDepsAndChunks, getModuleInfo} from '../util/cacheModuleInfos'

import {handleChanged, handleDeleted, handleJSONUpdate} from '../extractWxCompFiles'
import copyPackageWxComponents, {isWxComponentPackage} from '../extractWxCompFiles/copyPackageWxComponents'

import configure from '../configure'

import {getLibPath} from "../util/util";

/**
 * 生成小程序组件 json文件
 */
export default class WatchModuleUpdatedPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('WatchModuleUpdatedPlugin', compilation => {

            // 记录 chunk / modules 信息
            compilation.hooks.record.tap(
                "WatchModuleUpdatedPlugin",
                (compilation, records) => {
                    if (records.hash === compilation.hash) return;
                    records.hash = compilation.hash;
                    records.moduleHashs = {};
                    for (const module of compilation.modules) {
                        const identifier = module.identifier();
                        records.moduleHashs[identifier] = module.hash;
                    }
                    records.chunkHashs = {};
                    for (const chunk of compilation.chunks) {
                        records.chunkHashs[chunk.id] = chunk.hash;
                    }
                    records.chunkModuleIds = {};
                    for (const chunk of compilation.chunks) {
                        records.chunkModuleIds[chunk.id] = Array.from(
                            chunk.modulesIterable,
                            // @ts-ignore
                            m => ({id: m.id, resource: m.resource, chunks: m.getChunks().map(c => c.name)})
                        );
                    }
                }
            );


            // 记录 changedModules 信息
            compilation.hooks.succeedModule.tap(
                "WatchModuleUpdatedPlugin",
                (module) => {
                    compilation.records.changedModules = compilation.records.changedModules || new Set()
                    compilation.records.changedModules.add(module.resource)
                }
            );

            compilation.hooks.additionalChunkAssets.tap(
                "WatchModuleUpdatedPlugin",
                () => {
                    // 设置module deps，chunks，生成小程序json文件会使用到
                    setAllModuleDepsAndChunks(compilation)

                    copyPackageWxComponents()

                    hanldeModuleChanged(compilation, handleChanged, handleDeleted)
                }
            );
        })
    }
}

function setAllModuleDepsAndChunks(compilation) {
    const allModules = {}
    compilation.modules.forEach(m => {
        m.__deps = {}
        allModules[m.id] = m
    })

    compilation.modules.forEach(m => {
        m.reasons.forEach(reason => {
            if (reason.module) {
                const reasonModule = allModules[reason.module.id]
                reasonModule && (reasonModule.__deps[reason.dependency.request] = m.resource)
            }
        })

    })

    compilation.modules.forEach(m => {
        setModuleDepsAndChunks(m.resource, m.__deps, m.getChunks().map(c => c.name))
    })
}

function hanldeModuleChanged(compilation, handleChanged, handleDeleted) {
    const records = compilation.records;
    if (records.hash === compilation.hash) return;

    const allModules = new Map()
    compilation.chunks.forEach(chunk => {
        for (const module of chunk.modulesIterable) {
            allModules.set(module.resource, module.getChunks().map(c => c.name))
        }
    })

    let oldAllModules = new Map()
    if (
        !records.moduleHashs ||
        !records.chunkHashs ||
        !records.chunkModuleIds
    ) {

    } else {
        for (const key of Object.keys(records.chunkHashs)) {
            const chunkId = isNaN(+key) ? key : +key;

            records.chunkModuleIds[chunkId].forEach(m => {
                oldAllModules.set(m.resource, m.chunks)
            })
        }
    }


    const moduleHasChanged = new Set()
    const enterOrLeaveMainChunkModules = new Set()

    compilation.records.changedModules.forEach(m => {
        moduleHasChanged.add(m)
    })
    allModules.forEach((newChunks, m)=> {
        if (compilation.records.changedModules.has(m)) {
            // 上面已经处理
            return
        }

        if (!oldAllModules.has(m)) {
            // new Module
            moduleHasChanged.add(m)
        } else {
            const oldChunks = oldAllModules.get(m)

            if (!arrayEqual(oldChunks, newChunks)) {
                moduleHasChanged.add(m)

                if (oldChunks.length === 1 && oldChunks[0] === '_rn_' || newChunks.length === 1 && newChunks[0] === '_rn_') {
                    if (m.startsWith(path.resolve(configure.inputFullpath, 'node_modules'))) {

                        const libPath = getLibPath(
                            m.replace(path.resolve(configure.inputFullpath, 'node_modules') + path.sep, '')
                                .replace(/\\/g, '/') // for win
                        )

                        const isWxCompP = isWxComponentPackage(libPath)
                        if (isWxCompP) {
                            enterOrLeaveMainChunkModules.add(libPath)
                        } else {
                            enterOrLeaveMainChunkModules.add(m)
                        }
                    } else {
                        enterOrLeaveMainChunkModules.add(m)
                    }
                }
            }
        }
    })

    moduleHasChanged.forEach(m => {
        handleChanged(m)
    })

    oldAllModules.forEach((_, m) => {
        if (!allModules.has(m)) {
            // removed Module
            handleDeleted(m)
        }
    })


    if (enterOrLeaveMainChunkModules.size > 0) {
        const moduleJSONShouldUpdate = new Set()
        allModules.forEach((_, m) => {
            const moduleInfo = getModuleInfo(m)
            if (moduleInfo.jsonRelativeFiles) {
                moduleInfo.jsonRelativeFiles.forEach(relativeFile => {
                    if (enterOrLeaveMainChunkModules.has(relativeFile)) {
                        moduleJSONShouldUpdate.add(m)
                        return
                    }
                })
            }
        })

        moduleJSONShouldUpdate.forEach(m => {
            if (!moduleHasChanged.has(m)) {
                handleJSONUpdate(m)
            }
        })
    }

    // 重置 changedModules 字段
    compilation.records.changedModules = new Set()
    
}


function arrayEqual(arr1, arr2) {

    const arr1Set = new Set(arr1)
    const arr2Set = new Set(arr2)

    if (arr1Set.size !== arr2Set.size) {
        return false
    }

    let result = true
    arr1Set.forEach(item => {
        if (!arr2Set.has(item)) {
            result = false
        }
    })

    return result
}
