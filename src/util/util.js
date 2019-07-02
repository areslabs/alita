/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {RNCOMPSET} from '../constants'

const path = require('path')
const fse = require('fs-extra')


const constStr = 'abcdefghijklmnopqrstuvwxyz'

/**
 * init = 0, length = 5
 * next: 00001
 * next: 00002
 * next: 00003
 * @param init
 * @param length
 * @returns {{next: next}}
 */
export function geneOrder(init = 0) {
    let before = init
    return {
        get next() {
            const num = (++before)
            let tmp = '00000' + num
            return tmp.substring(tmp.length - 5)
        },

        get nextString() {
            const num = (before++)
            let tmp = '00000' + num
            const numstr = tmp.substring(tmp.length - 5)
            return constStr.charAt(numstr[0])
                + constStr.charAt(numstr[1])
                + constStr.charAt(numstr[2])
                + constStr.charAt(numstr[3])
                + constStr.charAt(numstr[4])
        },

        isMythsVar(key) {
            const sufix = key.substring(key.length - 5)

            return !isNaN(sufix)
        }
    }
}


export function randomString(length = 5) {

    let result = ''
    for (let i = 0; i <= length; i++)  {
        const index =  parseInt(Math.random() * 26)
        result += constStr.charAt(index)
    }

    return result
}

export function getGenericName(name) {
    if (name.length > 20) {
        return name.substr(0, 18) + 'CPT'
    } else {
        return name + 'CPT'
    }
}

export function isStaticRes(source) {
    //png、jpg、jpeg、bmp、gif、webp
    const extname = path.extname(source).toUpperCase()
    if (extname === '.PNG'
        || extname === '.JPG'
        || extname === '.JPEG'
        || extname === '.BMP'
        || extname === '.GIF'
        || extname === '.WEBP'
    ) { // is PNG

        return true
    }

}

export function getRootPathPrefix(filepath) {
    let rootpath = path
        .dirname(filepath)
        .replace(global.execArgs.OUT_DIR, '')
        .replace(/\\/g, '/')

    rootpath = (rootpath === '' ? '.' : rootpath.substring(1).replace(/[\w-]+/g, '..'))
    return rootpath
}

/**
 * 获取相对路径， 比如文件A路径： /src/common/A.js  文件B路径： /src/component/B.js
 * 那么 B里面 引入A的路径B的路径是： ../../../src/common/A.js
 *
 * @param spath
 * @param targetPath
 */
export function getRelativePath(spath, targetPath) {

    let targetPartPath = targetPath
        .replace(global.execArgs.OUT_DIR, '')
        .replace(/\\/g, '/')

    return getRootPathPrefix(spath) + targetPartPath
}

/**
 * onX
 * @param name
 * @returns {boolean}
 */
export function isEventProp(name) {
    if (!name||name.length <= 3) return false
    if((""+name).toLowerCase()==='buttononclick') return true
    const trCode = name.charCodeAt(2)
    return name.charCodeAt(0) === 111
        && name.charCodeAt(1) === 110
        && trCode >= 65
        && trCode <= 90
}


export function base64Encode(file) {
    // read binary data
    var bitmap = fse.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

export const RNWXLIBMaps = {
    "react": "@areslabs/wx-react",
    "react-native": "@areslabs/wx-react-native",
    "prop-types": "@areslabs/wx-prop-types",
    "@areslabs/router": "@areslabs/wx-router",

    /* 官方支持库*/
    'moment': "@areslabs/wx-moment",
    'redux': "@areslabs/wx-redux",
    'react-redux': "@areslabs/wx-react-redux",
    'redux-actions': "@areslabs/wx-redux-actions",
    'redux-promise': "@areslabs/wx-redux-promise",
    'redux-thunk': "@areslabs/wx-redux-thunk",
    'mobx-react': "@areslabs/wx-mobx-react",
    'mobx': "@areslabs/wx-mobx"
}

export function getDependenciesMap(version) {
    const r = {}
    const allKeys = Object.keys(RNWXLIBMaps)
    for(let i = 0; i < allKeys.length; i ++) {
        const k = allKeys[i]
        const v = RNWXLIBMaps[k]

        r[k] = [v, version]
    }
    return r
}

export function getRNCompList() {
    const allRNComps = Array.from(RNCOMPSET)
    return allRNComps.map(comp => {
        if (comp === 'FlatList') {
            return {
                name: `WX${comp}`,
                extendsComponent: true,
                jsxProps: {
                    ListHeaderComponent: 'ListHeaderComponentCPT',
                    ListFooterComponent: 'ListFooterComponentCPT',
                    ListEmptyComponent: 'ListEmptyComponentCPT',
                    renderItem: 'renderItemCPT',
                    ItemSeparatorComponent: 'ItemSeparatorCompoCPT'
                },
            }
        }

        if (comp === 'SectionList') {
            return {
                name: `WX${comp}`,
                extendsComponent: true,
                jsxProps: {
                    renderSectionHeader: 'renderSectionHeaderCPT',
                    renderSectionFooter: 'renderSectionFooterCPT',
                    renderItem: 'renderItemCPT',
                    ListHeaderComponent: 'ListHeaderComponentCPT',
                    ListFooterComponent: 'ListFooterComponentCPT',
                    ListEmptyComponent: 'ListEmptyComponentCPT',
                    SectionSeparatorComponent: 'SectionSeparatorCoCPT'
                },
            }
        }

        if (comp === 'Picker') {
            return {
                name: `WX${comp}`,
                extendsComponent: true,
                needOperateChildren: true,
            }
        }


        return `WX${comp}`
    })
}
