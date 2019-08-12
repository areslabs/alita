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
class InstanceManager {
    innerMap = {}

    wxInstSuffix = "__wx"

    compInstSuffix = "__comp"

    getCompInstByUUID(uuid) {
        const key = `${uuid}${this.compInstSuffix}`
        return this.innerMap[key]
    }

    setCompInst(uuid, comp) {
        const key = `${uuid}${this.compInstSuffix}`
        this.innerMap[key] = comp
    }

    getWxInstByUUID(uuid) {
        const key = `${uuid}${this.wxInstSuffix}`
        return this.innerMap[key]
    }

    setWxCompInst(uuid, comp) {
        const key = `${uuid}${this.wxInstSuffix}`
        this.innerMap[key] = comp
    }

    removeWxInst(uuid) {
        const key = `${uuid}${this.wxInstSuffix}`
        if (this.innerMap[key]) {
            delete this.innerMap[key]
        }
    }

    // 基本组件的移除操作
    removeUUID(uuid) {
        console.log('IM: removeUUID', uuid)
        const wxKey = `${uuid}${this.wxInstSuffix}`
        const compKey = `${uuid}${this.compInstSuffix}`

        const compInst = this.innerMap[compKey]
        if (compInst && typeof compInst._ref === 'function') {
            compInst._ref(null)
        }

        delete this.innerMap[wxKey]
        delete this.innerMap[compKey]
    }
    
    removeCompInst(uuid) {
        const key = `${uuid}${this.compInstSuffix}`
        if (this.innerMap[key]) {

            if (typeof this.innerMap[key]._ref === 'function') {
                this.innerMap[key]._ref(null)
            }

            delete this.innerMap[key]
        }
    }

    compExist(comp) {
        const compKey = `${comp.__diuu__}${this.compInstSuffix}`

        return !!this.innerMap[compKey]
    }
}

wx.__III = new InstanceManager()

export default wx.__III