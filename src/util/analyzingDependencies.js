/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * 这是对alita配置文件extCompLibs字段的二次处理，生成如下字段，方便在Alita处理过程中使用。
 * 关于alita配置文件，详见：https://areslabs.github.io/alita/%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.html
 *
 * extCompPathMaps：组件名和路径映射，方便后续生成小程序json文件
 * jsxPropsMap： 属性是JSX片段，包括方法返回JSX片段等，Alita需要特殊处理这些属性
 * extChildComp： 需要处理children 为childrencpt的集合
 * extReactComp：配置在compLists，且不继承自RNBaseComponent
 * textComp: Text节点，一般来说只要官方的Text组件
 * allBaseComp：所有基本组件，包括RN官方组件，基本组件和自定义组件 Alita在转化的时候有一些区别
 *
 * //TODO 是否需要考虑 不同包下的组件同名？？
 * @returns {{extCompPathMaps, extChildComp: Set, extReactComp: Set, allBaseComp: Set, jsxPropsMap}}
 */
export default function analyzingDependencies(dependencies) {
    const dependenciesMap = {}
    const extCompPathMaps = {}
    const jsxPropsMap = {}
    const extChildComp = new Set([])
    const extReactComp = new Set([])
    const textComp = new Set(['Text'])
    const allBaseComp = new Set([])
    for(let i = 0; i < dependencies.length; i ++) {
        const extLib = dependencies[i]
        const libName = extLib.name
        let wxLibName = extLib.wxName
        let wxVersion = extLib.wxVersion

        if (wxLibName === undefined) {
            console.log(`包${libName} 未配置wxName，字段！！！将使用${libName}作为其微信小程序包名`.warn)
            wxLibName = libName
        }

        if (wxVersion) {
            dependenciesMap[libName] = [wxLibName, wxVersion]
        } else {
            dependenciesMap[libName] = wxLibName
        }


        if (!extLib.compLists) {
            continue
        }

        const compPathMap = {}
        for(let j = 0; j < extLib.compLists.length; j ++) {
            const comps = extLib.compLists[j]
            const {
                name,
                path,
                base,
                needOperateChildren,
                jsxProps,
                isText
            } = comps

            const finalPath = path.startsWith('/') ? path : `/${path}`
            compPathMap[name] = `${wxLibName}${finalPath}`

            if (needOperateChildren === true) {
                extChildComp.add(name)
            }

            if (base === true) {
                allBaseComp.add(name)
            } else {
                extReactComp.add(name)
            }

            if (jsxProps) {
                jsxPropsMap[name] = jsxProps
            }

            if (isText === true) {
                textComp.add(name)
            }
        }
        extCompPathMaps[libName] = compPathMap
    }
    return {
        dependenciesMap,
        extCompPathMaps,
        extChildComp,
        extReactComp,
        allBaseComp,
        textComp,
        jsxPropsMap
    }
}