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
    const arr = path.split('.')

    let tmpObj = inst
    for (let i = 0; i < arr.length - 1; i++) {
        const sk = arr[i]
        tmpObj = tmpObj[sk]
    }

    const endk = arr[arr.length - 1]
    tmpObj[endk] = v
}


export const HOCKEY = "HOCKEY"

export const FR_PENDING = "PENDING"
export const FR_DONE = "DONE"


export function recursionUnmount(comp) {
    const child = comp._c[0]
    if (child) {
        const childComp = instanceManager.getCompInstByUUID(child)
        if (childComp.hocWrapped) {
            recursionUnmount(childComp)
        }
    }

    comp.componentWillUnmount && comp.componentWillUnmount()
    instanceManager.removeUUID(comp.__diuu__)
}

export function recursionMount(comp) {
    for (let i = 0; i < comp._c.length; i++) {
        const inst = instanceManager.getCompInstByUUID(comp._c[i])
        recursionMount(inst)
    }


    comp.firstRender = FR_DONE

    comp.componentDidMount && comp.componentDidMount()


    if (comp.updateQueue && comp.updateQueue.length > 0) {
        const newState = {}
        for (let j = 0; j < comp.updateQueue.length; j++) {
            Object.assign(newState, comp.updateQueue[j])
        }
        comp.updateQueue = []

        let finalCb = null
        if (comp.updateQueueCB.length > 0) {
            const cbQueue = comp.updateQueueCB

            finalCb = () => {
                for (let i = 0; i < cbQueue.length; i++) {
                    cbQueue[i]()
                }
            }
            comp.updateQueueCB = []
        }

        const isForceUpdate = comp.isForceUpdate
        comp.isForceUpdate = false

        comp.updateInner(newState, finalCb, isForceUpdate)
    }


    comp.firstRenderRes && comp.firstRenderRes()
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


export const EMPTY_FUNC = () => {}
