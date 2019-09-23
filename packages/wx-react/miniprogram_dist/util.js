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
        topInst = rootInst._c[0]
    }

    return getCurrentContext(topInst, topInst._parentContext)
}


export const EMPTY_FUNC = () => {}


export function getRealOc(oc, nc, r) {
    if (!oc || oc.length === 0 ) {
        return []
    }

    const ncs = new Set(nc)
    for(let i = 0; i < oc.length; i ++) {
        const comp = oc[i]

        if (ncs.has(comp)) continue

        recursiveGetC(comp, r)
    }
}

export function recursiveGetC(c, r) {
    for (let i = 0; i < c._c.length; i ++ ) {
        const comp = c._c[i]
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



export function recursionMountOrUpdate(comp) {
    for (let i = 0; i < comp._c.length; i++) {
        const inst = comp._c[i]

        // 组件不需要更新，提前返回的情况
        if (inst.firstRender === FR_DONE && inst.shouldUpdate === false) {
            continue
        }

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

export function recursionFirstFlushWX(top, topWx, comps, showUpdaterList, cb) {
    if (comps.length === 0) {
        cb && cb()
        return
    }

    topWx.groupSetData(() => {
        const newComps = []
        for(let i = 0; i < comps.length; i ++) {
            const item = comps[i]
            const wxItem = item.getWxInst()

            item._c.forEach(childComp => {
                // 组件render null
                if (childComp._myOutStyle === false) {
                    return
                }

                // 跳过hoc包裹的组件
                childComp = childComp.getDeepComp()
                newComps.push(childComp)
            })

            if (i === comps.length - 1) {
                if (newComps.length === 0) {
                    showUpdaterList.forEach(({inst, data}) => {
                       inst.setData(data)
                    })
                }

                wxItem.setData({
                    _r: item._r
                }, () => {
                    recursionFirstFlushWX(top, topWx, newComps, showUpdaterList, cb)
                })
            } else {
                wxItem.setData({
                    _r: item._r
                })
            }
        }
    })
}

/**
 * 分层groupSetData的方式，存在一个问题：当父元素的大小，由子元素决定的时候，由于父元素先渲染会导致抖动。
 * 解决这个问题的方式是： 先把顶层父元素设置为： opacity: 0; 当所有子孙元素都渲染完成之后统一在恢复样式
 * @type {string}
 */
export const HIDDEN_STYLE = " opacity: 0;"


export function getShowUpdaterMap(firstFlushList) {
    const showUpdaterMap = new Map()
    firstFlushList.forEach(comp => {
        const topComp = comp.getTopComp()
        const p = topComp._p.getWxInst()

        const key = topComp._keyPath
        const value = topComp._myOutStyle

        const updater = showUpdaterMap.get(p)
        if (updater) {
            Object.assign(updater.hiddenData, {
                [`${key}style`]: `${value}${HIDDEN_STYLE}`
            })
            Object.assign(updater.data, {
                [`${key}style`]: value
            })
        } else {
            showUpdaterMap.set(p, {
                inst: p,
                hiddenData: {
                    [`${key}style`]: `${value}${HIDDEN_STYLE}`
                },
                data: {
                    [`${key}style`]: value
                }
            })
        }
    })
    return showUpdaterMap
}
