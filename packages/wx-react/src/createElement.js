/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// 一般情况下 uuid都应该是存在的， 但是HOC的包裹的组件，uuid需要手动设置
import {LayoutConstsMap} from './constants'
const TmpKey = "HOCKEY"

export default function createElement(comp, props, ...args) {

    //TODO waring重构
    if (!comp && props.__source) {
        console.error(`${props.__source.fileName} 文件存在 <XX />, 其中XX为undefined！请排查`)
        return
    }

    if (comp.notSupport) {
        comp.notSupport()
        return
    }

    let children = []
    for (let i = 0; i < args.length; i++) {
        if (args[i] instanceof Array) {
            children = children.concat(args[i])
        } else {
            children.push(args[i])
        }
    }

    const {animation, ref, key, tempName, tempVnode, CPTVnode, datakey, diuu, __source, ...rprops} = props || {}

    if (props.onLayout) {
        props[LayoutConstsMap.CollectOnLayoutEvent]({
            id: props[LayoutConstsMap.LayoutEventKey],
            onLayout: props.onLayout,
            isRender: false
        })
    }
    if (typeof props.ref === 'string') {
        console.warn('ref只支持函数形式，不支持字符串')
    }
    if (props.onStartShouldSetResponder
        || props.onMoveShouldSetResponder
        || props.onResponderGrant
        || props.onResponderReject
        || props.onResponderMove
        || props.onResponderRelease
        || props.onResponderTerminationRequest
        || props.onResponderTerminate
    ) {
        console.warn('小程序不支持手势响应系统')
    }


    let finalProps = rprops
    if (comp.defaultProps) {
        finalProps = {
            ...comp.defaultProps,
            ...rprops
        }
    }

    finalProps.children = children

    let finalDiuu = diuu
    if (!diuu && typeof comp === 'function') {
        finalDiuu = TmpKey
    }

    return {
        isReactElement: true,
        nodeName: comp,
        props: finalProps,
        key: key,
        diuu : finalDiuu,
        ref,
        children,


        animation,
        tempName,
        tempVnode,
        CPTVnode,
        datakey,

        __source,  // add by RN babel presets
    }
}
