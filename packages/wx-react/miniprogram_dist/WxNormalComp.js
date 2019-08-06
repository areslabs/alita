/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {render, createElement, HocComponent, unstable_batchedUpdates} from "./index"
import geneUUID from "./geneUUID"
import instanceManager from "./InstanceManager"
import {FR_DONE, recursionUnmount} from './util'


export default function (CompMySelf, RNApp) {

    const o = {
        properties: {
            diuu: null,
            R: null,
        },

        attached() {
            // 页面组件 这个时候diuu 还未准备好
            this.data.diuu && instanceManager.setWxCompInst(this.data.diuu, this)
        },


        detached() {
            const compInst = instanceManager.getCompInstByUUID(this.data.diuu)

            // 如果是React高价组件 Hoc3(Hoc2(Hoc1(A)))，在微信组件销毁的时候，Hoc3, Hoc2, Hoc1, A 都有可能执行componentWillUnmount
            // 判断的准则是： 从关联的顶层组件（Hoc3）依次开始，若组件已经不在其父组件中存在，则此组件及其子孙组件应该被销毁，而销毁的顺序是
            // 从底往上
            if (compInst instanceof HocComponent) {
                this.relativeComps.unshift(compInst)

                let unmountComps = null
                for(let i = 0; i < this.relativeComps.length; i ++) {
                    const item = this.relativeComps[i]

                    if (item._p._c.indexOf(item.__diuu__) === -1) {
                        unmountComps = this.relativeComps.slice(i)
                        break
                    }
                }

                for(let i = unmountComps.length - 1; i >= 0; i --) {
                    const item = unmountComps[i]
                    item.componentWillUnmount && item.componentWillUnmount()
                    instanceManager.removeUUID(item.__diuu__)
                }
            } else {
                compInst.componentWillUnmount && compInst.componentWillUnmount()
                instanceManager.removeUUID(this.data.diuu)
            }
        },

        methods: {
            // 基本组件回调函数处理
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

    // 可能是页面组件，需要加入相关生命周期
    if (CompMySelf && RNApp) {
        o.methods.onLoad = function (query) {
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


            const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
            // 在firstUpdate 接受到小程序的回调之前，如果组件调用setState 可能会丢失！
            compInst.firstUpdateWX()
        }

        o.methods.onShow = function () {
            const compInst = instanceManager.getCompInstByUUID(this.data.diuu)

            //如果组件还未初始化 didFocus方法，由firstUpdateUI负责
            compInst.firstRender === FR_DONE && compInst.componentDidFocus && unstable_batchedUpdates(() => {
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
            instanceManager.removeUnmarred()
        }
    }
    return o
}