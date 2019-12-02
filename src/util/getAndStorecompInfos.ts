import * as fse from 'fs-extra'
import * as path from 'path'
import * as resolve from 'enhanced-resolve'
import traverse from "@babel/traverse";
import * as t from "@babel/types"
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

export function getCompInfos(ast, filepath) {

    const JSXElements = new Set([])

    traverse(ast, {
        JSXOpeningElement: path => {
            const name = (path.node.name as t.JSXIdentifier).name
            JSXElements.add(name)
        },
    })


    // 收集 组件信息
    traverse(ast, {
        exit(path) {
            if (path.type === 'ImportDeclaration') {
                handleImport(path, filepath, JSXElements);
                return
            }

            // @ts-ignore
            if (path.type === 'CallExpression' && path.node.callee.name === 'require' && path.key === 'init') {

                handleRequire(path, filepath, JSXElements)
                return
            }
        },
    })
}


function innerGetCompInfos(idens, JSXElements, filepath, relativePath) {
    const isCompPack = idens.some(iden => JSXElements.has(iden))

    if (!isCompPack) return

    const relativeFile = filepath.replace(configure.inputFullpath, '')
    const packagePath = getLibPath(relativePath)

    // 动画组件 AnimatedView 会退化为view
    if (packagePath === '@areslabs/wx-animated') return

    if (!compInfos[packagePath]) {
        const aliasPP = configure.alias[packagePath] || packagePath

        const pajPath =  resolve.sync(path.dirname(filepath), `${aliasPP}/package.json`)

        const json = fse.readJSONSync(pajPath)

        if (!json.wxComponents) {
            console.log(`${relativeFile}: 包${packagePath}是组件包，请按照alita规则处理组件包！`.error)
            compInfos[packagePath] = {}
            return
        }


        const components = json.wxComponents.components

        const wxCompPath = json.wxComponents.path
        const wxCompTargetPath = path.resolve(configure.outputFullpath, 'npm', aliasPP)
        if (!fse.existsSync(wxCompTargetPath)) {
            fse.copySync(pajPath.replace('package.json', wxCompPath), wxCompTargetPath)
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

function handleRequire(path, filepath, JSXElements) {
    const relativePath = path.node.arguments[0].value
    const isLibPath = judgeLibPath(relativePath)
    if (!isLibPath) return

    const idens = []

    const id = path.parentPath.node.id
    if (id.type === 'Identifier') {
        idens.push(id.name)
    } else if (id.type === 'ObjectPattern') {
        const opp = id.properties
        for(let i = 0; i < opp.length; i++) {
            const item = opp[i]
            if (item.type === 'ObjectProperty') {
                idens.push(item.key.name)
            }
        }
    }


    innerGetCompInfos(idens, JSXElements, filepath, relativePath)
}

function handleImport(path, filepath, JSXElements) {
    const relativePath = path.node.source.value

    const isLibPath = judgeLibPath(relativePath)

    if (!isLibPath) return


    const idens = path.node.specifiers.map(item => item.local.name)

    innerGetCompInfos(idens, JSXElements, filepath, relativePath)
}
