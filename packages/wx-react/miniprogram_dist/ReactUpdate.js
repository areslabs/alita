/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import instanceManager from './InstanceManager'

class ReactUpdate {
    flag = false

    updateInstSet = new Set()

    setFlag(flag) {
        this.flag = flag
    }

    inRe() {
        return this.flag
    }

    addUpdateInst(inst) {
        this.updateInstSet.add(inst)
    }

    finalUpdate() {
        const updateSortList = []
        const allInst = Array.from(this.updateInstSet)
        for(let i = 0; i < allInst.length; i++) {
            const inst = allInst[i]

            if (this.isTop(inst)) {
                updateSortList.unshift(inst)
            } else {
                updateSortList.push(inst)
            }
        }

        for(let i = 0; i < updateSortList.length; i ++) {
            const inst = updateSortList[i]

            // 由于组件销毁由小程序决定， 很可能在更新的时候， 实例已经不存在了。
            if (instanceManager.compExist(inst) && inst.updateQueue.length > 0) {
                const newState = {}
                for(let j = 0; j < inst.updateQueue.length; j++) {
                    Object.assign(newState, inst.updateQueue[j])
                }
                inst.updateQueue = []
                inst.setState(newState)
            }
        }

        this.updateInstSet = new Set()
    }

    isTop(inst) {
        let i = inst._p
        while (i && !this.updateInstSet.has(i)) {
            i = i._p
        }

        return !i
    }
}

export default new ReactUpdate()