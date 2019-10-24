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

const innerMap = {}

const wxInstSuffix = "__wx"

const compInstSuffix = "__comp"

export default {
    getCompInstByUUID: function(uuid) {
        const key = `${uuid}${compInstSuffix}`
        return innerMap[key]
    },

    setCompInst: function(uuid, comp) {
        const key = `${uuid}${compInstSuffix}`
        innerMap[key] = comp
    },

    getWxInstByUUID: function(uuid) {
        const key = `${uuid}${wxInstSuffix}`
        return innerMap[key]
    },

    setWxCompInst: function(uuid, comp) {
        const key = `${uuid}${wxInstSuffix}`
        innerMap[key] = comp
    },

    removeWxInst: function (uuid) {
        const key = `${uuid}${wxInstSuffix}`
        if (innerMap[key]) {
            delete innerMap[key]
        }
    },


    // 基本组件的移除操作
    removeUUID: function(uuid) {
        const wxKey = `${uuid}${wxInstSuffix}`
        const compKey = `${uuid}${compInstSuffix}`

        const compInst = innerMap[compKey]
        if (compInst && typeof compInst._ref === 'function') {
            compInst._ref(null)
        }

        delete innerMap[wxKey]
        delete innerMap[compKey]
    },

    removeCompInst: function (uuid) {
        const key = `${uuid}${compInstSuffix}`
        if (innerMap[key]) {

            if (typeof innerMap[key]._ref === 'function') {
                innerMap[key]._ref(null)
            }

            delete innerMap[key]
        }
    },

    compExist: function(comp) {
        const compKey = `${comp.__diuu__}${compInstSuffix}`

        return !!innerMap[compKey]
    },
}