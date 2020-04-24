/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {renderPage, createElement, unstable_batchedUpdates, instanceManager} from "./index"
import geneUUID from "./geneUUID"
import {cleanPageComp, getEventHandler} from './util'
import {cleanPageLayoutElements} from './rnLayout'


export default function (compPath) {

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
            	const eh = getEventHandler(this.data.diuu, e.currentTarget.dataset.diuu, e.type)
                if (eh) {
                    //TODO 适配 event参数
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
                            	rawQuery: query,
                                routerParams: paramsObj,
                                diuu: uuid
                            },
                        ),
                        this
                    )

                    const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
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
			cleanPageLayoutElements(this.data.diuu)
        }
    }
    return o
}