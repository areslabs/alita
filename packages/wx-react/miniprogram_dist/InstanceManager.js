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

    // 由于语法错误的存在，比如多层级传递xxComponent, 会出现render过程构造出的uuid，在微信过程没有与之对应的实例。
    // 故需要在页面onUnload的定期处理
    unmarriedSet = new Set([])

    wxInstSuffix = "__wx"

    compInstSuffix = "__comp"

    getCompInstByUUID(uuid) {
        const key = `${uuid}${this.compInstSuffix}`
        return this.innerMap[key]
    }

    setCompInst(uuid, comp) {
        const key = `${uuid}${this.compInstSuffix}`
        this.innerMap[key] = comp
        this.unmarriedSet.add(uuid)
    }

    getWxInstByUUID(uuid) {
        const key = `${uuid}${this.wxInstSuffix}`
        return this.innerMap[key]
    }

    setWxCompInst(uuid, comp) {
        const key = `${uuid}${this.wxInstSuffix}`
        this.innerMap[key] = comp
        this.unmarriedSet.delete(uuid)
    }

    removeUnmarred() {
        if (this.unmarriedSet.size > 0) {
            const unmarriedSet = new Set([])
            this.unmarriedSet.forEach(uuid => {
                const compKey = `${uuid}${this.compInstSuffix}`

                const comp = this.innerMap[compKey]
                if (comp.hocWrapped) {
                    unmarriedSet.add(uuid)
                } else {
                    delete this.innerMap[compKey]
                }
            })

            this.unmarriedSet = unmarriedSet
        }
    }

    removeUUID(uuid) {
        const wxKey = `${uuid}${this.wxInstSuffix}`
        const compKey = `${uuid}${this.compInstSuffix}`

        const compInst = this.innerMap[compKey]
        if (typeof compInst._ref === 'function') {
            compInst._ref(null)
        }

        delete this.innerMap[wxKey]
        delete this.innerMap[compKey]

        this.unmarriedSet.delete(uuid)
    }

    compExist(comp) {
        const compKey = `${comp.__diuu__}${this.compInstSuffix}`

        return !!this.innerMap[compKey]
    }

    isInstanceOf(uuid, clazz) {
        const compKey = `${uuid}${this.compInstSuffix}`
        const inst = this.innerMap[compKey]

        return inst instanceof clazz
    }
}

export default new InstanceManager()