/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import { instanceManager } from "@areslabs/wx-react";

/* eslint-disable-next-line */
export default history = {

    push(pkname, path, params) {
        const fpath = `${pkname}${path}`
        const url = wx._historyConfig[fpath]

        let paramStr = ''
        if (params) {
           paramStr = `?params=${encodeURIComponent(JSON.stringify(params))}`
        }

        wx.navigateTo({
            url: `${url}${paramStr}`,
        })
    },

    replace(pkname, path, params) {
        const fpath = `${pkname}${path}`
        const url = wx._historyConfig[fpath]

        let paramStr = ''
        if (params) {
            paramStr = `?params=${encodeURIComponent(JSON.stringify(params))}`
        }
        wx.redirectTo({
            url: `${url}${paramStr}`
        })
    },

    pop(n = 1) {
        wx.navigateBack({
            delta: n
        })
    },

    back() {
        this.pop(1)
    },

    popToTop() {
        const currentRoutes = this.getCurrentRoutes()
        this.pop(currentRoutes.length - 1)
    },

    getCurrentRoutes() {
        /* eslint-disable-next-line */
        return getCurrentPages()
    },

    popTo(pkname, routeName) {
        const fpath = `${pkname}${routeName}`
        const url =  wx._historyConfig[fpath].substring(1)

        const routes = this.getCurrentRoutes()
        for(let i = 0; i < routes.length; i++) {
            const ele = routes[i]
            if (ele.__route__ === url && i !== routes.length - 1) {
                wx.navigateBack({
                    delta: routes.length - 1 - i
                })
            }
        }
    },

    popToWithProps(pkname, routeName, newProps) {
        const fpath = `${pkname}${routeName}`
        const url =  wx._historyConfig[fpath].substring(1)

        const routes = this.getCurrentRoutes()
        for(let i = 0; i < routes.length; i++) {
            const ele = routes[i]
            if (ele.__route__ === url && i !== routes.length - 1) {
                const compInst = instanceManager.getCompInstByUUID(ele.data.diuu)
                wx.navigateBack({
                    delta: routes.length - 1 - i,

                    success: function () {
                        const oldProps = compInst.props

                        const nextProps = {
                            ...oldProps,
                            routerParams: {
                                ...oldProps.routerParams,
                                ...newProps,
                            }
                        }

                        compInst.componentWillReceiveProps && compInst.componentWillReceiveProps(nextProps)
                        compInst.props = nextProps

                        compInst.setState({})
                    }
                })

            }
        }
    }
}
