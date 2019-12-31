/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


interface IConfigObj {
    entry: string
    output: string

    plugins?: any

    resolve?: any

    module?: any

    subDir?: string

    name?: string
    appid?: string

    exclude?: any,
    include?: any
}

interface IConfigure {
    resolve?: any
    configObj?: IConfigObj

    entryFullpath?: string
    outputFullpath?: string
    inputFullpath?: string

    dev?: boolean

    allCompSet?: any

    analyzer?: boolean

    // 小程序平台全局对象
    mpGlobalObject: string
}

const configure = {
    // TODO 可配置,适配其他小程序
    mpGlobalObject: "wx"
} as IConfigure

export default configure