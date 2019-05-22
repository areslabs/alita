/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import instanceManager from "./InstanceManager";
import {HOCKEY, FR_PENDING} from './util'

function isDiuuKey(key) {
    return key.startsWith("DIUU") && key.length === 9
}

function getListSubData(list) {
    const newList = []
    for(let i = 0; i < list.length; i ++) {
        const item = list[i]

        if (typeof item === 'object' && item !== null) {
            newList.push(getObjSubData(item))
        } else {
            newList.push(item)
        }

    }
    return newList
}

export default function getObjSubData(data) {
    if (data[HOCKEY]) {
        const compInst = instanceManager.getCompInstByUUID(data[HOCKEY])
        return getObjSubData(compInst._r)
    }



    const newData = {}
    const allKeys = Object.keys(data)
    for(let i = 0; i < allKeys.length; i++) {
        const k = allKeys[i]
        const v = data[k]


        if (Array.isArray(v)) {
            newData[k] = getListSubData(v)
        } else if (typeof v === 'object' && v !== null) {
            newData[k] = getObjSubData(v)
        } else {
            newData[k] = v
        }


        if (isDiuuKey(k)) {
            const compInst = instanceManager.getCompInstByUUID(v)
            if (compInst && !compInst.stateless && compInst._r) {
                newData[`${k}R`] = getObjSubData(compInst._r)
                compInst.firstRender = FR_PENDING
            }
        }
    }

    return newData
}
