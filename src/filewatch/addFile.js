/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fse from 'fs-extra'
import {isStaticRes} from "../util/util"
import struc from "../struc"
import {supportExtname} from '../constants'

const path = require('path')

// 如果存在.wx.js 那么 .js 的文件不用处理
function hasWxFile(srcpath) {
    const extname = path.extname(srcpath)
    if (supportExtname.has(extname)) {
        const wxSrcpath = srcpath.replace(extname, `.wx${extname}`)
        if (fse.existsSync(wxSrcpath)) {
            return true
        }
    }

    return false
}

/**
 * 新增一个文件的处理，按照如下规则
 * 1. isFileIgnore为true的直接忽略
 * 2. 如果存在 [filename].wx.js 文件，则忽略 [filename].js 文件
 * 3. xx@3x.png，xx@2x.png，xx.png 对于这种图片资源，将拷贝最清晰资源，比如xx@3x.png，xx@2x.png同时存在，拷贝xx@3x.png，并且命名为xx.png
 * 4. 其他非js文件，直接拷贝
 * 5. 普通js文件（非React组件文件），baseTran 以后 生成对于文件
 * 6. React组件文件，tran 以后 生成.json， .js， .wxml， .wxss， .comp.js 文件 可能会生成多份
 * 7. 入口文件 生成对应 入口文件
 * @param filepath
 * @returns {Promise<void>}
 */
export default async function addFile(filepath) {
    const {INPUT_DIR, OUT_DIR, configObj} = global.execArgs

    const relativePath = filepath.replace(INPUT_DIR, '').replace(/\\/g, '/').substring(1)

    const srcpath = filepath  //path.resolve(INPUT_DIR, filepath)
    let targetpath = filepath.replace(INPUT_DIR, OUT_DIR) //path.resolve(OUT_DIR, filepath)


    const hasWx = hasWxFile(srcpath)
    if (hasWx) {
        console.log(`${srcpath.replace(global.execArgs.INPUT_DIR, '')} 检测到有wx后缀文件存在，忽略！`.info)
        return []
    }


    // 如果 xx@3x.png 存在，则忽略xx@2x.png， xx.png
    if (isStaticRes(srcpath)) {
        if (srcpath.includes('@3x')) {
            // do nothing
            targetpath = targetpath.replace('@3x', '')
        } else if (srcpath.includes('@2x')) {
            const txPath = srcpath.replace('@2x', '@3x')
            if (fse.existsSync(txPath)) {
                return []
            }

            targetpath = targetpath.replace('@2x', '')
        } else if (srcpath.includes('@1x')) {
            const sxPath = srcpath.replace('@1x', '@2x')
            if (fse.existsSync(sxPath)) {
                return []
            }

            const txPath = srcpath.replace('@1x', '@3x')
            if (fse.existsSync(txPath)) {
                return []
            }

            targetpath = targetpath.replace('@1x', '')
        } else {
            const extname = path.extname(srcpath)
            const oxPath = srcpath.replace(extname, `@1x${extname}`)
            if (fse.existsSync(oxPath)) {
                return []
            }
            const sxPath = srcpath.replace(extname, `@2x${extname}`)
            if (fse.existsSync(sxPath)) {
                return []
            }
            const txPath = srcpath.replace(extname, `@3x${extname}`)
            if (fse.existsSync(txPath)) {
                return []
            }
        }
    }

    const allFilepaths = await struc(srcpath, targetpath)
    console.log('process file:'.info, relativePath)
    return allFilepaths
}
