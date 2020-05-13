/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
const top = 80
Component(wx.__bridge.reactCompHelper({


    ready() {
        const method = this.data.onRefresh
        this.onRefreshMethod = method
        this.onScrollFunc = this.data.onScroll
        this.onScrollEndDragFunc = this.data.onScrollEndDrag

    },


    methods: {
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

        recoverRefresh() {
            if(this.stopTimerFlag){
                clearTimeout(this.stopTimerFlag)
            }
            this.stopTimerFlag = setTimeout(() => {
                const refreshing = this.data._r.refreshing
                if (this.lastVal <= 80 && !refreshing) {
                    this.setData({
                        sr: false
                    });
                }
            }, 100)
        },

        outScroll(e) {
            this.lastVal = e.detail.scrollTop;
            if (this.data._r.onRefreshPassed && !this.underTouch) {
                this.recoverRefresh()
            }

            // onScrollEndDrag 记录滚动事件，
            if (this.onScrollEndDragFunc) {
                this._scrollEvent = e
            }

            if (this.onScrollFunc) {
                this.onScrollFunc(this.formatEvent(e));
            }
        },
        startTouch() {
            this.underTouch = true
            const method = this.data.onScrollBeginDrag
            method && method();
        },
        onScrollToupper() {
            this.lastVal = 0;
        },
        leaveTouch() {
            this.underTouch = false
            if (this._scrollEvent && this.onScrollEndDragFunc) {
                // 通过this._scrollEvent是否存在来判断触摸是不是滚动触摸
                this.onScrollEndDragFunc(this.formatEvent(this._scrollEvent));
                this._scrollEvent = undefined
            }


            if (!this.data._r.onRefreshPassed) return

            //业务逻辑模拟，执行onRefresh
            if (this.lastVal < 20) {
                this.onRefreshMethod && this.onRefreshMethod();
                return;
            }
            //松手归位

            const refreshing = this.data._r.refreshing
            if (this.lastVal <= top && this.lastVal >= 20 && !refreshing) {
                this.setData({
                    sr: false
                });
            }
        },
        onEndReached() {
            // 当有刷新头的时候（默认向上滚80），也会触发onEndReached， 但是这一次不应该调用
            if (this.data._r.onRefreshPassed && !this.hasRefreshFirstCall) {
                this.hasRefreshFirstCall = true
                return
            }

            const query = wx.createSelectorQuery().in(this)
            query.select('#container').boundingClientRect((res) => {
                const height = res.height
                if (this.lastHeight === height) return

                this.lastHeight = height
                this.data.onEndReached && this.data.onEndReached()
            }).exec()
        },
    },
    data: {
        withAni: false,
        outLeft: 0,
        sr: false
    }
}))
