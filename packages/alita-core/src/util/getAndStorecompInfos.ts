import * as fse from 'fs-extra'
import * as path from 'path'
import {syncResolve} from './myResolve'
import configure from "../configure";
import {getLibPath} from './util'

import {RNCOMPSET} from '../constants'


export const packageInfos: any = {}

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

    if (!packageInfos[packagePath]) {
        const pajPath =  syncResolve(path.dirname(filepath), `${packagePath}/package.json`)

        const json = fse.readJSONSync(pajPath)

        if (!json.wxComponents) {
            packageInfos[packagePath] = {}
            return
        }

        packageInfos[packagePath] = {
            dirname: path.dirname(pajPath),
            aliasPackName: configure.resolve.alias[packagePath] || packagePath,
            wxComponents: json.wxComponents
        }

        const components = json.wxComponents.components

        if (packagePath === 'react-native') {
            components.forEach(comp => {
                RNCOMPSET.add(comp.name.substring(2))
            })
        }


        for(let i = 0; i < components.length; i ++ ) {

            const comp = components[i]

            const {
                name,
                base = true,
                needOperateChildren,
                jsxProps,
                isText
            } = comp



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
    }
}
