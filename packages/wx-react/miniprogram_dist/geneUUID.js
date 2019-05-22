/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
const ORDER = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split('')
let uuid = "a0000000".split('')
export default function geneUUID() {
    let start = 7
    while (incr(start) && start > 0) {
        start = start - 1
    }

    return uuid.join('')
}


function incr(index) {
    const v = uuid[index]

    if (v === 'z') {
        uuid[index] = '0'
        return true
    } else {
        const nextIndex = ORDER.indexOf(v) + 1
        uuid[index] = ORDER[nextIndex]
        return false
    }
}