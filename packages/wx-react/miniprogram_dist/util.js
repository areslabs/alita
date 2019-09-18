/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import instanceManager from "./InstanceManager";

export function getPropsMethod(wxInst, key) {
    const compInst = instanceManager.getCompInstByUUID(wxInst.data.diuu);

    if (compInst && compInst.props && compInst.props[key]) {
        return compInst.props[key];
    }
}

/**
 * onX
 * @param name
 * @returns {boolean}
 */
export function isEventProp(name) {
    if (!name || name.length <= 3) return false;
    const trCode = name.charCodeAt(2);
    return name.charCodeAt(0) === 111
        && name.charCodeAt(1) === 110
        && trCode >= 65
        && trCode <= 90;
}


// 外层占位View， 作用是撑满小程序自定义组件生成的View
export const DEFAULTCONTAINERSTYLE = '_5_'

export function getCurrentContext(inst, parentContext) {
    const contextDec = Object.getPrototypeOf(inst).constructor.childContextTypes

    if (!contextDec) {
        return parentContext
    } else {
        const instContext = inst.getChildContext()
        return {
            ...parentContext,
            ...instContext
        }
    }

}

export function filterContext(nodeName, parentContext) {
    const contextDec = nodeName.contextTypes

    if (!contextDec) {
        return {}
    } else {
        const allKeys = Object.keys(contextDec)
        const r = {}

        for (let i = 0; i < allKeys.length; i++) {
            const k = allKeys[i]
            r[k] = parentContext[k]
        }

        return r
    }
}


export function setDeepData(inst, v, path) {
    const arr = path.split(/[.\[]/)

    let tmpObj = inst
    for (let i = 0; i < arr.length - 1; i++) {
        const sk = arr[i]
        if (sk.charAt(sk.length - 1) === ']') {
            const index = Number(sk.substring(0, sk.length - 1))
            if (!Number.isNaN(index)) {
                tmpObj = tmpObj[index]
            } else {
                tmpObj = tmpObj[sk]
            }
        } else {
            tmpObj = tmpObj[sk]
        }
    }

    const endk = arr[arr.length - 1]
    tmpObj[endk] = v
}


export const HOCKEY = "HOCKEY"

export const FR_PENDING = "PENDING"
export const FR_DONE = "DONE"

export function recursionMountOrUpdate(comp) {
    for (let i = 0; i < comp._c.length; i++) {
        const inst = instanceManager.getCompInstByUUID(comp._c[i])
        recursionMountOrUpdate(inst)
    }

    if (comp.firstRender === FR_DONE) {
        comp.componentDidUpdate && comp.componentDidUpdate()
    } else {
        comp.firstRender = FR_DONE
        comp.componentDidMount && comp.componentDidMount()
        if (comp.isPageComp && !comp.hocWrapped && comp.componentDidFocus) {
            comp.componentDidFocus()
        }
    }
}

export const ReactWxEventMap = {
    'onPress': 'tap',
    'onLongPress': 'longpress',
    'onLoad': 'load',
    'onError': 'error'
}

export const rootUuid = '__root__'
export function getRootContext() {
    const rootInst = instanceManager.getCompInstByUUID(rootUuid)
    let topInst = rootInst
    while (topInst._c.length !== 0) {
        if (rootInst._c.length !== 1) {
            console.warn('Root页包裹路由的组件，不应该存在多个节点！')
        }
        topInst = instanceManager.getCompInstByUUID(rootInst._c[0])
    }

    return getCurrentContext(topInst, topInst._parentContext)
}

export function getRealOc(oc, nc, r) {
    if (!oc || oc.length === 0 ) {
        return []
    }

    const ncs = new Set(nc)
    for(let i = 0; i < oc.length; i ++) {
        const item = oc[i]

        if (ncs.has(item)) continue

        const comp = instanceManager.getCompInstByUUID(item)

        recursiveGetC(comp, r)
    }
}

export function recursiveGetC(c, r) {
    for (let i = 0; i < c._c.length; i ++ ) {
        const item = c._c[i]
        const comp = instanceManager.getCompInstByUUID(item)
        recursiveGetC(comp, r)
    }

    r.push(c)
}

/**
 * 由于微信小程序的detached的生命周期，触发并不准确，另外并不是每一个React组件都会有对应的小程序组件，所以willUnmount并没有选择通过
 * detached生命周期实现，比如Hoc组件 没有对应的小程序组件， 自定义组件render 返回null 也不会有对应的小程序组件
 * @param oldChildren
 */
export function invokeWillUnmount(oldChildren) {
    for(let i = 0; i < oldChildren.length; i ++ ) {
        const item = oldChildren[i]

        if(item.componentWillUnmount) {
            item.componentWillUnmount()
        }

        instanceManager.removeCompInst(item.__diuu__)
    }
}
