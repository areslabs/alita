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

        let wxCompPathRelative = '.'
        if (json.wxComponents.path) {
            const wxCompPath = json.wxComponents.path
            wxCompPathRelative = wxCompPath.startsWith('/') ? "." + wxCompPath : wxCompPath
            const wxCompTargetPath = path.resolve(configure.outputFullpath, 'npm', aliasPP)
            if (!fse.existsSync(wxCompTargetPath)) {
                const sourcePath = path.resolve(path.dirname(pajPath), wxCompPathRelative)
                const targetPath = path.resolve(configure.outputFullpath, 'npm', aliasPP, wxCompPathRelative)
                fse.copySync(sourcePath, targetPath)
            }
        }

        const pathMap = {}
        for(let i = 0; i < components.length; i ++ ) {

            const comp = components[i]
            const {
                name,
                path: comPath,
                base,
                needOperateChildren,
                jsxProps,
                isText
            } = comp

            const finalPath = comPath.startsWith('/') ? `.${comPath}` : comPath
            pathMap[name] =  path.posix.resolve('/npm', aliasPP, wxCompPathRelative, finalPath)

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
