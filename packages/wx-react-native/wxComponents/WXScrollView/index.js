/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
Component(wx.__bridge.reactCompHelper({
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
    },

    ready: function() {
        this.onScrollFunc = this.data.onScroll

        //onContentSizeChange
        if (this.data.onContentSizeChange) {
            const query = wx.createSelectorQuery().in(this)
            query.select('.scroll-area').boundingClientRect((res) => {
                this.setData({
                    contentHeight: res.height
                })

                this.watchContentSize()
            }).exec()
        }
    },

    methods: {
        // 监听contentSize的变化
        watchContentSize() {
            const observer = wx.createIntersectionObserver(this, {observeAll: true})
            observer.relativeTo('.scroll-area')
                .observe('.ball', (res) => {
                    const {id, intersectionRatio, relativeRect} = res
                    if (id === 'above' && intersectionRatio === 0) {
                        const onContentSizeChangeFunc = this.data.onContentSizeChange
                        onContentSizeChangeFunc(relativeRect.right - relativeRect.left, relativeRect.bottom - relativeRect.top)

                        const query = wx.createSelectorQuery().in(this)
                        query.select('.scroll-area').boundingClientRect((res) => {
                            this.setData({
                                contentHeight: res.height
                            })
                        }).exec()
                    }

                    if (id === 'below' && intersectionRatio === 1) {
                        const onContentSizeChangeFunc = this.data.onContentSizeChange
                        onContentSizeChangeFunc(relativeRect.right - relativeRect.left, relativeRect.bottom - relativeRect.top)

                        const query = wx.createSelectorQuery().in(this)
                        query.select('.scroll-area').boundingClientRect((res) => {
                            this.setData({
                                contentHeight: res.height
                            })
                        }).exec()
                    }
                })
        },


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
            const method = this.data.onScrollBeginDrag
            method && method();
        },
        leaveTouch(e) {
            //TODO
            const method = this.data.onScrollEndDrag
            method && method()
        }
    },
    data: {
        withAni: true,
        outLeft: 0,
        outTop: 0,
        contentHeight: 0,
    }
}))