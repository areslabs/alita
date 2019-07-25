/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function getObjectPathInner(v, prefix, result) {
    const tv = typeof v

    if (Array.isArray(v)) {
        // 空数组
        if (v.length === 0) {
            result[prefix] = v
            return
        }

        for (let i = 0; i < v.length; i++) {
            const vele = v[i]
            getObjectPathInner(vele, `${prefix}[${i}]`, result)
        }

    } else if (tv === 'object' && v !== null) {
        const keys = Object.keys(v)

        // 空对象
        if (keys.length === 0) {
            result[prefix] = v
            return
        }


        for (let i = 0; i < keys.length; i++) {
            const k = keys[i]
            const vele = v[k]

            getObjectPathInner(vele, `${prefix}.${k}`, result)
        }
    } else {
        result[prefix] = v
    }
}

function getChangePathInner(newR, oldR, prefix, result) {
    if (newR === oldR) return


    const tn = typeof newR
    const to = typeof oldR
    if (tn !== to
        || oldR === null
        || oldR === undefined
    ) {
        getObjectPathInner(newR, prefix, result)
    } else if (Array.isArray(newR)) {
        for (let i = 0; i < newR.length; i++) {
            const v = newR[i]
            const ov = oldR[i]
            getChangePathInner(v, ov, `${prefix}[${i}]`, result)
        }
        
        if (newR.length < oldR.length) {
            for (let i = newR.length; i < oldR.length; i ++) {
                result[`${prefix}[${i}]`] = null
            }
        }
    } else if (tn === 'object' && tn !== null) {
        if (newR.__isAnimation__) {
            result[prefix] = newR
            return
        }


        const nkeys = Object.keys(newR)
        for (let i = 0; i < nkeys.length; i++) {
            const k = nkeys[i]
            const v = newR[k]
            const ov = oldR[k]
            getChangePathInner(v, ov, `${prefix}.${k}`, result)
        }

        const okeys = Object.keys(oldR)
        const onlyNkeys = okeys.filter(k => newR[k] === undefined)
        for(let i = 0; i < onlyNkeys.length; i ++) {
            result[`${prefix}.${onlyNkeys[i]}`] = null
        }
    } else {
        result[prefix] = newR
    }
}

export default function getChangePath(newRender, oldRender) {
    const result = {}

    getChangePathInner(newRender, oldRender, '_r', result)

    return result
}
