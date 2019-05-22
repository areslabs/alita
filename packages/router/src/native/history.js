/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {
    NavigationActions,
    StackActions,
} from 'react-navigation'

class History {
    navigatorRef = null
    naviType = null

    setTopLevelNavigator(ref) {
        this.navigatorRef = ref
    }

    setNaviType(naviType) {
        this.naviType = naviType
    }

    dispatch(actions) {
        this.navigatorRef.dispatch(actions)
    }

    push(path, opts) {
        const navigateAction = StackActions.push({
            routeName: path,
            params: opts,
        });
        this.dispatch(navigateAction)
    }

    pop(n = 1) {
        if (this.getCurrentRoutes().length === 1 ) {
            // do nothing
        } else {
            const navigateAction = StackActions.pop({
                n,
            })
            this.dispatch(navigateAction)
        }
    }

    back() {
        this.pop(1)
    }

    popToTop() {
        const navigateAction = StackActions.popToTop()
        this.dispatch(navigateAction)
    }

    replace(path, opts) {
        const navigateAction = StackActions.replace({
            routeName: path,
            params: opts,
        })

        this.dispatch(navigateAction)
    }

    reset(path, opts) {
        //TODO
    }

    popTo(routeName) {
        const routes = this.getCurrentRoutes()

        for(let i = 0; i < routes.length; i++) {
            const ele = routes[i]
            if (ele.routeName === routeName && i !== routes.length - 1) {
                const n = routes.length - 1 - i
                this.pop(n)
            }
        }
    }

    getCurrentRoutes() {
        let routes = null
        if (this.naviType === 'tab') {
            const nav = this.navigatorRef.state.nav
            const currentRoutes = nav.routes[nav.index]
            routes = currentRoutes.routes
        } else {
            routes = this.navigatorRef.state.nav.routes
        }
        return routes
    }

    popToWithProps(routeName, newProps) {

        const routes = this.getCurrentRoutes()
        for(let i = 0; i < routes.length; i++) {
            const ele = routes[i]
            if (ele.routeName === routeName && i !== routes.length - 1) {
                const setParamsAction = NavigationActions.setParams({
                    key: routes[i].key,
                    params: newProps,
                })
                this.dispatch(setParamsAction);

                const n = routes.length - 1 - i
                this.pop(n)
            }
        }
    }
}

export default new History()