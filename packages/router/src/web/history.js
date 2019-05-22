/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
let routerState = []

let flag = false; //如果是push或者是popTo，需要将其置为true
class History {
    constructor() {
        if (window.history && window.history.pushState) {
            window.onpopstate = function () {
                if(!flag) {
                    routerState.pop();
                } else {
                    flag = false;
                }
            };
        }
    }

    push(path, opts) {
        const hash = encodeURIComponent(JSON.stringify({
            hash: path,
            params: opts
        }))

        window.location.hash = hash

        flag = true;

        routerState.push(path);
    }

    replace(path, opts) {
        const hash = encodeURIComponent(JSON.stringify({
            hash: path,
            params: opts
        }))

        const hashIndex = window.location.href.indexOf('#');
        window.location.replace(
            window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + hash
        );

        routerState[routerState.length -1] = path
    }


    pop() {
        window.history.go(-1)
        routerState.pop()
    }

    back() {
        this.pop()
    }


    reset() {
        //TODO
    }

    popTo(routeName) {
        const index = routerState.indexOf(routeName)
        window.history.go(index - routerState.length + 1)
        flag = true;
        routerState = routerState.slice(0, index + 1)
    }

    getCurrentRoutes() {
        return {
            length: window.history.length
        }
    }

    popToWithProps(routeName, newProps) {
        console.warn('popTo only work for android and ios');
    }

    popToWithRefresh(routeName, newProps = {}) {
        console.warn('popTo only work for android and ios');
    }
}

export default new History()