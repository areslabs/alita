/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {renderPage, createElement, HocComponent, unstable_batchedUpdates} from "./index"
import geneUUID from "./geneUUID"
import instanceManager from "./InstanceManager"
import {FR_DONE, cleanPageComp} from './util'


export default function (CompMySelf, RNApp) {

    const o = {
        properties: {
            diuu: null,
        },

        attached() {
            // 页面组件 这个时候diuu 还未准备好
            this.data.diuu && instanceManager.setWxCompInst(this.data.diuu, this)
        },


        detached() {
            // 防止泄漏，当自定义组件render 返回null的时候，React组件存在，小程序组件应该销毁
            instanceManager.removeWxInst(this.data.diuu)
        },

        methods: {
            // 基本组件回调函数处理
            eventHandler(e) {
                const eventKey = e.currentTarget.dataset.diuu + e.type
                let compInst = instanceManager.getCompInstByUUID(this.data.diuu)
                while (compInst && compInst instanceof HocComponent) {
                    compInst = compInst._c[0]
                }
                const eh = compInst.__eventHanderMap[eventKey]

                if (eh) {
                    //TODO event参数
                    eh()
                }
            }
        }
    }

    // 可能是页面组件，需要加入相关生命周期
    if (CompMySelf && RNApp) {
        o.methods.onLoad = function (query) {
            const paramStr = query.params
            let paramsObj = {}
            if (paramStr) {
                paramsObj = JSON.parse(decodeURIComponent(paramStr))
            }

            const uuid = geneUUID()
            this.data.diuu = uuid

            renderPage(
                createElement(
                    CompMySelf,
                    {
                        routerParams: paramsObj,
                        diuu: uuid
                    },
                ),
                this
            )
        }

        o.methods.onShow = function () {
            const compInst = instanceManager.getCompInstByUUID(this.data.diuu)

            //如果组件还未初始化 didFocus方法，由commitLifeCycles执行，保证执行顺序为： didMount --> didFocus
            if (compInst.firstInvokeFocus) {
                return
            }

            compInst.componentDidFocus && unstable_batchedUpdates(() => {
                compInst.componentDidFocus()
            })
        }

        o.methods.onHide = function () {
            const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
            compInst.componentWillUnfocus && compInst.componentWillUnfocus()
        }

        o.methods.onUnload = function () {
            const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
            compInst.componentWillUnfocus && compInst.componentWillUnfocus()

            cleanPageComp(compInst)
        }
    }
    return o
}