/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {parseElement, flattenStyle} from '@areslabs/wx-react/tackleWithStyleObj'

export default {
    create(obj) {
        const allKeys = Object.keys(obj)

        const r = {}

        for(let i = 0; i< allKeys.length; i++) {
            const k = allKeys[i]
            const v = obj[k]

            r[k] = parseElement(v)
        }

        return r
    },

    flatten(creStyle) {
        return flattenStyle(creStyle)
    },

    absoluteFill: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    }
}