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
}

interface IConfigure {
    alias?: object,
    configObj?: IConfigObj,

    entryFullpath?: string,
    outputFullpath?: string,
    inputFullpath?: string

    dev?: boolean,

    allCompSet?: any,
}

const configure = {} as IConfigure

export default configure