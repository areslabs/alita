import * as path from "path"
import * as fse from "fs-extra"

import configure from '../configure'

const merge = require('deepmerge')

export const handleChanged = (info) => {

    const newWxOutFiles = {}
    let {appJSON} = info.entryInfo

    // 增加对 weixin目录下的app.json 文件处理
    const userAppJSONPath = path.resolve(configure.inputFullpath, 'weixin', 'app.json')
    if (fse.existsSync(userAppJSONPath)) {
        const userAppJSON = require(userAppJSONPath)
        appJSON = merge(appJSON, userAppJSON)

        // 移除输出目录的app.json
        fse.unlinkSync(path.resolve(configure.outputFullpath, 'weixin', 'app.json'))
    }


    const appJSONPath = path.resolve(configure.outputFullpath, 'app.json')
    newWxOutFiles[appJSONPath] = JSON.stringify(appJSON, null, '\t')

    return newWxOutFiles
}


