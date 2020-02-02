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


import {SCROLL, INNERTEXT, OUTERTEXT} from './styleType'

const AddPx = 1;
const AddPxORPercent = 2;
const RawValue = 3;

const styleKeyMaps = {
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
    marginLeft: { name: "margin-left", type: AddPxORPercent },
    marginRight: { name: "margin-right", type: AddPxORPercent },
    marginTop: { name: "margin-top", type: AddPxORPercent },
    maxHeight: { name: "max-height", type: AddPxORPercent },
    maxWidth: { name: "max-width", type: AddPxORPercent },
    minHeight: { name: "min-height", type: AddPxORPercent },
    minWidth: { name: "min-width", type: AddPxORPercent },
    opacity: { name: "opacity", type: RawValue },
    overflow: { name: "overflow", type: RawValue },
    padding: { name: "padding", type: AddPxORPercent },
    paddingBottom: { name: "padding-bottom", type: AddPxORPercent },
    paddingLeft: { name: "padding-left", type: AddPxORPercent },
    paddingRight: { name: "padding-right", type: AddPxORPercent },
    paddingTop: { name: "padding-top", type: AddPxORPercent },
    position: { name: "position", type: RawValue },
    right: { name: "right", type: AddPxORPercent },
    textAlign: { name: "text-align", type: RawValue },
    textAlignVertical: { name: "text-align-vertical", type: RawValue },
    textDecorationColor: { name: "text-decoration-color", type: RawValue },
    textDecorationLine: { name: "text-decoration-line", type: RawValue },
    textDecorationStyle: { name: "text-decoration-style", type: RawValue },
    textTransform: { name: "text-transform", type: RawValue },
    top: { name: "top", type: AddPxORPercent },
    width: { name: "width", type: AddPxORPercent },
    writingDirection: { name: "writing-direction", type: RawValue },
    zIndex: { name: "z-index", type: RawValue }
};

const DEFAULTVIEWSTYLE = "_1_"
const DEFAULTTEXTWSTYLE = "_2_"

const DEFAULTINNERTEXTWSTYLE = "_3_"
const DEFAULTSCROLLVIEWSTYLE = "_4_"


/**
 * 把RN的style对象，转化为css的style字符串
 * @param rawStyle
 * @param styleType
 * @returns {string}
 */
export default function tackleWithStyleObj(rawStyle, styleType) {
    const flattenStyle = flatten(rawStyle)
    const styleStr = parseObj(flattenStyle)
    if (!styleType) {
        return styleStr
    }

    let prefixStyle = ''
    if (styleType === INNERTEXT) {
        prefixStyle = DEFAULTINNERTEXTWSTYLE
    } else if (styleType === OUTERTEXT) {
        prefixStyle = DEFAULTTEXTWSTYLE;

        if (flattenStyle && !flattenStyle.height) { // 根据RN的Text的行为推测
            prefixStyle = prefixStyle + "max-height: 100%;"
        }

        if (flattenStyle && !flattenStyle.width) { // 根据RN的Text的行为推测
            prefixStyle = prefixStyle + "max-width: 100%;"
        }
    } else if (styleType === SCROLL) {
        prefixStyle = DEFAULTSCROLLVIEWSTYLE
    } else {
        prefixStyle = DEFAULTVIEWSTYLE
    }
    return `${prefixStyle}${styleStr}`
}

function parseTransform(transform) {
    let result = ''
    transform.forEach((item) => {
        // item 应当仅包含一个元素
        for (let key in item) {
            const v = item[key]
            if (key === 'translateX' || key === 'translateY') {
                result += (`${key}(${v}px) `)
            } else {
                result += (`${key}(${v}) `)
            }
        }
    })
    return result
}

function parseObj(flattenStyle) {
    if (!flattenStyle) {
        return ''
    }

    let out = "";
    if (flattenStyle.shadowOffset) {
        const {width = 0 , height = 0} = flattenStyle.shadowOffset
        out += `box-shadow: ${width}px ${height}px ${flattenStyle.shadowColor || ''}; `
    }

    if (flattenStyle.textShadowOffset) {
        const {width = 0 , height = 0} = flattenStyle.textShadowOffset
        out += `text-shadow: ${width}px ${height}px ${flattenStyle.textShadowColor || ''}; `
    }

    for (let k in flattenStyle) {
        const v = flattenStyle[k]

        if (k === 'shadowOffset'
            || k === 'shadowColor'
            || k === 'textShadowOffset'
            || k === 'textShadowColor'
        ) {
            // 提前处理
            continue
        }

        //单独处理
        if (k === "transform") {
            const tranStr = parseTransform(v)
            out += `transform: ${tranStr};`;
            continue;
        }

        if (k === "flex") {
            if (v >= 1) {
                out += `flex: ${v} 1 0%;`
            }
            continue
        }

        if (styleKeyMaps[k] === undefined) {
            console.warn('style对象: ', flattenStyle, ' 存在不支持属性：', k)
            continue
        }

        let lastV = ''
        switch (styleKeyMaps[k].type) {
            case RawValue: {
                lastV = v
                break;
            }
            case AddPx: {
                lastV = `${v}px`
                break;
            }
            case AddPxORPercent: {
                if (Number(v)) {
                    lastV = `${v}px`
                } else {
                    lastV = v
                }
                break;
            }
            default: {
                // do nothing
            }
        }

        out += `${styleKeyMaps[k].name}: ${lastV};`
    }

    return out;
}

function flatten(style) {
    if (style === null || typeof style !== 'object') {
        return undefined;
    }

    if (!Array.isArray(style)) {
        return style;
    }

    const result = {};
    for (let i = 0, styleLength = style.length; i < styleLength; ++i) {
        const computedStyle = flatten(style[i]);
        if (computedStyle) {
            for (const key in computedStyle) {
                if (key === 'marginHorizontal') {
                    result['margin-left'] = result['margin-right'] = computedStyle[key]
                } else if (key === 'marginVertical') {
                    result['margin-top'] = result['margin-bottom'] = computedStyle[key]
                } else if (key === 'paddingHorizontal') {
                    result['padding-left'] = result['padding-right'] = computedStyle[key]
                } else if (key === 'paddingVertical') {
                    result['padding-top'] = result['padding-bottom'] = computedStyle[key]
                } else {
                    result[key] = computedStyle[key]
                }
            }
        }
    }
    return result;
}
