import * as fse from 'fs-extra'
import * as path from 'path'
import {syncResolve} from './myResolve'
import configure from "../configure";
import {getLibPath, judgeLibPath} from './util'


/*组件名和路径映射，方便后续生成小程序json文件*/
export const compInfos: any = {}

/*Text节点，一般来说只要官方的Text组件*/
export const textComp = new Set(['Text'])

/*属性是JSX片段，包括方法返回JSX片段等，Alita需要特殊处理这些属性*/
export const jsxPropsMap: any = {}

/*所有基本组件，包括RN官方组件，基本组件和自定义组件 Alita在转化的时候有一些区别*/
export const allBaseComp = new Set([])

/*需要处理children 为childrencpt的集合*/
export const extChildComp = new Set([])


export function getBackUpPath(name) {

    const allKeys = Object.keys(compInfos)

    for(let i = 0; i < allKeys.length; i ++) {
        const key = allKeys[i]
        const itemMap = compInfos[key]

        if (itemMap[name]) {
            return itemMap[name]
        }
    }
}

export function getLibCompInfos(idens, JSXElements, filepath, relativePath) {
    const packagePath = getLibPath(relativePath)

    // 动画组件 AnimatedView 会退化为view
    if (packagePath === '@areslabs/wx-animated') return

    if (!compInfos[packagePath]) {
        const pajPath =  syncResolve(path.dirname(filepath), `${packagePath}/package.json`)

        const json = fse.readJSONSync(pajPath)

        if (!json.wxComponents) {
            compInfos[packagePath] = {}
            return
        }


        const components = json.wxComponents.components

        const aliasPP = configure.resolve.alias[packagePath] || packagePath
        if (json.wxComponents.path) {
            const wxCompPath = json.wxComponents.path
            const wxCompTargetPath = path.resolve(configure.outputFullpath, 'npm', aliasPP)
            if (!fse.existsSync(wxCompTargetPath)) {
                fse.copySync(pajPath.replace('package.json', wxCompPath), wxCompTargetPath)
            }
        }

        const pathMap = {}
        for(let i = 0; i < components.length; i ++ ) {

            const comp = components[i]
            const {
                name,
                path,
                base,
                needOperateChildren,
                jsxProps,
                isText
            } = comp

            const finalPath = path.startsWith('/') ? path : `/${path}`
            pathMap[name] = `/npm/${aliasPP}${finalPath}`

            if (needOperateChildren === true) {
                extChildComp.add(name)
            }

            if (base === true) {
                allBaseComp.add(name)
            }

            if (jsxProps) {
                jsxPropsMap[name] = jsxProps
            }

            if (isText === true) {
                textComp.add(name)
            }
        }
        compInfos[packagePath] = pathMap
    }
}
