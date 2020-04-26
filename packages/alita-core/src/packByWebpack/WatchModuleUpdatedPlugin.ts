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

                    records.chunkHashs = {};
                    for (const chunk of compilation.chunks) {
                        records.chunkHashs[chunk.id] = chunk.hash;
                    }
                    records.chunkModuleIds = {};
                    for (const chunk of compilation.chunks) {

                        const allModules = []
                        chunk.modulesIterable.forEach(m => {
                            if (m.resource) {
                                allModules.push({
                                    resource: m.resource, chunks: m.getChunks().map(c => c.name)
                                })
                            } else {
                                // 被tree-shaking合并
                                m._orderedConcatenationList && m._orderedConcatenationList.forEach(concatenationM => {
                                    if (concatenationM.type === 'concatenated') {
                                        const cm = concatenationM.module
                                        allModules.push({
                                            resource: cm.resource,
                                            chunks: m.getChunks().map(c => c.name)
                                        })
                                    }
                                })
                            }
                        })


                        records.chunkModuleIds[chunk.id] = allModules
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


function getAllModulesFromCompilation(compilation) {
    const allModules = new Map()
    compilation.modules.forEach(m => {
        if (m.resource) {
            m.__chus = m.getChunks().map(c => c.name)
            m.__deps = {}
            allModules.set(m.resource, m)
        } else {
            // 被tree-shaking合并
            m._orderedConcatenationList && m._orderedConcatenationList.forEach(concatenationM => {
                if (concatenationM.type === 'concatenated') {
                    const cm = concatenationM.module
                    cm.__chus = m.getChunks().map(c => c.name)
                    cm.__deps = {}
                    allModules.set(cm.resource, cm)
                }
            })
        }
    })

    return allModules
}


function setAllModuleDepsAndChunks(compilation) {

    const modulesMap = getAllModulesFromCompilation(compilation)
    const modulesArr = Array.from(modulesMap.values())

    modulesArr.forEach(m => {
        m.reasons.forEach(reason => {
            if (reason.module) {
                const reasonModule = modulesMap.get(reason.module.resource)
                reasonModule && (reasonModule.__deps[reason.dependency.request] = m.resource)
            }
        })
    })

    modulesArr.forEach(m => {
        setModuleDepsAndChunks(m.resource, m.__deps, m.__chus)
    })
}

function hanldeModuleChanged(compilation, handleChanged, handleDeleted) {
    const records = compilation.records;
    if (records.hash === compilation.hash) return;

    const allModules = getAllModulesFromCompilation(compilation)

    let oldAllModules = new Map()
    if (
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

    // all module failed?
    compilation.records.changedModules = compilation.records.changedModules || new Set()
    compilation.records.changedModules.forEach(m => {
        moduleHasChanged.add(m)
    })
    allModules.forEach((mv, m)=> {
        const newChunks = mv.__chus

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
