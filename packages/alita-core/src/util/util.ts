/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as path from 'path'
import * as fse from 'fs-extra'

import configure from '../configure'

const low = 'abcdefghijklmnopqrstuvwxyz'
const allChars = (low + low.toUpperCase()).split('')

/**
 * 产生顺序字符串: a --> b --> c .....--> z --> A ... --> Z --> aa --> ab ... --> ZZ --> aaa ...-> ZZZ
 *
 * @returns {any}
 */
export function geneOrder() {
    let v = ['a']
    return {
        get next() {
            let index = v.length - 1
            while (incre(index, v)) {
                index --

                if (index === -1) {
                    v.unshift('a')
                    break
                }
            }

            return v.join('')
        },
    }
}

function incre(index, v) {
    const char = v[index]

    if (char === 'Z') {
        v[index] = 'a'
        return true
    } else {
        v[index] = allChars[allChars.indexOf(char) + 1]
        return false
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
        .replace(configure.outputFullpath, '')
        .replace(/\\/g, '/')

    rootpath = (rootpath === '' ? '.' : rootpath.substring(1).replace(/[\w-@.]+/g, '..'))
    return rootpath
}

export const RootPrefixPlaceHolader = "____RootPrefixPlaceHolader____"


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

    return filepath.replace(extname, '.js')
        .replace('.wx.js', '.js')
        .replace('node_modules', 'npm')
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



