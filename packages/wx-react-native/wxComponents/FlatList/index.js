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
        this.onRefreshMethod = this.data.onRefresh
        this.onScrollFunc = this.data.onScroll
        this.onScrollEndDragFunc = this.data.onScrollEndDrag

        this.hasChanges = []
    },


    methods: {
        scrollTo(pos) {
            const {x, y} = pos;
            let mayY = this.data._r.onRefreshPassed ? y + top : y
            this.setData({outTop: mayY, outLeft: x})
        },
        scrollToOffset(pos) {
            const {offset} = pos
            let mayY = this.data._r.onRefreshPassed ? offset + top : offset
            this.setData({outTop: mayY})
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

        recoverRefresh() {
            if (this.stopTimerFlag) {
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

            const stickyInfos = this.data._r.stickyInfos
            if (stickyInfos) {
                const infos = stickyInfos
                if (Array.isArray(infos) && infos.length > 0) {
                    for (let k = 0; k < infos.length; k++) {
                        const info = infos[k]

                        if (this.lastVal >= info.baseOffset && !this.hasChanges[k]) {
                            this.hasChanges[k] = true
                            this.setData({
                                [`sti.stickyContainerStyle${info.index}`]: `height:${info.length}px;width:100%;`,
                                [`sti.stickyStyle${info.index}`]: `position:fixed;top:0;width:100%;z-index: 1000;`
                            })
                        } else if (this.lastVal < info.baseOffset && this.hasChanges[k]) {
                            this.hasChanges[k] = false
                            this.setData({
                                [`sti.stickyContainerStyle${info.index}`]: '',
                                [`sti.stickyStyle${info.index}`]: ''
                            })
                        }
                    }
                }
            }
        },
        startTouch() {
            this.underTouch = true

            this.data.onScrollBeginDrag && this.data.onScrollBeginDrag()
        },
        onScrollToupper() {
            this.lastVal = 0;
        },
        leaveTouch(e) {
            // RN 横向滚动不会触发 onRefresh
            if (this.data._r.horizontal) {
                return
            }

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

        scrollToIndex({index, animated}) {
            this.setData({
                index_id: 'id_' + index
            })

            if (animated) {
                this.setData({
                    withAni: true
                }, () => {
                    this.setData({
                        index_id: 'id_' + index,
                        withAni: false
                    })
                })
            } else {
                this.setData({
                    index_id: 'id_' + index
                })
            }
        },

        onEndReached() {
            // 竖向滚动时，当有刷新头的时候（默认向上滚80），也会触发onEndReached，但是这一次不应该调用
            if (this.data._r.onRefreshPassed && !this.hasRefreshFirstCall && !this.data._r.horizontal) {
                this.hasRefreshFirstCall = true
                return
            }

            const query = wx.createSelectorQuery().in(this)
            query.select('#container').boundingClientRect((res) => {
                const height = res.height
                const width = res.width
                
                if ((this.data._r.horizontal && this.lastWidth === width)
                    || (!this.data._r.horizontal && this.lastHeight === height)
                ) {
                    return
                }
  
                this.lastWidth = width
                this.lastHeight = height
                this.data.onEndReached && this.data.onEndReached()
            }).exec()
        }
    },
    data: {
        withAni: false,
        outLeft: 0,
        index_id: null,
        sr: false,
        sti: {}
    }
}))



