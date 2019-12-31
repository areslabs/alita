import {setModuleDepsAndChunks} from '../util/cacheModuleInfos'

import {handleChanged, handleDeleted} from '../extractWxCompFiles'
import copyPackageWxComponents from '../extractWxCompFiles/copyPackageWxComponents'

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
                            m => ({id: m.id, resource: m.resource})
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

    const allModules = new Set()
    compilation.chunks.forEach(chunk => {
        for (const module of chunk.modulesIterable) {
            allModules.add(module.resource)
        }
    })

    let oldAllModules = new Set()
    if (
        !records.moduleHashs ||
        !records.chunkHashs ||
        !records.chunkModuleIds
    ) {

    } else {
        for (const key of Object.keys(records.chunkHashs)) {
            const chunkId = isNaN(+key) ? key : +key;

            records.chunkModuleIds[chunkId].forEach(({id, resource}) => {
                oldAllModules.add(resource)
            })
        }
    }

    compilation.records.changedModules.forEach(handleChanged)
    allModules.forEach(m => {
        if (!oldAllModules.has(m) && !compilation.records.changedModules.has(m)) {
            // new Module
            handleChanged(m)
        }
    })

    oldAllModules.forEach(m => {
        if (!allModules.has(m)) {
            // removed Module
            handleDeleted(m)
        }
    })

    // 重置 changedModules 字段
    compilation.records.changedModules = new Set()
    
}
