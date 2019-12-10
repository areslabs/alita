/**
 * 单独记录模块信息，Alita使用的模块信息要比webpack提供的NormalModule丰富，故而单独记录。
 */

interface IModuleInfo {
    im: any

    ex: any

    isRF: boolean

    isEntry: boolean

    JSXElements?: Set<string>

    RFInfo?: any

    outFiles?: any,

    deps?: any,

}

interface IModuleInfos {
    [key: string]: IModuleInfo
}


const moduleInfos = {} as IModuleInfos

export function setModuleInfo(filepath, im, ex, isRF, isEntry, JSXElements) {
    if (!moduleInfos[filepath]) {
        moduleInfos[filepath] = {} as IModuleInfo
    }

    moduleInfos[filepath].im = im
    moduleInfos[filepath].ex = ex
    moduleInfos[filepath].isRF = isRF
    moduleInfos[filepath].isEntry = isEntry
    moduleInfos[filepath].JSXElements = JSXElements
}

export function setRFModuleInfo(filepath, RFInfo) {
    if (!moduleInfos[filepath]) {
        moduleInfos[filepath] = {} as IModuleInfo
    }

    moduleInfos[filepath].RFInfo = RFInfo
}

export function setModuleDeps(filepath, deps) {
    if (!moduleInfos[filepath]) {
        moduleInfos[filepath] = {} as IModuleInfo
    }

    moduleInfos[filepath].deps = deps
}

export function getModuleInfo(filepath) {
    return moduleInfos[filepath]
}

export function updateModuleOutFiles(filepath, outFiles) {
    moduleInfos[filepath].outFiles = outFiles
}

export function removeModuleInfo(filepath) {
    delete moduleInfos[filepath]
}

