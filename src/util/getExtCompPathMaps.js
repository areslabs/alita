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
 * extReactComp：一般来说对齐的组件 需要继承于 RNBaseComponent，但是有些复杂的组件需要继承于Component/PureComponent，比如FlatList
 * allExtComp：所有组件，包括RN官方组件，配置在extCompLibs里的组件，这些组件在Alita转化的时候，会当做基本组件，基本组件的属性处理和自定义组件有一些区别
 * @param extCompLibs
 * @returns {{extCompPathMaps, extChildComp: Set, extReactComp: Set, allExtComp: Set, jsxPropsMap}}
 */
export default function getExtCompPathMaps(extCompLibs) {
    const extCompPathMaps = {}
    const jsxPropsMap = {}
    const extChildComp = new Set([])
    const extReactComp = new Set([])
    const allExtComp = new Set([])
    for(let i = 0; i < extCompLibs.length; i ++) {
        const extLib = extCompLibs[i]
        const libName = extLib.name
        let compDir = extLib.compDir
        if (!compDir) {
            compDir = '/'
        } else {
            compDir = compDir.charAt(0) !== '/' ? '/' + compDir : compDir
            compDir = compDir.charAt(compDir.length - 1) !== '/' ? compDir + '/' : compDir
        }

        const wxLibName = getWxLibName(libName)

        let compPathMap = {}
        for(let j = 0; j < extLib.compLists.length; j ++) {
            const compName = extLib.compLists[j]
            if (typeof compName === 'string') {
                compPathMap[compName] = `${wxLibName}${compDir}${compName}/index`
                allExtComp.add(compName)
            } else {
                const {name, extendsComponent, needOperateChildren, jsxProps} = compName
                compPathMap[name] = `${wxLibName}${compDir}${name}/index`

                if (needOperateChildren === true) {
                    extChildComp.add(name)
                }

                if (extendsComponent === true) {
                    extReactComp.add(name)
                }

                if (jsxProps) {
                    jsxPropsMap[name] = jsxProps
                }

                allExtComp.add(name)
            }

        }
        extCompPathMaps[libName] = compPathMap
    }
    return {
        extCompPathMaps,
        extChildComp,
        extReactComp,
        allExtComp,
        jsxPropsMap
    }
}

function getWxLibName(libName) {
    const {
        configObj,
    } = global.execArgs
    const dm = configObj.dependenciesMap
    if (dm[libName] === undefined) {
        return libName
    } else if (typeof dm[libName] === 'string') {
        return dm[libName]
    } else if (Array.isArray(dm[libName])) {
        return dm[libName][0]
    }
}
