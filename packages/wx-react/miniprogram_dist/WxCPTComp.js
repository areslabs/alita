/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import instanceManager from "./InstanceManager"
import { HocComponent } from "./index"
import {recursionUnmount} from "./util";

export default function () {
    return {
        properties: {
            diuu: null,
            _r: null,
        },

        attached() {
            instanceManager.setWxCompInst(this.data.diuu, this)
        },

        ready() {
            const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
            // 一般情况下 CPTComp 都是无状态组件， 但是由于HOC的存在， 对于HOC包裹的组件， 需要主动firstUpdateUI
            if (!compInst.firstRender && !compInst.stateless) {
                compInst.firstUpdateUI()
            }
        },

        detached() {
            const compInst = instanceManager.getCompInstByUUID(this.data.diuu)

            if (compInst instanceof HocComponent) {
                recursionUnmount(compInst)
            } else {
                compInst.componentWillUnmount && compInst.componentWillUnmount()
                instanceManager.removeUUID(this.data.diuu)
            }

            if (compInst._p) {
                compInst._p._c = compInst._p._c.filter(diuu => diuu !== this.data.diuu)
            }
        },

        methods: {
            eventHandler(e) {
                const eventKey = e.currentTarget.dataset.diuu + e.type
                let compInst = instanceManager.getCompInstByUUID(this.data.diuu)
                while (compInst && compInst instanceof HocComponent) {
                    compInst = instanceManager.getCompInstByUUID(compInst._c[0])
                }
                const eh = compInst.__eventHanderMap[eventKey]

                if (eh) {
                    //TODO event参数
                    eh()
                }
            }
        }
    }
}