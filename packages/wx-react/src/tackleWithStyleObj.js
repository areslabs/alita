/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


/**
 * 样式适配模块，
 */


import {SCROLL, VIEW, INNERTEXT, OUTERTEXT} from './styleType'

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

const DEFAULTVIEWSTYLE = "_1_"
const DEFAULTTEXTWSTYLE = "_2_"

const DEFAULTINNERTEXTWSTYLE = "_3_"
const DEFAULTSCROLLVIEWSTYLE = "_4_"


//mkup the string
export default function tackleWithStyleObj(obj, styleType) {
    const airport = flattenArray(obj)
    const styleStr = parseElement(airport)
    if (!styleType) {
        return styleStr
    }

    let prefixStyle = ''
    if (styleType === INNERTEXT) {
        prefixStyle = DEFAULTINNERTEXTWSTYLE
    } else if (styleType === OUTERTEXT) {
        prefixStyle = DEFAULTTEXTWSTYLE;

        if (obj && !obj.height) { // 根据RN的Text的行为推测
            prefixStyle = prefixStyle + "max-height: 100%;"
        }

        if (obj && !obj.width) { // 根据RN的Text的行为推测
            prefixStyle = prefixStyle + "max-width: 100%;"
        }
    } else if (styleType === SCROLL) {
        prefixStyle = DEFAULTSCROLLVIEWSTYLE
    } else {
        prefixStyle = DEFAULTVIEWSTYLE
    }
    return `${prefixStyle}${styleStr}`
}

export function parseElement(element) {
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
                console.warn('resizeMode属性请写在props上，而不是style')
            } else {
                console.warn(`style对象不支持${k}属性`)
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
            default: {
                // do nothing
            }
        }
    }

    return out;
}

function flattenArray(arr, ans = {}) {
    if (!Array.isArray(arr)) return arr

    for (let m in arr) {
        if (!Array.isArray(arr[m])) {
            Object.assign(ans, arr[m])
        } else {
            flattenArray(arr[m], ans)
        }
    }
    return ans
}


/**
 * the inverse process of tackleWithStyleObj
 * @param str
 */
export function flattenStyle(str) {

    if (Array.isArray(str)) {
        return flattenArray(str)
    }

    if (typeof str === 'object') {
        return str
    }

    const array = str.split(';').filter(i => i)
    const obj = {}
    for (let k = 0; k < array.length; k++) {
        const str = array[k]
        const arr = str.split(':')
        if (arr.length < 2) {
            continue
        }
        const key = arr[0]
        const value = arr[1]
        if (!realBigThing[key]) continue
        let ans = handleValue(realBigThing[key].type, value)
        if (ans) {
            obj[realBigThing[key].name] = ans
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
            const arr = value.split(' ').filter(i => i)
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