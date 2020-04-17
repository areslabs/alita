/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {renderPage, createElement, HocComponent, unstable_batchedUpdates, instanceManager} from "./index"
import geneUUID from "./geneUUID"
import {cleanPageComp} from './util'
import {LayoutConstsMap} from './constants'

export default function (compPath) {

    const o = {
        properties: {
            diuu: null,
        },

        attached() {
            // 页面组件 这个时候diuu 还未准备好
            this.data.diuu && instanceManager.setWxCompInst(this.data.diuu, this)
        },

        ready() {
            const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
            // 处理onLayout事件
            if (compInst && compInst[LayoutConstsMap.UpdateLayoutEvents]) {
                compInst[LayoutConstsMap.UpdateLayoutEvents].call(compInst)
            }
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
                let eh = compInst.__eventHanderMap[eventKey]

                // map地图组件的regionchange事件 type为begin/end
                if (!eh && (e.type === 'begin' || e.type === 'end')) {
                    eh = compInst.__eventHanderMap[e.currentTarget.dataset.diuu + 'regionchange']
                }

                if (eh) {
                    //TODO event参数
                    eh(e)
                }
            }
        }
    }

    // 可能是页面组件，需要加入相关生命周期
    if (compPath) {
        o.methods.onLoad = function (query) {
            const paramStr = query.params
            let paramsObj = {}
            if (paramStr) {
                paramsObj = JSON.parse(decodeURIComponent(paramStr))
            }

            const uuid = geneUUID()
            this.data.diuu = uuid

            //const CompMySelf =  wx._pageCompMaps[compPath]

            wx._getCompByPath(compPath)
                .then((CompMySelf) => {

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

                    const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
                    // 处理onLayout事件
                    if (compInst[LayoutConstsMap.UpdateLayoutEvents]) {
                        compInst[LayoutConstsMap.UpdateLayoutEvents].call(compInst)
                    }
                    //如果组件还未初始化 didFocus方法，保证执行顺序为： didMount --> didFocus
                    if (compInst.componentDidFocus) {
                        const focusFunc = compInst.componentDidFocus
                        const didMountFunc = compInst.componentDidMount

                        compInst.componentDidFocus = undefined
                        compInst.componentDidMount = function () {
                            didMountFunc && didMountFunc.call(compInst)
                            focusFunc.call(compInst)
                            compInst.componentDidFocus = focusFunc
                            compInst.componentDidMount = didMountFunc
                        }

                    }


                })
        }

        o.methods.onShow = function () {
            const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
            compInst && compInst.componentDidFocus && unstable_batchedUpdates(() => {
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