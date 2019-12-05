/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as path from 'path'
import * as fse from 'fs-extra'
import { supportExtname } from '../constants'

import configure from '../configure'
import * as npath from "path";


const constStr = 'abcdefghijklmnopqrstuvwxyz'

/**
 * init = 0, length = 5
 * next: 00001
 * next: 00002
 * next: 00003
 * @param init
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
            return constStr.charAt(numstr['0'])
                + constStr.charAt(numstr['1'])
                + constStr.charAt(numstr['2'])
                + constStr.charAt(numstr['3'])
                + constStr.charAt(numstr['4'])
        },

        isMythsVar(key) {
            const sufix = key.substring(key.length - 5)

            return !isNaN(sufix)
        }
    }
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
        .replace(configure.inputFullpath, '')
        .replace(/\\/g, '/')

    rootpath = (rootpath === '' ? '.' : rootpath.substring(1).replace(/[\w-@.]+/g, '..'))
    return rootpath
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

export function emptyDir(dir, ignoreArr) {
    const allFiles = fse.readdirSync(dir)
    for(let i = 0; i < allFiles.length; i ++) {
        const partPath = allFiles[i]
        if (ignoreArr.has(partPath)) {
            continue
        }

        const absolutePath = path.resolve(dir, partPath)

        if (ignoreArr.has(absolutePath)) {
            continue
        }

        fse.removeSync(absolutePath)
    }
}

export function miscNameToJSName(filepath) {
    const extname = path.extname(filepath)

    if (supportExtname.has(extname)) {
        return filepath.replace(extname, '.js')
            .replace('.wx.js', '.js')
    } else {
        return filepath
    }
}


export function judgeLibPath(relativePath) {
    if (relativePath.startsWith('/')
        || relativePath.startsWith('.')
    ) {
        return false
    }

    return true
}

export function getLibPath(path) {
    if (path.charAt(0) === '@') {
        const index = path.indexOf('/')
        const twoIndex = path.indexOf('/', index + 1)
        if (twoIndex === -1) {
            return path
        } else {
            return path.substring(0, twoIndex)
        }
    } else {
        const index = path.indexOf('/')
        if (index === -1) {
            return path
        } else {
            return path.substring(0, index)
        }
    }
}


/**
 * 获取 最终的导入路径，如果导入的是目录，需要补全index
 * @param filepath
 * @param source
 */
export function getFinalSource(filepath, source) {
    const originalPath = path
        .resolve(path.dirname(filepath), source)

    if (fse.existsSync(originalPath)) {
        return `${source}/index`
    }

    return source
}


export function wxCompoutPath(rawPath) {
    if (!rawPath.startsWith(configure.inputFullpath)) {
        //TODO
        console.log('some wrong!'.error, rawPath)
    }


    const relativePath = rawPath.replace(configure.inputFullpath, '')

    if (relativePath.startsWith('/node_modules')) {
        return relativePath.replace('node_modules', 'npm')
    }

    return relativePath
}

