/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import { render, createElement, HocComponent } from "./index"
import geneUUID from "./geneUUID"
import instanceManager from "./InstanceManager"
import {recursionUnmount} from './util'


export default function (CompMySelf, RNApp) {
    return {
        properties: {
            diuu: null,
            _r: null,
        },


        attached() {
            this.data.diuu && instanceManager.setWxCompInst(this.data.diuu, this)
        },

        ready() {
            const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
            if (compInst.isPageComp) {
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
            onLoad(query) {

                const paramStr = query.params

                let paramsObj = {}
                if (paramStr) {
                    paramsObj = JSON.parse(decodeURIComponent(paramStr))
                }

                const uuid = geneUUID()
                render(
                    createElement(
                        CompMySelf,
                        {
                            routerParams: paramsObj,
                            diuu: uuid
                        },
                    ),
                    null,
                    RNApp.childContext
                )

                this.data.diuu = uuid
                instanceManager.setWxCompInst(this.data.diuu, this)
            },

            onShow() {
                const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
                compInst.componentDidFocus && compInst.componentDidFocus()
            },

            onHide() {
                const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
                compInst.componentWillUnfocus && compInst.componentWillUnfocus()
            },

            onUnload() {
                const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
                compInst.componentWillUnfocus && compInst.componentWillUnfocus()
                instanceManager.removeUnmarred()
            },

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