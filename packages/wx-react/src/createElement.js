/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// 一般情况下 uuid都应该是存在的， 但是HOC的包裹的组件，uuid需要手动设置
const TmpKey = "HOCKEY"

export default function createElement(comp, props, ...args) {
    if (!comp) {
        console.error(`组件为${comp}, 是否忘记导入？？`)
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

    const {animation, ref, key, tempName, tempVnode, CPTVnode, datakey, diuu, ...rprops} = props || {}

    // 通用的不支持属性
    if (props.onLayout) {
        console.warn('小程序不支持onLayout属性')
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

    return {
        isReactElement: true,
        nodeName: comp,
        props: finalProps,
        key: key,
        diuu : diuu || TmpKey,
        ref,
        children,


        animation,
        tempName,
        tempVnode,
        CPTVnode,
        datakey,
    }
}
