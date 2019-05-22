/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {getPropsMethod, instanceManager} from '@areslabs/wx-react'

Component({
    properties: {
        refreshing: {
            type: Boolean,
            value: false,
            observer: function (nv) {
                if (nv) {
                    console.warn('不支持 ScrollView 的refreshing属性, 可以使用FlatList替换')
                }
            }
        },
        contentContainerStyle: {
            type: String,
            value: ""
        },
        horizontal: {
            type: Boolean,
            value: false
        },
        //暂不支持
        pagingEnabled: {
            type: Boolean,
            value: false,
            observer: function (nv) {
                if (nv) {
                    console.warn('不支持 ScrollView 的pagingEnabled属性')
                }
            }
        },
        diuu: null
    },

    detached() {
        instanceManager.removeUUID(this.data.diuu);
    },

    attached() {
        instanceManager.setWxCompInst(this.data.diuu, this)
    },

    ready: function() {
        instanceManager.setWxCompInst(this.data.diuu, this)
        this.onScrollFunc = getPropsMethod(this, 'onScroll')
    },

    methods: {
        scrollTo(pos) {
            const { x, y } = pos;
            this.setData({ outTop: y, outLeft: x })
        },
        formatEvent(e) {
            return {
                nativeEvent: {
                    contentOffset: {
                        x: e.detail.scrollLeft,
                        y: e.detail.scrollTop
                    }
                }
            };
        },
        outScroll(e) {
            if (this.onScrollFunc) {
                this.onScrollFunc(this.formatEvent(e))
            }
        },
        startTouch() {
            //TODO
            const method = getPropsMethod(this, "onScrollBeginDrag")
            method && method();
        },
        leaveTouch(e) {
            //TODO
            const method = getPropsMethod(this, "onScrollEndDrag")
            method && method()
        }
    },
    data: {
        withAni: true,
        outLeft: 0,
        outTop: 0,
    }
});