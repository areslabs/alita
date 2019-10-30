/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
function createElement(comp, props, ...args) {
    if (!comp) {
        console.error(`组件为${comp}, 是否忘记导入？？`);
        return
    }

    if (comp.notSupport) {
        comp.notSupport();
        return
    }

    let children = [];
    for (let i = 0; i < args.length; i++) {
        if (args[i] instanceof Array) {
            children = children.concat(args[i]);
        } else {
            children.push(args[i]);
        }
    }

    const {animation, ref, key, tempName, tempVnode, CPTVnode, datakey, diuu, ...rprops} = props || {};

    // 通用的不支持属性
    if (props.onLayout) {
        console.warn('小程序不支持onLayout属性');
    }
    if (typeof props.ref === 'string') {
        console.warn('ref只支持函数形式，不支持字符串');
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
        console.warn('小程序不支持手势响应系统');
    }


    let finalProps = rprops;
    if (comp.defaultProps) {
        finalProps = {
            ...comp.defaultProps,
            ...rprops
        };
    }

    finalProps.children = children;

    return {
        isReactElement: true,
        nodeName: comp,
        props: finalProps,
        key: key,
        diuu,
        ref,
        children,


        animation,
        tempName,
        tempVnode,
        CPTVnode,
        datakey,
    }
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * 实例管理模块，小程序和mini-react互相交互通过此模块
 */

const innerMap = {};

const wxInstSuffix = "__wx";

const compInstSuffix = "__comp";

var instanceManager = {
    getCompInstByUUID: function(uuid) {
        const key = `${uuid}${compInstSuffix}`;
        return innerMap[key]
    },

    setCompInst: function(uuid, comp) {
        const key = `${uuid}${compInstSuffix}`;
        innerMap[key] = comp;
    },

    getWxInstByUUID: function(uuid) {
        const key = `${uuid}${wxInstSuffix}`;
        return innerMap[key]
    },

    setWxCompInst: function(uuid, comp) {
        const key = `${uuid}${wxInstSuffix}`;
        innerMap[key] = comp;
    },

    removeWxInst: function (uuid) {
        const key = `${uuid}${wxInstSuffix}`;
        if (innerMap[key]) {
            delete innerMap[key];
        }
    },


    // 基本组件的移除操作
    removeUUID: function(uuid) {
        const wxKey = `${uuid}${wxInstSuffix}`;
        const compKey = `${uuid}${compInstSuffix}`;

        const compInst = innerMap[compKey];
        if (compInst && typeof compInst._ref === 'function') {
            compInst._ref(null);
        }

        delete innerMap[wxKey];
        delete innerMap[compKey];
    },

    removeCompInst: function (uuid) {
        const key = `${uuid}${compInstSuffix}`;
        if (innerMap[key]) {

            if (typeof innerMap[key]._ref === 'function') {
                innerMap[key]._ref(null);
            }

            delete innerMap[key];
        }
    },

    compExist: function(comp) {
        const compKey = `${comp.__diuu__}${compInstSuffix}`;

        return !!innerMap[compKey]
    },
};

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


// effect type
const UPDATE_EFFECT = 0;
const INIT_EFFECT = 1;
const STYLE_EFFECT = 2;
const STYLE_WXINIT_EFFECT = 3;

// update type
const UpdateState = 0;
//export const ReplaceState = 1;
const ForceUpdate = 2;


// mpRoot
const mpRoot = {
    childContext: {},
    _c: []
};

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function getPropsMethod(wxInst, key) {
    const compInst = instanceManager.getCompInstByUUID(wxInst.data.diuu);

    if (compInst && compInst.props && compInst.props[key]) {
        return compInst.props[key];
    }
}

// 外层占位View， 作用是撑满小程序自定义组件生成的View
const DEFAULTCONTAINERSTYLE = '_5_';

function getCurrentContext(inst, parentContext) {
    const contextDec = inst.constructor.childContextTypes;

    if (!contextDec) {
        return parentContext
    } else {
        const instContext = inst.getChildContext();
        return {
            ...parentContext,
            ...instContext
        }
    }

}

function filterContext(nodeName, parentContext) {
    const contextDec = nodeName.contextTypes;

    if (!contextDec) {
        return {}
    } else {
        const allKeys = Object.keys(contextDec);
        const r = {};

        for (let i = 0; i < allKeys.length; i++) {
            const k = allKeys[i];
            r[k] = parentContext[k];
        }

        return r
    }
}


function setDeepData(inst, v, path) {
    const arr = path.split(/[.\[]/);

    let tmpObj = inst;
    for (let i = 0; i < arr.length - 1; i++) {
        const sk = arr[i];
        if (sk.charAt(sk.length - 1) === ']') {
            const index = Number(sk.substring(0, sk.length - 1));
            if (!Number.isNaN(index)) {
                tmpObj = tmpObj[index];
            } else {
                tmpObj = tmpObj[sk];
            }
        } else {
            tmpObj = tmpObj[sk];
        }
    }

    const endk = arr[arr.length - 1];
    tmpObj[endk] = v;
}


const HOCKEY = "HOCKEY";

const ReactWxEventMap = {
    'onPress': 'tap',
    'onLongPress': 'longpress',
    'onLoad': 'load',
    'onError': 'error'
};

function getRealOc(oc, nc, r) {
    if (!oc || oc.length === 0 ) {
        return []
    }

    const ncs = new Set(nc);
    for(let i = 0; i < oc.length; i ++) {
        const comp = oc[i];

        if (ncs.has(comp)) continue

        recursiveGetC(comp, r);
    }
}

function recursiveGetC(c, r) {
    for (let i = 0; i < c._c.length; i ++ ) {
        const comp = c._c[i];
        recursiveGetC(comp, r);
    }

    r.push(c);
}

/**
 * 由于微信小程序的detached的生命周期，触发并不准确，另外并不是每一个React组件都会有对应的小程序组件，所以willUnmount并没有选择通过
 * detached生命周期实现，比如Hoc组件 没有对应的小程序组件， 自定义组件render 返回null 也不会有对应的小程序组件
 * @param oldChildren
 */
function invokeWillUnmount(oldChildren) {
    for(let i = 0; i < oldChildren.length; i ++ ) {
        const item = oldChildren[i];

        if(item.componentWillUnmount) {
            item.componentWillUnmount();
        }

        instanceManager.removeCompInst(item.__diuu__);
    }
}


function cleanPageComp(pageComp) {
    mpRoot._c = mpRoot._c.filter(child => child !== pageComp);
    const allChildren = [];
    recursiveGetC(pageComp, allChildren);
    invokeWillUnmount(allChildren);
}

function reactCompHelper(obj) {
    obj.properties = {
        ...obj.properties,
        diuu: null,
    };

    const rawAttached = obj.attached;
    obj.attached = function () {
        const rawData = this.data;
        Object.defineProperty(this, 'data', {
            get: function () {
                const  compInst = instanceManager.getCompInstByUUID(rawData.diuu);
                return {
                    ...rawData,
                    ...compInst.props
                }
            },
        });
        rawAttached && rawAttached.call(this);
        instanceManager.setWxCompInst(this.data.diuu, this);
    };

    const rawDetached = obj.detached;
    obj.detached = function () {
        rawDetached && rawDetached.call(this);
        instanceManager.removeUUID(this.data.diuu);
    };

    return obj
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
const hasOwn = Object.prototype.hasOwnProperty;

// 参考：https://github.com/facebook/react/pull/16212
let is;
if (typeof Object.is === 'function') {
    is = Object.is;
} else {
    is = (x, y) => {
        if (x === y) {
            return x !== 0 || y !== 0 || 1 / x === 1 / y
        } else {
            return x !== x && y !== y
        }
    };
}



function shallowEqual(objA, objB) {
    if (is(objA, objB)) return true

    if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
        return false
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) return false

    for (let i = 0; i < keysA.length; i++) {
        if (keysA[i] === 'children') continue

        if (!hasOwn.call(objB, keysA[i]) ||
            !is(objA[keysA[i]], objB[keysA[i]])) {
            return false
        }
    }

    return true
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


/**
 * 高效生成唯一uuid，需要全局不重复
 */

const charMap = {
    "0": "1",
    "1": "2",
    "2": "3",
    "3": "4",
    "4": "5",
    "5": "6",
    "6": "7",
    "7": "8",
    "8": "9",
    "9": "A",
    "A": "B",
    "B": "C",
    "C": "D",
    "D": "E",
    "E": "F",
    "F": "G",
    "G": "H",
    "H": "I",
    "I": "J",
    "J": "K",
    "K": "L",
    "L": "M",
    "M": "N",
    "N": "O",
    "O": "P",
    "P": "Q",
    "Q": "R",
    "R": "S",
    "S": "T",
    "T": "U",
    "U": "V",
    "V": "W",
    "W": "X",
    "X": "Y",
    "Y": "Z",
    "Z": "a",
    "a": "b",
    "b": "c",
    "c": "d",
    "d": "e",
    "e": "f",
    "f": "g",
    "g": "h",
    "h": "i",
    "i": "j",
    "j": "k",
    "k": "l",
    "l": "m",
    "m": "n",
    "n": "o",
    "o": "p",
    "p": "q",
    "q": "r",
    "r": "s",
    "s": "t",
    "t": "u",
    "u": "v",
    "v": "w",
    "w": "x",
    "x": "y",
    "y": "z",
    "z": "0"
};

const uuid = ["a", "0", "0", "0", "0", "0", "0", "0"];
function geneUUID() {
    let start = 7;
    while (incr(start) && start > 0) {
        start = start - 1;
    }

    return uuid.join('')
}


function incr(index) {
    const v = uuid[index];
    uuid[index] = charMap[v];
    return v === "z"
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
const VIEW = 'view';
const SCROLL = 'scroll';
const INNERTEXT = 'InnerText';
const OUTERTEXT = 'OuterText';

var styleType = {
    VIEW,
    SCROLL,
    INNERTEXT,
    OUTERTEXT
};

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const AddPx = "ADDPX";
const AddPxORPercent = "ADDPXORPERCENT";
const RawValue = "RAWVALUE";
const ValObject = "VALOBJECT";
const FuncRawValue = "FUNCRAWVALUE";
const FuncAddPx = "FUNCADDPX";
const realBigThing = {
    alignItems: { name: "align-items", type: RawValue },
    alignSelf: { name: "align-self", type: RawValue },
    backfaceVisibility: { name: "backface-visibility", type: RawValue },
    backgroundColor: { name: "background-color", type: RawValue },
    borderBottomColor: { name: "border-bottom-color", type: RawValue },
    borderBottomLeftRadius: { name: "border-bottom-left-radius", type: AddPx },
    borderBottomRightRadius: { name: "border-bottom-right-radius", type: AddPx },
    borderBottomWidth: { name: "border-bottom-width", type: AddPx },
    borderColor: { name: "border-color", type: RawValue },
    borderLeftColor: { name: "border-left-color", type: RawValue },
    borderLeftWidth: { name: "border-left-width", type: AddPx },
    borderRadius: { name: "border-radius", type: AddPx },
    borderRightColor: { name: "border-right-color", type: RawValue },
    borderRightWidth: { name: "border-right-width", type: AddPx },
    borderStyle: { name: "border-style", type: RawValue },
    borderTopColor: { name: "border-top-color", type: RawValue },
    borderTopLeftRadius: { name: "border-top-left-radius", type: AddPx },
    borderTopRightRadius: {name: "border-top-right-radius", type: AddPx},
    borderTopWidth: { name: "border-top-width", type: AddPx },
    borderWidth: { name: "border-width", type: AddPx },
    bottom: { name: "bottom", type: AddPxORPercent },
    color: { name: "color", type: RawValue },
    display: { name: "display", type: RawValue },
    decomposedMatrix: { name: "decomposedMatrix" },
    elevation: { name: "elevation", type: AddPx },
    flex: { name: "flex", type: RawValue },
    flexDirection: { name: "flex-direction", type: RawValue },
    flexShrink: { name: "flex-shrink", type: RawValue },
    flexWrap: { name: "flex-wrap", type: RawValue },
    fontFamily: { name: "font-family", type: RawValue },
    fontSize: { name: "font-size", type: AddPx },
    fontStyle: { name: "font-style", type: RawValue },
    fontWeight: { name: "font-weight", type: RawValue },
    fontVariant: { name: "font-variant", type: RawValue },
    height: { name: "height", type: AddPxORPercent },
    justifyContent: { name: "justify-content", type: RawValue },
    left: { name: "left", type: AddPxORPercent },
    letterSpacing: { name: "letter-spacing", type: AddPx },
    lineHeight: { name: "line-height", type: AddPx },
    margin: { name: "margin", type: AddPxORPercent },
    marginBottom: { name: "margin-bottom", type: AddPxORPercent },
    marginHorizontal: { name: "margin-horizontal", type: AddPxORPercent },
    marginLeft: { name: "margin-left", type: AddPxORPercent },
    marginRight: { name: "margin-right", type: AddPxORPercent },
    marginTop: { name: "margin-top", type: AddPxORPercent },
    marginVertical: { name: "margin-vertical", type: AddPxORPercent },
    maxHeight: { name: "max-height", type: AddPxORPercent },
    maxWidth: { name: "max-width", type: AddPxORPercent },
    minHeight: { name: "min-height", type: AddPxORPercent },
    minWidth: { name: "min-width", type: AddPxORPercent },
    opacity: { name: "opacity", type: RawValue },
    overflow: { name: "overflow", type: RawValue },
    overlayColor: { name: "overlay-color", type: RawValue },
    padding: { name: "padding", type: AddPxORPercent },
    paddingBottom: { name: "padding-bottom", type: AddPxORPercent },
    paddingHorizontal: { name: "padding-horizontal", type: AddPxORPercent },
    paddingLeft: { name: "padding-left", type: AddPxORPercent },
    paddingRight: { name: "padding-right", type: AddPxORPercent },
    paddingTop: { name: "padding-top", type: AddPxORPercent },
    paddingVertical: { name: "padding-vertical", type: AddPxORPercent },
    position: { name: "position", type: RawValue },
    resizeMode: { name: "resize-mode", type: RawValue },
    right: { name: "right", type: AddPxORPercent },
    shadowColor: { name: "shadow-color", type: RawValue },
    shadowOffset: { name: "shadow-offset", type: ValObject },
    shadowOpacity: { name: "shadow-opacity", type: RawValue },
    shadowRadius: { name: "shadow-radius", type: AddPx },
    textAlign: { name: "text-align", type: RawValue },
    textAlignVertical: { name: "text-align-vertical", type: RawValue },
    textDecorationColor: { name: "text-decoration-color", type: RawValue },
    textDecorationLine: { name: "text-decoration-line", type: RawValue },
    textDecorationStyle: { name: "text-decoration-style", type: RawValue },
    textShadowColor: { name: "text-decoration-style", type: RawValue },
    textShadowOffset: { name: "text-shadow-offset", type: ValObject },
    textShadowRadius: { name: "text-shadow-radius", type: AddPx },
    textTransform: { name: "text-transform", type: RawValue },
    tintColor: { name: "tint-color", type: RawValue },
    top: { name: "top", type: AddPxORPercent },
    //no support for matix
    // transform: {name:"transform",type:""},
    perspective: { name: "perspective", type: FuncRawValue },
    translateX: { name: "translateX", type: FuncAddPx },
    translateY: { name: "translateY", type: FuncAddPx },
    rotate: { name: "rotate", type: FuncRawValue },
    rotateX: { name: "rotateX", type: FuncRawValue },
    rotateY: { name: "rotateY", type: FuncRawValue },
    rotateZ: { name: "rotateZ", type: FuncRawValue },
    scaleX: { name: "scaleX", type: FuncRawValue },
    scaleY: { name: "scaleY", type: FuncRawValue },
    width: { name: "width", type: AddPxORPercent },
    writingDirection: { name: "writing-direction", type: RawValue },
    zIndex: { name: "z-index", type: RawValue }
};

const DEFAULTVIEWSTYLE = "_1_";
const DEFAULTTEXTWSTYLE = "_2_";

const DEFAULTINNERTEXTWSTYLE = "_3_";
const DEFAULTSCROLLVIEWSTYLE = "_4_";


//mkup the string
function tackleWithStyleObj(obj, styleType) {
    const airport = flattenArray(obj);
    const styleStr = parseElement(airport);
    if (!styleType) {
        return styleStr
    }

    let prefixStyle = '';
    if (styleType === INNERTEXT) {
        prefixStyle = DEFAULTINNERTEXTWSTYLE;
    } else if (styleType === OUTERTEXT) {
        prefixStyle = DEFAULTTEXTWSTYLE;

        if (obj && !obj.height) { // 根据RN的Text的行为推测
            prefixStyle = prefixStyle + "max-height: 100%;";
        }

        if (obj && !obj.width) { // 根据RN的Text的行为推测
            prefixStyle = prefixStyle + "max-width: 100%;";
        }
    } else if (styleType === SCROLL) {
        prefixStyle = DEFAULTSCROLLVIEWSTYLE;
    } else {
        prefixStyle = DEFAULTVIEWSTYLE;
    }
    return `${prefixStyle}${styleStr}`
}

function parseElement(element) {
    if (Array.isArray(element)) {
        let out = "";
        for (let index in element) {
            out += parseElement(element[index]);
        }
        return out;
    }
    if (typeof element === "string") {
        return element;
    }
    if (typeof element === "object") {
        return parseObj(element);
    }
    //unmatch
    return "";
}


function parseObj(obj) {

    let out = "";

    for (let k in obj) {
        //单独处理
        if (k === "transform") {
            let tmp = "";
            let arr = obj[k];
            for (let ind in arr) {
                let transObj = arr[ind];
                //transObj应当仅包含一个元素
                for (let ojbk in transObj) {
                    switch (realBigThing[ojbk].type) {
                        case FuncRawValue:
                            tmp += ojbk + "(" + transObj[ojbk] + ") ";
                            break;
                        case FuncAddPx:
                            tmp += ojbk + "(" + transObj[ojbk] + "px) ";
                            break;
                    }
                }
            }
            if (tmp.length > 0) {
                tmp = "transform: " + tmp.trim() + ";";
            }
            out += tmp;
            continue;
        }

        if (k === "marginHorizontal") {
            const v = obj[k];
            const fv = typeof v === "string" ? v : `${v}px`;
            let tmp = ` margin-left: ${fv}; margin-right: ${fv};`;
            out += tmp;
            continue;
        }

        if (k === "marginVertical") {
            const v = obj[k];
            const fv = typeof v === "string" ? v : `${v}px`;
            let tmp = ` margin-top: ${fv}; margin-bottom: ${fv};`;
            out += tmp;
            continue;
        }

        if (k === "paddingHorizontal") {
            const v = obj[k];
            const fv = typeof v === "string" ? v : `${v}px`;
            let tmp = ` padding-left: ${fv}; padding-right: ${fv};`;
            out += tmp;
            continue;
        }

        if (k === "paddingVertical") {
            const v = obj[k];
            const fv = typeof v === "string" ? v : `${v}px`;
            let tmp = ` padding-top: ${fv}; padding-bottom: ${fv};`;
            out += tmp;
            continue;
        }

        if (k === "flex") {
            if (obj[k] >= 1) {
                out += "flex:" + obj[k] + ";" + "flex-basis: 0%;";
                continue;
            } else if (obj[k] === 0) {
                continue;
            }
        }

        if (realBigThing[k] === undefined) {
            if(k === 'resizeMode') {
                console.warn('resizeMode属性请写在props上，而不是style');
            } else {
                console.warn(`style对象不支持${k}属性`);
            }
            continue
        }

        out += realBigThing[k].name + ":";
        switch (realBigThing[k].type) {
            case RawValue: {
                out += obj[k] + ";";
                break;
            }
            case AddPx: {
                out += obj[k] + "px;";
                break;
            }
            case AddPxORPercent: {
                if (Number(obj[k])) {
                    out += obj[k] + "px;";
                } else out += obj[k] + ";";
                break;
            }
            case ValObject: {
                //暂时只发现textShadowOffset，shadowOffset
                out += obj[k].width + "px " + obj[k].height + "px;";
                break;
            }
        }
    }

    return out;
}

function flattenArray(arr, ans = []) {
    if (!Array.isArray(arr)) return arr;
    for (let m in arr) {
        if (!Array.isArray(arr[m])) {
            ans.push(arr[m]);
        } else {
            flattenArray(arr[m], ans);
        }
    }
    return ans;
}


/**
 * the inverse process of tackleWithStyleObj
 * @param str
 */
function flattenStyle(str) {
    const array = str.split(';').filter(i => i);
    const obj = {};
    for (let k = 0; k < array.length; k++) {
        const str = array[k];
        const arr = str.split(':');
        if (arr.length < 2) {
            continue
        }
        const key = arr[0];
        const value = arr[1];
        if (!realBigThing[key]) continue
        let ans = handleValue(realBigThing[key].type, value);
        if (ans) {
            obj[realBigThing[key].name] = ans;
        }
    }
    return obj
}

function handleValue(type, value) {
    switch (type) {
        case RawValue: {
            return value
        }
        case AddPx: {
            return +value.substring(0, -2)
        }
        case AddPxORPercent: {
            if (value.endsWith("%")) {
                return +value.substring(0, value.length - 1)
            }
            return +value.substring(0, value.length - 2)
        }
        case ValObject: {
            const arr = value.split(' ').filter(i => i);
            if (arr.length === 2) {
                return {
                    width: +arr[0].substring(0, arr[0].length - 2),
                    height: +arr[1].substring(0, arr[1].length - 2)
                }
            }
            break
        }
        default: {
            //不支持
            return null
        }

    }
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


let firstEffect = null;
let lastEffect = null;

function unshiftEffect(effect) {
    if (!firstEffect) {
        lastEffect = firstEffect = effect;
        return
    }

    effect.nextEffect = firstEffect;
    firstEffect.preEffect = effect;
    firstEffect = effect;
}

function enqueueEffect(effect) {
    if (!firstEffect) {
        lastEffect = firstEffect = effect;
        return
    }

    lastEffect.nextEffect = effect;
    effect.preEffect = lastEffect;
    lastEffect = effect;
}

function resetEffect() {
    const effects = {
        lastEffect,
        firstEffect,
    };
    lastEffect = firstEffect = null;
    return effects
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * renderNextValidComps 过程的节点，其父_r 数据都是存在的，所以在样式没有变化的时候，不需要上报
 * @param inst
 */
function rnvcReportExistStyle(inst) {
    if (inst === mpRoot || inst.isPageComp) {
        // 页面组件不需要上报
        if (inst.styleEffect) {
            unshiftEffect({
                inst,

                tag: STYLE_EFFECT,
                data: inst.styleEffect
            });

            inst.styleEffect = undefined;
        }
        return
    }



    const styleKey = inst._styleKey;
    const styleValue = inst._r[styleKey];

    // 说明此组件是连锁上报的中间组件
    if (styleValue !== DEFAULTCONTAINERSTYLE) {
        inst._r[styleKey] = DEFAULTCONTAINERSTYLE;

        if (styleValue !== inst._myOutStyle) {

            if (inst._myOutStyle === false) {
                // 组件从 render null 改变为render element，将导致小程序节点的初始化
                unshiftEffect({
                    tag: STYLE_WXINIT_EFFECT,
                    inst
                });
            }


            inst._myOutStyle = styleValue;
            setDeepData(inst._p, styleValue, inst._outStyleKey);

            const styleEffect = (inst._p.styleEffect = inst._p.styleEffect || {});
            styleEffect[inst._outStyleKey] = styleValue;
        }

        // 连锁上报的中间组件不需要更新操作
        inst.styleEffect = undefined;
    }

    if (inst.styleEffect) {
        unshiftEffect({
            inst,

            tag: STYLE_EFFECT,
            data: inst.styleEffect
        });

        inst.styleEffect = undefined;
    }
}

/**
 * renderNextValidComps 过程的节点，其父_r 数据都是存在的，所以在样式没有变化的时候，不需要上报
 * @param inst
 * @param effect
 */
function rnvcReportStyle(inst, effect) {
    if (inst === mpRoot || inst.isPageComp) {
        // 页面组件不需要上报
        return
    }

    const styleKey = inst._styleKey;
    let styleValue;
    if (styleKey) {
        styleValue = inst._r[styleKey];
        inst._r[styleKey] = DEFAULTCONTAINERSTYLE;
    } else {
        styleValue = false;
    }

    if (styleValue !== inst._myOutStyle) {
        if (inst._myOutStyle === false) {
            // 组件从 render null 改变为render element，将导致小程序节点的初始化
            effect.hasMpInit = true;
        }

        inst._myOutStyle = styleValue;
        setDeepData(inst._p, styleValue, inst._outStyleKey);

        const styleEffect = (inst._p.styleEffect = inst._p.styleEffect || {});
        styleEffect[inst._outStyleKey] = styleValue;
    }
}

/**
 * render过程的节点，其父的_r 字段 已经清空，所以不管什么情况，都需要setDeepData
 *
 * @param inst
 */
function rReportExistStyle(inst) {
    if (inst === mpRoot || inst.isPageComp) {
        if (inst.styleEffect) {
            unshiftEffect({
                inst,

                tag: STYLE_EFFECT,
                data: inst.styleEffect
            });
            inst.styleEffect = undefined;
        }
        return
    }

    const styleKey = inst._styleKey;
    if (styleKey) {
        // 被child 上报影响
        if (inst._r[styleKey] !== DEFAULTCONTAINERSTYLE) {

            if (inst._r[styleKey] !== false && inst._myOutStyle === false) {
                // 组件从 render null 改变为render element，将导致小程序节点的初始化
                unshiftEffect({
                    tag: STYLE_WXINIT_EFFECT,
                    inst
                });
            }
            
            
            inst._myOutStyle = inst._r[styleKey];
            inst._r[styleKey] = DEFAULTCONTAINERSTYLE;

            // 被child 上报影响 说明此组件是连锁上报的中间组件，不需要更新操作
            inst.styleEffect = undefined;
        }
    } else {
        inst._myOutStyle = false;
    }

    setDeepData(inst._p, inst._myOutStyle, inst._outStyleKey);


    if (inst.styleEffect) {
        unshiftEffect({
            inst,

            tag: STYLE_EFFECT,
            data: inst.styleEffect
        });
        inst.styleEffect = undefined;
    }
}

/**
 * render过程的节点，其父的_r 字段 已经清空，所以不管什么情况，都需要setDeepData
 * @param inst
 * @param effect
 */
function rReportStyle(inst, effect) {
    if (inst === mpRoot || inst.isPageComp) {
        // 页面组件不需要上报
        return
    }

    const styleKey = inst._styleKey;
    if (styleKey) {
        if (inst._r[styleKey] !== false && inst._myOutStyle === false ) {
            // 组件从 render null 改变为render element，将导致小程序节点的初始化
            effect.hasMpInit = true;
        }


        inst._myOutStyle = inst._r[styleKey];
        inst._r[styleKey] = DEFAULTCONTAINERSTYLE;
    } else {
        inst._myOutStyle = false;
    }
    
    setDeepData(inst._p, inst._myOutStyle, inst._outStyleKey);
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function renderNextValidComps(inst) {
    if (inst.didSelfUpdate) {
        // setState / forceUpdate 的节点，将会被设置didSelfUpdate

        const {hasForceUpdate, nextState, callbacks} = processUpdateQueue(inst);

        // renderNextValidComps 方法里面的更新，props不会变化，props的变化的更新都属于render
        const shouldUpdate = checkShouldComponentUpdate(inst, hasForceUpdate, inst.props, nextState);

        shouldUpdate && inst.componentWillUpdate && inst.componentWillUpdate(inst.props, nextState);
        shouldUpdate && inst.UNSAFE_componentWillUpdate && inst.UNSAFE_componentWillUpdate(inst.props, nextState);

        inst.state = nextState;

        const effect = {};
        if (!shouldUpdate) {
            if (inst.didChildUpdate) {
                for(let i = 0; i < inst._c.length; i ++ ) {
                    const child = inst._c[i];
                    renderNextValidComps(child);
                }

                rnvcReportExistStyle(inst);
            }

            inst.didChildUpdate = false;
            inst.didSelfUpdate = false;
            return
        }
        effect.tag = UPDATE_EFFECT;
        effect.callbacks = callbacks;
        effect.inst = inst;
        enqueueEffect(effect);

        const oc = inst._c;
        resetInstProps(inst);


        const subVnode = inst.render();
        if (subVnode && subVnode.isReactElement) {
            subVnode.isFirstEle = true;

            inst._styleKey = `${subVnode.diuu}style`;
        } else {
            inst._styleKey = undefined;
        }

        const context = getCurrentContext(inst, inst._parentContext);
        render(subVnode, inst, context, inst._r, inst._or, '_r');

        getRealOc(oc, inst._c, oldChildren);

        rnvcReportStyle(inst, effect);

        inst.didChildUpdate = false;
        inst.didSelfUpdate = false;
    } else if (inst.didChildUpdate) {
        for(let i = 0; i < inst._c.length; i ++ ) {
            const child = inst._c[i];
            renderNextValidComps(child);
        }

        rnvcReportExistStyle(inst);

        inst.didChildUpdate = false;
        inst.didSelfUpdate = false;
    }
}

/**
 * 转化引擎的核心渲染函数， 负责把React结构渲染成中间态的数据和结构
 * @param vnode
 * @param parentInst
 * @param parentContext
 * @param data
 * @param oldData
 * @param dataPath
 */
function render(vnode, parentInst, parentContext, data, oldData, dataPath) {

    try {
        if (Array.isArray(vnode)) {
            console.warn('小程序暂不支持渲染数组！');
            return
        }

        if (typeof vnode === 'string'
            || typeof vnode === 'number'
            || typeof vnode === 'boolean'
            || vnode === null
            || vnode === undefined
            || vnode === 'slot'
        ) {
            return
        }

        const {ref, nodeName, tempName} = vnode;

        if (typeof ref === "string") {
            console.warn('ref 暂时只支持函数形式!');
        }

        if (data && tempName) {
            data.tempName = tempName;
        }

        if (nodeName === 'view' || nodeName === 'block' || nodeName === 'image') {
            updateBaseView(vnode, parentInst, parentContext, data, oldData, dataPath);
        } else if (nodeName === 'template') {
            updateTemplate(vnode, parentInst, parentContext, data, oldData, dataPath);
        } else if (nodeName === 'phblock') {
            updatePhblock(vnode, parentInst, parentContext, data, oldData, dataPath);
        } else if (typeof nodeName === 'string' && nodeName.endsWith('CPT')) {
            updateCPTComponent(vnode, parentInst, parentContext, data, oldData, dataPath);
        } else if (nodeName.prototype && Object.getPrototypeOf(nodeName) === FuncComponent) {
            updateFuncComponent(vnode, parentInst, parentContext, data, oldData, dataPath);
        } else if (nodeName.prototype && Object.getPrototypeOf(nodeName) === RNBaseComponent) {
            updateRNBaseComponent(vnode, parentInst, parentContext, data, oldData, dataPath);
        } else if (typeof nodeName === 'function') {
            updateClassComponent(vnode, parentInst, parentContext, data, oldData, dataPath);
        }
    } catch (e) {
        console.error(e);
    }
}

/**
 * 事件回调/组件生命周期 出现的更新（setState）需要合并
 * @param func
 * @returns {function(...[*]=): *}
 */
function reactEnvWrapper(func) {
    return function(...args) {
        unstable_batchedUpdates(() => {
            func.apply(this, args);
        });
    }
}

function getDiuuAndShouldReuse(vnode, oldData) {
    const { key, nodeName, isTempMap } = vnode;

    const diuuKey = vnode.diuu;
    if (!oldData) {
        return {
            diuu: '',
            diuuKey,
            shouldReuse: false
        }
    }

    let diuu = null;
    let shouldReuse = false;

    // 如果是map 返回的最外层元素， 需要判断是否可以复用。
    // 由于key的存在， 可能出现diuu获取的实例并非nodeName类型的情况
    if (key !== undefined && oldData && isTempMap) {
        const od = oldData.diuu;
        diuu = oldData[od];

        const inst = instanceManager.getCompInstByUUID(diuu);

        if (!diuu) {
            // TODO 考虑phblock的情况， 这种情况需要把FlatList等key，赋值给phblock
            shouldReuse = false;
        } else if (!inst && (nodeName === 'view' || nodeName === 'block' || nodeName === 'image')) {
            // 前后都是view/image/blcok
            shouldReuse = true;
        } else if (inst && inst instanceof CPTComponent && typeof nodeName === 'string' && nodeName.endsWith('CPT')) {
            // 前后都是cpt
            shouldReuse = true;
        } else if (inst && typeof nodeName === 'function' && inst instanceof nodeName) {
            shouldReuse = true;
        }
    }

    // TODO <A/> 是否考虑A是变量的情况， 如果考虑 这里也应该判断类型
    if (!isTempMap && oldData) {
        diuu = oldData[diuuKey];
        shouldReuse = !!diuu;
    }

    return {
        diuu,
        diuuKey,
        shouldReuse
    }
}

function getKeyDataMap(arr, key) {
    const r = {};
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        const fkey = (item[key] === undefined ? `index_${i}` :  item[key]);
        r[fkey] = item;
    }
    return r
}


function shouldReuseButInstNull(vnode) {
    console.warn('未知原因导致React 实例丢失， please create an issue! 错误节点：', vnode);
}

function sovleNumberOfLines (newVal){
    if (newVal == null) { return ""}

    return "overflow:hidden;display: -webkit-box;;text-overflow:ellipsis;-webkit-line-clamp:"+newVal+";-webkit-box-orient: vertical; word-wrap:break-word;"
}


function resizeMode(newVal){
    if(newVal === 'cover'){
        return 'aspectFill';
    } else if (newVal === 'contain'){
        return 'aspectFit';
    } else if (newVal === 'stretch'){
        return 'scaleToFill';
    } else if (newVal === 'repeat') {
        console.warn('Image的resizeMode属性小程序端不支持repeat');
        return 'aspectFill'
    } else if (newVal === 'center') {
        return 'aspectFill'
    } else{
        return 'aspectFill';
    }
}


function activeOpacityHandler(v) {
    const opa = Math.round(v * 10);
    return `touchableOpacity${opa}`
}


function processUpdateQueue(inst) {
    if (!inst.updateQueue || inst.updateQueue.length === 0) {
        return {
            hasForceUpdate: false,
            nextState: inst.state,
            callbacks: undefined
        }
    }

    let hasForceUpdate = false;
    const callbacks = [];
    const preState = Object.assign({}, inst.state);
    let hasStateChange = false;
    for(let i = 0; i < inst.updateQueue.length; i ++ ) {
        const update = inst.updateQueue[i];

        if (update.tag === UpdateState) {
            const payload = update.payload;
            if (typeof payload === 'function') {
                const partState = payload.call(inst, preState);
                Object.assign(preState, partState);
            }

            if (typeof payload === 'object') {
                Object.assign(preState, payload);
            }

            hasStateChange = true;
        } else if (update.tag === ForceUpdate) {
            hasForceUpdate = true;
        }

        if (update.callback && typeof update.callback === 'function') {
            callbacks.push(update.callback);
        }
    }

    inst.updateQueue = [];

    return {
        hasForceUpdate,
        callbacks: callbacks.length > 0 ? callbacks : undefined,
        nextState: hasStateChange ? preState : inst.state
    }
}

function checkShouldComponentUpdate(inst, hasForceUpdate, nextProps, nextState) {
    let shouldUpdate;
    if (hasForceUpdate) {
        shouldUpdate = true;
    } else if (inst.shouldComponentUpdate) {
        shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState);
    } else {
        shouldUpdate = true;
    }

    return shouldUpdate
}

// 某些实例属性的重置
function resetInstProps(inst) {
    inst._or = inst._r;

    // ui des
    inst._r = {};

    // children 重置， render过程的时候重新初始化， 因为children的顺序关系着渲染的顺序， 所以这里应该需要每次render都重置
    inst._c = [];

    // text /button 等基本组件 事件回调存放在 __eventHanderMap字段
    inst.__eventHanderMap = {};
}

/**
 * 函数组件，有context， 没有生命周期， 没有setState
 */
function updateFuncComponent(vnode, parentInst, parentContext, data, oldData, dataPath) {
    const {animation, nodeName, props, diuu: vnodeDiuu} = vnode;

    let {diuu, diuuKey, shouldReuse} = getDiuuAndShouldReuse(vnode, oldData);
    let inst = null;

    const effect = {};
    if (shouldReuse) {
        // 复用组件实例
        inst = instanceManager.getCompInstByUUID(diuu);
        if (!inst) {
            shouldReuseButInstNull(vnode);
            return
        }

        data[diuuKey] = diuu;

        inst.props = props;
        inst.context = filterContext(nodeName, parentContext);

        parentInst._c.push(inst);

        effect.tag = UPDATE_EFFECT;
        effect.inst = inst;
        enqueueEffect(effect);
    } else {
        const myContext = filterContext(nodeName, parentContext);
        inst = new nodeName(props, myContext);

        let instUUID;
        if (parentInst === mpRoot) {
            instUUID = vnodeDiuu;
            inst.isPageComp = true;
        } else {
            instUUID = geneUUID();
            data[diuuKey] = instUUID;
        }

        inst.__diuu__ = instUUID;

        parentInst._c.push(inst);
        inst._p = parentInst; // parent

        if (parentInst instanceof HocComponent) {
            inst.hocWrapped = true;
            // 防止样式上报到HOC
            if (parentInst.isPageComp) {
                inst.isPageComp = true;
            }
        }


        instanceManager.setCompInst(instUUID, inst);

        effect.tag = INIT_EFFECT;
        effect.inst = inst;
        enqueueEffect(effect);
    }


    const oc = inst._c;
    resetInstProps(inst);

    const subVnode = inst.render();
    if (subVnode && subVnode.isReactElement) {
        subVnode.isFirstEle = true;

        inst._styleKey = `${subVnode.diuu}style`;
    } else {
        inst._styleKey = undefined;
    }
    // 当组件往外层上报样式的时候，通过keyPath 确定数据路径
    inst._outStyleKey = `${dataPath}.${vnodeDiuu}style`;

    const context = getCurrentContext(inst, parentContext);
    render(subVnode, inst, context, inst._r, inst._or, '_r');

    getRealOc(oc, inst._c, oldChildren);

    // 动画相关
    if (animation) {
        data[`${vnodeDiuu}animation`] = animation;
    }

    rReportStyle(inst, effect);

    inst.didChildUpdate = false;
    inst.didSelfUpdate = false;
}

/**
 * 抽象组件节点， 处理属性是xxComponent/children的情况
 */
function updateCPTComponent(vnode, parentInst, parentContext, data, oldData, dataPath) {
    const {CPTVnode: subVnode, diuu: vnodeDiuu} = vnode;
    let {diuu, diuuKey, shouldReuse} = getDiuuAndShouldReuse(vnode, oldData);

    const effect = {};
    let inst = null;
    if (shouldReuse) {
        inst = instanceManager.getCompInstByUUID(diuu);
        if (!inst) {
            shouldReuseButInstNull(vnode);
            return
        }

        parentInst._c.push(inst);
        effect.tag = UPDATE_EFFECT;
        effect.inst = inst;
        enqueueEffect(effect);
    } else {
        inst = new CPTComponent();

        diuu = geneUUID();
        inst.__diuu__ = diuu;

        parentInst._c.push(inst);
        inst._p = parentInst;


        instanceManager.setCompInst(diuu, inst);

        effect.tag = INIT_EFFECT;
        effect.inst = inst;
        enqueueEffect(effect);
    }
    data[diuuKey] = diuu;

    const oc = inst._c;
    resetInstProps(inst);

    if (subVnode && subVnode.isReactElement) {
        subVnode.isFirstEle = true;

        inst._styleKey = `${subVnode.diuu}style`;
    } else {
        inst._styleKey = undefined;
    }
    // 当组件往外层上报样式的时候，通过keyPath 确定数据路径
    inst._outStyleKey = `${dataPath}.${vnodeDiuu}style`;

    render(subVnode, inst, parentContext, inst._r, inst._or, '_r');

    getRealOc(oc, inst._c, oldChildren);

    rReportStyle(inst, effect);
    inst.didChildUpdate = false;
    inst.didSelfUpdate = false;
}

/**
 * //TODO RN base 是否需要实例？？
 * RN base 组件的渲染，RN base组件的渲染逻辑提前已知，可以预先对应好，出于两方面的考虑
 * 1. 预先对应好 对base组件 有更强的控制能力
 * 2. 由于现在的数据交换方式， 预先对应可以节省一次setData数据交换。
 * RN base 是预先对应好数据的，不产生effect
 */
function updateRNBaseComponent(vnode, parentInst, parentContext, data, oldData, dataPath) {
    const {nodeName, props, animation, ref, diuu: vnodeDiuu, children} = vnode;
    let {diuu, diuuKey, shouldReuse} = getDiuuAndShouldReuse(vnode, oldData);

    let inst = null;
    if (shouldReuse) {
        inst = instanceManager.getCompInstByUUID(diuu);

        if (!inst) {
            shouldReuseButInstNull(vnode);
            return
        }

        inst.props = {};
    } else {
        inst = new nodeName();
        inst.props = {};
        diuu = geneUUID();
        inst.__diuu__ = diuu;
        instanceManager.setCompInst(diuu, inst);
    }

    // 设置uuid绑定
    data[diuuKey] = diuu;

    const allKeys = Object.keys(props);
    for (let i = 0; i < allKeys.length; i++) {
        const k = allKeys[i];
        const v = props[k];

        if (k === 'children') continue

        // nodeName === WXScrollView
        if (k === 'refreshControl') {
            const {refreshing = false, onRefresh} = v.props;

            data[`${diuuKey}refreshing`] = refreshing;

            if (onRefresh) {
                data[`${diuuKey}onRefreshPassed`] = true;
                inst.props.onRefresh = reactEnvWrapper(onRefresh);
            } else {
                data[`${diuuKey}onRefreshPassed`] = false;
            }
        } else if (typeof v === 'function') {
            inst.props[k] = reactEnvWrapper(v);
        } else {
            //避免小程序因为setData undefined报错
            data[`${diuuKey}${k}`] = v === undefined ? null : v;
        }
    }


    if (typeof inst.getStyle === 'function') {
        const styleObj = inst.getStyle(props);
        for(let k in styleObj) {
            data[`${diuuKey}${k}`] = styleObj[k];
        }
    } else {
        console.warn('基本组件必须提供getStyle方法！');
    }

    if (props.numberOfLines) {
        data[`${diuuKey}style`] = data[`${diuuKey}style`] + sovleNumberOfLines(props.numberOfLines);
    }

    if (typeof ref === 'function') {
        ref(inst);
        inst._ref = ref;
    }
    // 动画相关
    if (animation) {
        data[`${vnodeDiuu}animation`] = animation;
    }

    for (let i = 0; i < children.length; i++) {
        const subVnode = children[i];
        render(subVnode, parentInst, parentContext, data, oldData, dataPath);
    }
}

function updateClassComponent(vnode, parentInst, parentContext, data, oldData, dataPath) {
    const {animation, ref, nodeName, props, diuu: vnodeDiuu} = vnode;
    let inst = null;

    let {diuu, diuuKey, shouldReuse} = getDiuuAndShouldReuse(vnode, oldData);

    const effect = {};
    if (shouldReuse) {
        // 复用组件实例
        inst = instanceManager.getCompInstByUUID(diuu);

        if (!inst) {
            shouldReuseButInstNull(vnode);
            return
        }

        data[diuuKey] = diuu;

        // render里面的实例，一定存在来自父的更新，所以componentWillReceiveProps一定执行
        inst.componentWillReceiveProps && inst.componentWillReceiveProps(props);
        inst.UNSAFE_componentWillReceiveProps && inst.UNSAFE_componentWillReceiveProps(props);


        const {hasForceUpdate, nextState, callbacks} = processUpdateQueue(inst);
        const shouldUpdate = checkShouldComponentUpdate(inst, hasForceUpdate, props, nextState);

        shouldUpdate && inst.componentWillUpdate && inst.componentWillUpdate(props, nextState);
        shouldUpdate && inst.UNSAFE_componentWillUpdate && inst.UNSAFE_componentWillUpdate(props, nextState);

        inst.props = props;
        inst.context = filterContext(nodeName, parentContext);
        inst.state = nextState;
        parentInst._c.push(inst);


        if (!shouldUpdate) {
            if (inst.didChildUpdate) {
                for(let i = 0; i < inst._c.length; i ++ ) {
                    const child = inst._c[i];
                    renderNextValidComps(child);
                }

            }

            rReportExistStyle(inst);
            inst.didChildUpdate = false;
            inst.didSelfUpdate = false;
            return
        }

        effect.tag = UPDATE_EFFECT;
        effect.inst = inst;
        effect.callbacks = callbacks;
        enqueueEffect(effect);
    } else {
        const myContext = filterContext(nodeName, parentContext);
        inst = new nodeName(props, myContext);
        if (!inst.props) {
            inst.props = props;
        }
        if (!inst.context) {
            inst.context = myContext;
        }

        inst.componentWillMount && inst.componentWillMount();
        inst.UNSAFE_componentWillMount && inst.UNSAFE_componentWillMount();

        // 页面组件 是由页面 onLoad 方法计算的
        let instUUID = null;
        if (parentInst === mpRoot) {
            instUUID = vnodeDiuu;
            inst.isPageComp = true;
        } else {
            instUUID = geneUUID();
            data[diuuKey] = instUUID;
        }

        inst.__diuu__ = instUUID;


        parentInst._c.push(inst);
        inst._p = parentInst; // parent

        if (parentInst instanceof HocComponent) {
            inst.hocWrapped = true;
            // 防止样式上报到HOC
            if (parentInst.isPageComp) {
                inst.isPageComp = true;
            }
        }

        instanceManager.setCompInst(instUUID, inst);

        effect.tag = INIT_EFFECT;
        effect.inst = inst;
        enqueueEffect(effect);
    }


    const oc = inst._c;
    resetInstProps(inst);

    const subVnode = inst.render();
    if (subVnode && subVnode.isReactElement) {
        subVnode.isFirstEle = true;

        inst._styleKey = `${subVnode.diuu}style`;
    } else {
        inst._styleKey = undefined;
    }
    // 当组件往外层上报样式的时候，通过keyPath 确定数据路径
    inst._outStyleKey = `${dataPath}.${vnodeDiuu}style`;
    // 记录一下_parentContext，当组件setState的时候会使用到
    inst._parentContext = parentContext;
    const context = getCurrentContext(inst, parentContext);
    render(subVnode, inst, context, inst._r, inst._or, '_r');

    getRealOc(oc, inst._c, oldChildren);

    if (typeof ref === 'function') {
        ref(inst);
        inst._ref = ref;
    }
    // 动画相关
    if (animation) {
        data[`${vnodeDiuu}animation`] = animation;
    }

    rReportStyle(inst, effect);

    inst.didChildUpdate = false;
    inst.didSelfUpdate = false;
}

/**
 * 动态JSX 对应template，运行过程收集数据到data对象， 不产生effect
 */
function updateTemplate(vnode, parentInst, parentContext, data, oldData, dataPath) {
    const {tempVnode, datakey} = vnode;
    if (typeof tempVnode === 'boolean'
        || tempVnode === undefined
        || tempVnode === null
    ) {
        // do nothing
        data[datakey] = '';
    } else if (typeof tempVnode === 'string'
        || typeof tempVnode === 'number'
    ) {
        // 不是jsx的情况
        data[datakey] = tempVnode;
    } else if (Array.isArray(tempVnode)) {
        // key必须明确指定，对于不知道key的情况， React和小程序处理可能存在差异，造成两个平台的行为差异

        let oldSubDataKeyMap = {};
        if (oldData && oldData[datakey] && Array.isArray(oldData[datakey])) {
            const oldSubDataList = oldData[datakey];
            oldSubDataKeyMap = getKeyDataMap(oldSubDataList, 'key');
        }

        const subDataList = [];
        data[datakey] = subDataList;
        for (let i = 0; i < tempVnode.length; i++) {
            const subVnode = tempVnode[i];

            if (subVnode === null || subVnode === undefined || typeof subVnode === 'boolean') {
                continue
            }

            if (typeof subVnode === 'string'
                || typeof subVnode === 'number'
            ) {
                data[datakey].push(subVnode);
                continue
            }


            if (typeof subVnode === 'object') {
                subVnode.isTempMap = true;
            }

            let subKey = subVnode.key;
            if (subKey === undefined) {
                console.warn('JSX数组，需要明确指定key！否则行为会有潜在的差异');
                subKey = subVnode.key = `index_${i}`;
            }


            const subData = {
                key: subKey,
                diuu: subVnode.diuu  // 用来判断复用逻辑
            };
            data[datakey].push(subData);

            // 假设 Ua 对应的key为 Ka， Ub对应的key为 Kb。
            // 当Ua的key由Ka --> Kb 的时候， 那么组件变为Ub负责来渲染这一块， 故而需要给予Ub对应的数据
            // 对于明确且唯一的key，  小程序和React处理是一致的
            const vIndex = data[datakey].length - 1;
            render(subVnode, parentInst, parentContext, subData, oldSubDataKeyMap[subKey], `${dataPath}.${datakey}[${vIndex}]`);
        }
    } else {
        let oldSubData = null;
        if (oldData && oldData[datakey] && oldData[datakey].tempName) {
            oldSubData = oldData[datakey];
        }

        const subData = {};
        data[datakey] = subData;

        render(tempVnode, parentInst, parentContext, subData, oldSubData, `${dataPath}.${datakey}`);
    }
}


/**
 * 由于小程序slot的性能问题， 把View/Touchablexxx/Image 等退化为view来避免使用slot。
 * 对于自定义组件，如果render的最外层是View， 这个View会退化成block。
 * 运行过程收集数据到data对象， 不产生effect
 */
function updateBaseView(vnode, parentInst, parentContext, data, oldData, dataPath) {
    // isFirstEle 表示这个 vnode是否是render的第一个节点，对于第一个节点由于样式需要上报给外层，在计算样式的时候需要特殊处理
    // TODO TWFBStylePath 作用同 isFirstEle， 考虑将其 移除到自定义实现， 它不应该侵犯render函数
    const {animation, props, diuu: vnodeDiuu, isFirstEle, children} = vnode;
    const allKeys = Object.keys(props);
    let finalNodeType = props.original;

    let eventProps = [];
    for (let i = 0; i < allKeys.length; i++) {
        const k = allKeys[i];
        const v = props[k];

        if (k === 'children' || k === 'original') continue

        if (k === 'src') {
            data[`${vnodeDiuu}${k}`] = v.uri || v;
        } else if (typeof v === 'function') {
            eventProps.push(k);
        } else if (k === 'mode') {
            data[`${vnodeDiuu}${k}`] = resizeMode(v);
        } else if (k === 'style' && finalNodeType !== 'TouchableWithoutFeedback') {
            data[`${vnodeDiuu}${k}`] = tackleWithStyleObj(v, (isFirstEle || vnode.TWFBStylePath) ? finalNodeType : null);
        } else if (k === 'activeOpacity') {
            data[`${vnodeDiuu}hoverClass`] = activeOpacityHandler(v);
        } else {
            data[`${vnodeDiuu}${k}`] = v;
        }
    }

    // 如果基本组件有事件函数，需要产生唯一uuid
    if (eventProps.length > 0) {
        let {diuu, diuuKey, shouldReuse} = getDiuuAndShouldReuse(vnode, oldData);
        if (!shouldReuse) {
            diuu = geneUUID();
        }
        data[diuuKey] = diuu;

        eventProps.forEach(k => {
            const v = props[k];
            parentInst.__eventHanderMap[`${diuu}${ReactWxEventMap[k]}`] = reactEnvWrapper(v);
        });
    }

    if (!props.style && finalNodeType !== 'TouchableWithoutFeedback' && (isFirstEle || vnode.TWFBStylePath)) {
        data[`${vnodeDiuu}style`] = tackleWithStyleObj('', finalNodeType);
    }

    if (props.activeOpacity === undefined && finalNodeType === 'TouchableOpacity') {
        data[`${vnodeDiuu}hoverClass`] = activeOpacityHandler(0.2);
    }
    if (props.activeOpacity === undefined && finalNodeType === 'TouchableHighlight') {
        data[`${vnodeDiuu}hoverClass`] = activeOpacityHandler(1);
    }

    if (props.numberOfLines !== undefined) {
        data[`${vnodeDiuu}style`] = (data[`${vnodeDiuu}style`] || '') + sovleNumberOfLines(props.numberOfLines);
    }


    // 动画相关
    if (animation) {
        data[`${vnodeDiuu}animation`] = animation;
    }


    if (props.original === 'TouchableWithoutFeedback'
        || props.original === 'TouchableHighlight'
    ) {
        if (children.length !== 1) {
            console.warn(props.original,  '必须有且只有一个子元素');
        }
    }

    if (props.original === 'TouchableWithoutFeedback') {
        children[0].TWFBStylePath = `${dataPath}.${vnodeDiuu}style`;
    }

    for (let i = 0; i < children.length; i++) {
        const childVnode = children[i];
        render(childVnode, parentInst, parentContext, data, oldData, dataPath);
    }


    // TouchableWithoutFeedback本身不接样式，对外表现是唯一子节点的样式
    if (props.original === 'TouchableWithoutFeedback') {
        const outStyleKey = `${vnodeDiuu}style`;

        const firstChildNode = children[0];
        if (firstChildNode.datakey) {
            const childDiuu = firstChildNode.tempVnode.diuu;
            const childStyle = data[firstChildNode.datakey].v[`${childDiuu}style`];
            data[outStyleKey] = childStyle;
            data[firstChildNode.datakey].v[`${childDiuu}style`] = DEFAULTCONTAINERSTYLE;
        } else {
            const childDiuu = firstChildNode.diuu;
            const childStyle = data[`${childDiuu}style`];
            data[outStyleKey] = childStyle;
            data[`${childDiuu}style`] = DEFAULTCONTAINERSTYLE;
        }
    }
}


/**
 * //TODO 有存在的必要？？
 * 用于FlatList等外层， 用来占位
 */
function updatePhblock(vnode, parentInst, parentContext, data, oldData, dataPath) {
    const {props, children} = vnode;
    const allKeys = Object.keys(props);
    for (let i = 0; i < allKeys.length; i++) {
        const k = allKeys[i];
        const v = props[k];

        if (k === 'children') continue
        data[k] = v;
    }

    for (let i = 0; i < children.length; i++) {
        const childVnode = children[i];
        render(childVnode, parentInst, parentContext, data, oldData, dataPath);
    }
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function hasMoreKeys(okeys, nkeys) {
    const nkeysSet = new Set(nkeys);

    return okeys.some(key => !nkeysSet.has(key))
}

function getObjectPathInner(v, prefix, result) {
    const tv = typeof v;

    if (Array.isArray(v)) {
        // 空数组
        if (v.length === 0) {
            result[prefix] = v;
            return
        }

        for (let i = 0; i < v.length; i++) {
            const vele = v[i];
            getObjectPathInner(vele, `${prefix}[${i}]`, result);
        }

    } else if (tv === 'object' && v !== null) {
        const keys = Object.keys(v);

        // 空对象
        if (keys.length === 0) {
            result[prefix] = v;
            return
        }


        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            const vele = v[k];

            getObjectPathInner(vele, `${prefix}.${k}`, result);
        }
    } else {
        result[prefix] = v;
    }
}

function getChangePathInner(newR, oldR, prefix, result) {
    if (newR === oldR) return


    const tn = typeof newR;
    const to = typeof oldR;
    if (tn !== to
        || oldR === null
        || oldR === undefined
    ) {
        getObjectPathInner(newR, prefix, result);
    } else if (Array.isArray(newR)) {
        // 由于小程序 setData 设置为 undefined 会出问题。 所以这种情况直接设置对象
        if (newR.length < oldR.length) {
            result[prefix] = newR;
            return
        }

        for (let i = 0; i < newR.length; i++) {
            const v = newR[i];
            const ov = oldR[i];
            getChangePathInner(v, ov, `${prefix}[${i}]`, result);
        }
    } else if (tn === 'object' && tn !== null) {
        if (newR.__isAnimation__) {
            result[prefix] = newR;
            return
        }


        const nkeys = Object.keys(newR);
        const okeys = Object.keys(oldR);

        // 由于小程序 setData 设置为 undefined 会出问题。 所以这种情况直接设置对象
        // TODO 这种情况下， 是否依然可以减少数据的传递呢？？
        if (hasMoreKeys(okeys, nkeys)) {
            result[prefix] = newR;
            return
        }

        for (let i = 0; i < nkeys.length; i++) {
            const k = nkeys[i];
            const v = newR[k];
            const ov = oldR[k];
            getChangePathInner(v, ov, `${prefix}.${k}`, result);
        }
    } else {
        result[prefix] = newR;
    }
}


/**
 * 获取小程序更新的数据路径
 * @param newRender
 * @param oldRender
 */
function getChangePath(newRender, oldRender) {
    const result = {};

    getChangePathInner(newRender, oldRender, '_r', result);

    return result
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

let inRenderPhase = false;
let shouldMerge = false;

let oldChildren = [];

function performUpdater(inst, updater) {
    inst.updateQueue.push(updater);

    setUpdateTagToRoot(inst);
    updateRoot();
}


function unstable_batchedUpdates(func) {
    if (shouldMerge) {
        // 如果 shouldMerge 为true 直接执行，防止嵌套调用的情况
        func();
        return
    }

    shouldMerge = true;
    func();
    shouldMerge = false;

    updateRoot();
}

function setUpdateTagToRoot(inst) {
    inst.didSelfUpdate = true;

    let p = inst._p;
    while(p && !p.didChildUpdate) {
        p.didChildUpdate = true;
        p = p._p;
    }
}

function updateRoot() {
    if (shouldMerge) {
        return
    }

    if (inRenderPhase) {
        return
    }

    inRenderPhase = true;
    renderNextValidComps(mpRoot);
    inRenderPhase = false;

    invokeWillUnmount(oldChildren);
    oldChildren = [];

    const {firstEffect, lastEffect}  = resetEffect();
    commitWork(firstEffect, lastEffect);
}

function renderPage(pageVode, mpPageInst) {
    inRenderPhase = true;
    render(
        pageVode,
        mpRoot,
        mpRoot.childContext,
        null,
        null,
        null,
    );
    inRenderPhase = false;

    instanceManager.setWxCompInst(mpPageInst.data.diuu, mpPageInst);

    const {firstEffect, lastEffect}  = resetEffect();
    commitWork(firstEffect, lastEffect);
}

// render 一次入口路由组件，获取childContext等
function renderApp(appClass) {
    render(
        createElement(appClass, {
            diuu: "fakeUUID"
        }),
        mpRoot,
        {},
        {},
        null,
        null,
    );

    // 处理Provider 提供context的情况
    const {lastEffect}  = resetEffect();
    const lastInst = lastEffect.inst;

    const childContext = getCurrentContext(lastInst, lastInst._parentContext);
    Object.assign(mpRoot.childContext, childContext);
    mpRoot._c = [];
}

/**
 * 1. 负责把数据刷给小程序
 * 2. 负责小程序渲染完成之后，执行渲染回调
 * 注意：不能直接使用 effect模块的firstEffect字段，因为在小程序渲染回调回来之前，可能发生其他的render，修改了effect.js模块的firstEffect
 *
 * @param firstEffect
 * @param lastEffect
 */
function commitWork(firstEffect, lastEffect) {
    if (!firstEffect) {
        // 没有产生任何更新
        return
    }

    const currentPage = getMpCurrentPage();

    /**
     * 出于对性能的考虑，我们希望react层和小程序层数据交互次数能够近可能的少。自小程序2.4.0版本提供groupSetData之后，小程序提供了
     * 批量设置数据的功能。现在我们可以通过类似如下的代码来批量的设置小程序数据
     *    father.groupSetData(() => {
     *          son1.setData(uiDes1)
     *          son2.setData(uiDes2)
     *          son3.setData(uiDes3)
     *    })
     * 也就是说在更新的时候，我们利用groupSetData 可以做到本质上只交互一次。
     */
    currentPage.groupSetData(() => {
        let effect = firstEffect;
        while (effect) {
            const {tag, inst} = effect;

            // 页面组件需要特殊处理
            if (inst.isPageComp && inst instanceof HocComponent && Object.keys(inst._r).length === 0) {
                // 这里不直接使用currentPage 的原因是 有可能在currentPage 是设置的是其他页面的组件
                const thisPage = inst.getWxInst();
                thisPage.setData({_r: {}});
                effect = effect.nextEffect;
                continue
            }

            /**
             * 1. HOC节点不对应小程序节点，不需要传递数据
             * 2. myOutStyle 为false的节点，不产生小程序节点，不需要传递数据
             */
            if (inst instanceof HocComponent || inst._myOutStyle === false) {
                effect = effect.nextEffect;
                continue
            }

            if (tag === STYLE_EFFECT) {
                const wxInst = inst.getWxInst();
                wxInst.setData(effect.data);
            }

            if (tag === STYLE_WXINIT_EFFECT) {
                const wxInst = inst.getWxInst();
                wxInst.setData({
                    _r: inst._r
                });
            }


            if (tag === INIT_EFFECT) {
                const wxInst = inst.getWxInst();
                wxInst.setData({
                    _r: inst._r
                });
            }

            if (tag === UPDATE_EFFECT) {
                const wxInst = inst.getWxInst();

                if (effect.hasMpInit) {
                    wxInst.setData({
                        _r: inst._r
                    });
                } else {
                    // getChangePath 在这里调用，而不是在render的过程调用，是考虑以后 render 采用fiber以后存在反复render的情况
                    const cp = getChangePath(inst._r, inst._or);
                    if (Object.keys(cp).length !== 0) {
                        wxInst.setData(cp);
                    }
                }
                // _or 不再有用
                inst._or = null;
            }

            effect = effect.nextEffect;
        }

        currentPage.setData({}, () => {
            unstable_batchedUpdates(() => {
                commitLifeCycles(lastEffect);
            });
        });
    });
}

function getMpCurrentPage() {
    const pages = getCurrentPages();
    return pages[pages.length - 1]
}


function commitLifeCycles(lastEffect) {
    let effect = lastEffect;
    while (effect) {
        const {tag, inst} = effect;

        // 如果 tag === STYLE_** , do nothing

        if (tag === INIT_EFFECT) {
            inst.componentDidMount && inst.componentDidMount();
        }


        if (tag === UPDATE_EFFECT) {
            inst.componentDidUpdate && inst.componentDidUpdate();

            if (effect.callbacks) {
                effect.callbacks.forEach(cb => {
                    cb && cb();
                });
            }
        }

        effect = effect.preEffect;
    }
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


class BaseComponent {

    getWxInst() {
        let diuu = null;

        if (this.hocWrapped) {
            let p = this._p;
            while (p.hocWrapped) {
                p = p._p;
            }

            diuu = p.__diuu__;
        } else {
            diuu = this.__diuu__;
        }

        return instanceManager.getWxInstByUUID(diuu)
    }
}

class CPTComponent extends BaseComponent {
}

class FuncComponent extends BaseComponent {
    constructor(props, context) {
        super();
        this.props = props;
        this.context = context;
    }
}

class Component extends BaseComponent {
    constructor(props, context) {
        super();
        this.props = props;
        this.context = context;

        this.updateQueue = [];
    }

    forceUpdate(callback) {
        performUpdater(this, {
            tag: ForceUpdate,
            callback,
        });
    }

    setState(newState, callback) {
        performUpdater(this, {
            tag: UpdateState,

            payload: newState,
            callback: callback,
        });
    }
}

class PureComponent extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(shallowEqual(nextProps, this.props) && shallowEqual(nextState, this.state))
    }
}

/***
 * 由于alita默认处理的情况是 一个React组件 对应一个微信小程序组件。
 * Hoc的情况，会出现多个 React组件 对应一个微信小程序组件， 比如Hoc1(Hoc2(A)) 。HOC现阶段的处理如下：
 *
 *     Hoc1 -> Hoc2 -> A
 *      ↓             /
 *      ↓            /
 *      ↓           /
 *   实例对应       /
 *      ↓         /
 *      ↓        /
 *      ↓   wxA 渲染的数据
 *      ↓      /
 *      ↓     /
 *      ↓    /
 *      ↓   /
 *      ↓  /
 *      wxA
 *
 *  Hoc1的uuid 和wxA属性接收到的uuid 是一致的，所以在实例管理器中 Hoc1 和wxA是一对，但是Hoc1包裹Hoc2包裹A在运行结束时产生的uiDes 数据
 *  才是最终决定 wxA渲染的。
 */
class HocComponent extends Component {
    constructor(props, context) {
        super(props, context);

        this.hocProps = {
            diuu: HOCKEY
        };

    }
}

class RNBaseComponent {
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


function WxNormalComp (CompMySelf, RNApp) {

    const o = {
        properties: {
            diuu: null,
        },

        attached() {
            // 页面组件 这个时候diuu 还未准备好
            this.data.diuu && instanceManager.setWxCompInst(this.data.diuu, this);
        },


        detached() {
            // 防止泄漏，当自定义组件render 返回null的时候，React组件存在，小程序组件应该销毁
            instanceManager.removeWxInst(this.data.diuu);
        },

        methods: {
            // 基本组件回调函数处理
            eventHandler(e) {
                const eventKey = e.currentTarget.dataset.diuu + e.type;
                let compInst = instanceManager.getCompInstByUUID(this.data.diuu);
                while (compInst && compInst instanceof HocComponent) {
                    compInst = compInst._c[0];
                }
                const eh = compInst.__eventHanderMap[eventKey];

                if (eh) {
                    //TODO event参数
                    eh();
                }
            }
        }
    };

    // 可能是页面组件，需要加入相关生命周期
    if (CompMySelf && RNApp) {
        o.methods.onLoad = function (query) {
            const paramStr = query.params;
            let paramsObj = {};
            if (paramStr) {
                paramsObj = JSON.parse(decodeURIComponent(paramStr));
            }

            const uuid = geneUUID();
            this.data.diuu = uuid;

            renderPage(
                createElement(
                    CompMySelf,
                    {
                        routerParams: paramsObj,
                        diuu: uuid
                    },
                ),
                this
            );

            const compInst = instanceManager.getCompInstByUUID(this.data.diuu);
            //如果组件还未初始化 didFocus方法，保证执行顺序为： didMount --> didFocus
            if (compInst.componentDidFocus) {
                const focusFunc = compInst.componentDidFocus;
                const didMountFunc = compInst.componentDidMount;

                compInst.componentDidFocus = undefined;
                compInst.componentDidMount = function () {
                    didMountFunc && didMountFunc.call(compInst);
                    focusFunc.call(compInst);
                    compInst.componentDidFocus = focusFunc;
                    compInst.componentDidMount = didMountFunc;
                };

            }
        };

        o.methods.onShow = function () {
            const compInst = instanceManager.getCompInstByUUID(this.data.diuu);
            compInst.componentDidFocus && unstable_batchedUpdates(() => {
                compInst.componentDidFocus();
            });
        };

        o.methods.onHide = function () {
            const compInst = instanceManager.getCompInstByUUID(this.data.diuu);
            compInst.componentWillUnfocus && compInst.componentWillUnfocus();
        };

        o.methods.onUnload = function () {
            const compInst = instanceManager.getCompInstByUUID(this.data.diuu);
            compInst.componentWillUnfocus && compInst.componentWillUnfocus();

            cleanPageComp(compInst);
        };
    }
    return o
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


const deprecatedInfo = "ERROR：请更新Alita，并重新转化!!\n\t更新：sudo npm install -g @areslabs/alita\n\t转化：alita -i RN源码目录 -o 输出小程序目录 ";

function deprecated() {
    console.error(deprecatedInfo);
}

var index = {
    render: deprecated,
    renderPage,
    Component,
    PureComponent,
    FuncComponent,
    HocComponent,
    createElement,
    WxNormalComp,
    RNBaseComponent,
    tackleWithStyleObj,
    parseElement,
    flattenStyle,
    styleType,
    h: createElement,
    instanceManager,
    getPropsMethod,
    unstable_batchedUpdates,
    renderApp,
    reactCompHelper
};
const h = createElement;
const render$1 = deprecated;

export default index;
export { Component, FuncComponent, HocComponent, PureComponent, RNBaseComponent, WxNormalComp, createElement, flattenStyle, getPropsMethod, h, instanceManager, parseElement, reactCompHelper, render$1 as render, renderApp, renderPage, styleType, tackleWithStyleObj, unstable_batchedUpdates };
