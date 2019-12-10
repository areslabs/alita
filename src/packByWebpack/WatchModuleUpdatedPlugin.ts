import {setModuleDeps} from '../util/cacheModuleInfos'

import {handleChanged, handleDeleted} from '../extractWxCompFiles'

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
                    compilation.records.changedModules = compilation.records.changedModules || []
                    compilation.records.changedModules.push(module.resource)
                }
            );

            compilation.hooks.additionalChunkAssets.tap(
                "WatchModuleUpdatedPlugin",
                () => {
                    // 设置module deps的文件全路径，生成小程序json文件会使用到
                    setAllModuleDeps(compilation)

                    compilation.records.changedModules.forEach(handleChanged)
                    // 重置 changedModules 字段
                    compilation.records.changedModules = []

                    handleAllDeletedModule(compilation, handleDeleted)
                }
            );
        })
    }
}

function setAllModuleDeps(compilation) {
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
        setModuleDeps(m.resource, m.__deps)
    })
}

function handleAllDeletedModule(compilation, handleDeleted) {
    const records = compilation.records;
    if (records.hash === compilation.hash) return;
    if (
        !records.moduleHashs ||
        !records.chunkHashs ||
        !records.chunkModuleIds
    ) {
        // 第一次运行直接返回
        return;
    }

    for (const key of Object.keys(records.chunkHashs)) {
        const chunkId = isNaN(+key) ? key : +key;
        const currentChunk = compilation.chunks.find(
            chunk => `${chunk.id}` === key
        );
        if (currentChunk) {
            const allModules = new Set();
            for (const module of currentChunk.modulesIterable) {
                allModules.add(module.id)
            }

            records.chunkModuleIds[chunkId].forEach(({id, resource}) => {
                if (!allModules.has(id)) {
                    handleDeleted(resource)
                }
            })

        }
    }
}
