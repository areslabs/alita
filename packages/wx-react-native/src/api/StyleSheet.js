/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
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
                result[key] = computedStyle[key];
            }
        }
    }
    return result;
}

export default {
    create(obj) {
        // 保持和RN StyleSheet.create方法一致
        return obj
    },

    flatten,

    absoluteFill: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    }
}