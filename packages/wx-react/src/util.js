/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import instanceManager from "./InstanceManager";
import {mpRoot} from "./constants";
import {HocComponent} from "./index";

export function getPropsMethod(wxInst, key) {
    const compInst = instanceManager.getCompInstByUUID(wxInst.data.diuu);

    if (compInst && compInst.props && compInst.props[key]) {
        return compInst.props[key];
    }
}

// 外层占位View， 作用是撑满小程序自定义组件生成的View
export const DEFAULTCONTAINERSTYLE = '_5_'

export function getCurrentContext(inst, parentContext) {
    const contextDec = inst.constructor.childContextTypes

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


export function getWxEventType(event) {
    switch (event) {
        case 'onPress':
            return 'tap'
        case 'onLongPress':
            return 'longpress'
        case 'onLoad':
            return 'load'
        case 'onError':
            return 'error'
        default:
            if (event.startsWith('bind')) {
                return event.substring(4)
            } else if (event.startsWith('catch')) {
                return event.substring(5)
            } else {
                return event
            }
    }

}


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

function recursiveGetC(c, r) {
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


export function cleanPageComp(pageComp) {
    mpRoot._c = mpRoot._c.filter(child => child !== pageComp)
    const allChildren = []
    recursiveGetC(pageComp, allChildren)
    invokeWillUnmount(allChildren)
}

/**
 * 基本标签的事件回调，统一储存在其parent的__eventHanderMap 字段，当parent被rerender的时候__eventHanderMap重新设置，当parent unmount的时候__eventHanderMap同时被销毁，
 * 故不会存在泄露。
 *
 * 此方法提供，通过parentDiuu， selfDiuu，  eventType 获取事件回调的机制
 *
 * @param parentDiuu
 * @param selfDiuu
 * @param eventType
 * @returns {*}
 */
export function getEventHandler(parentDiuu, selfDiuu, eventType) {
	const eventKey = selfDiuu + eventType

	let compInst = instanceManager.getCompInstByUUID(parentDiuu)
	while (compInst && compInst instanceof HocComponent) {
		compInst = compInst._c[0]
	}
	let eh =  compInst.__eventHanderMap[eventKey]

	// map地图组件的regionchange事件 type为begin/end
	if (!eh && (eventType === 'begin' || eventType === 'end')) {
		eh = compInst.__eventHanderMap[selfDiuu + 'regionchange']
	}
	return eh
}

/**
 * //TODO 不同的小程序，可能有不同的实现
 * @returns {*}
 */
export function getMpCurrentPage() {
	const pages = getCurrentPages()
	return pages[pages.length - 1]
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

export function isEmptyObject(obj) {
    if (!obj) {
        return false
    }
    for (const n in obj) {
        if (obj.hasOwnProperty(n) && obj[n]) {
            return false
        }
    }
    return true
}

// Object.is polyfill
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is
export function objectIs(x, y) {
    if (x === y) { // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return x !== 0 || 1 / x === 1 / y
    }
    // eslint-disable-next-line no-self-compare
    return x !== x && y !== y
}

export function isFunction(arg) {
    return typeof arg === 'function'
}

export const defer = typeof Promise === 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout

export function isUndefined(o) {
    return o === undefined
}

export function isArray(arg) {
    return Array.isArray(arg)
}

export function isNullOrUndef(o) {
    return isUndefined(o) || o === null
}

/**
 * JSON 克隆
 * @param {Object | Json} jsonObj json对象
 * @return {Object | Json} 新的json对象
 */
export function objClone(jsonObj) {
    var buf
    if (jsonObj instanceof Array) {
        buf = []
        var i = jsonObj.length
        while (i--) {
            buf[i] = objClone(jsonObj[i])
        }
        return buf
    } else if (jsonObj instanceof Object) {
        buf = {}
        for (var k in jsonObj) {
            buf[k] = objClone(jsonObj[k])
        }
        return buf
    } else {
        return jsonObj
    }
}

export function getPrototype(obj) {
    /* eslint-disable */
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(obj)
    } else if (obj.__proto__) {
        return obj.__proto__
    }
    /* eslint-enable */
    return obj.constructor.prototype
}

export function getPrototypeChain(obj) {
    const protoChain = []
    while ((obj = getPrototype(obj))) {
        protoChain.push(obj)
    }
    return protoChain
}

let isUsingDiff = true

export function getIsUsingDiff() {
    return isUsingDiff
}

export function setIsUsingDiff(flag) {
    isUsingDiff = Boolean(flag)
}
