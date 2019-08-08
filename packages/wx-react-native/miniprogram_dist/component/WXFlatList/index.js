/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {getPropsMethod, instanceManager} from '@areslabs/wx-react'


const top = 80
Component({
    properties: {
        diuu: null,
        R: null,
    },

    attached() {
        instanceManager.setWxCompInst(this.data.diuu, this)
    },

    ready() {
        instanceManager.setWxCompInst(this.data.diuu, this)
        const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
        this.compInst = compInst

        const method = getPropsMethod(this, 'onRefresh');
        this.hasOnRefreshPassed = !!this.data.R.onRefreshPassed
        this.onRefreshMethod = method

        this.onScrollFunc = getPropsMethod(this, 'onScroll');
        this.onScrollEndDragFunc = getPropsMethod(this, 'onScrollEndDrag');

        this.hasChanges = []
        const infos = this.data.R.stickyInfos
        if (Array.isArray(infos) && infos.length > 0) {
            for (let k = 0; k < infos.length; k++) {
                this.hasChanges.push(false)
            }
        }
    },

    detached() {
        instanceManager.removeWxInst(this.data.diuu)
    },

    methods: {
        scrollTo(pos) {
            const {x, y} = pos;
            let mayY = this.hasOnRefreshPassed ? y + top : y
            this.setData({outTop: mayY, outLeft: x})
        },
        scrollToOffset(pos) {
            const {offset} = pos
            let mayY = this.hasOnRefreshPassed ? offset + top : offset
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

                const refreshing = (this.data._r || this.data.R).refreshing
                if (this.lastVal <= 80 && !refreshing) {
                    this.setData({
                        sr: false
                    });
                }
            }, 100)
        },

        outScroll(e) {
            this.lastVal = e.detail.scrollTop;
            if (this.hasOnRefreshPassed && !this.underTouch) {
                this.recoverRefresh()
            }

            // onScrollEndDrag 记录滚动事件，
            if (this.onScrollEndDragFunc) {
                this._scrollEvent = e
            }

            if (this.onScrollFunc) {
                this.onScrollFunc(this.formatEvent(e));
            }

            const stickyInfos = (this.data._r || this.data.R).stickyInfos
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
            const method = getPropsMethod(this, 'onScrollBeginDrag');
            method && method();
        },
        onScrollToupper() {
            this.lastVal = 0;
        },
        leaveTouch(e) {
            this.underTouch = false
            if (this._scrollEvent && this.onScrollEndDragFunc) {
                // 通过this._scrollEvent是否存在来判断触摸是不是滚动触摸
                this.onScrollEndDragFunc(this.formatEvent(this._scrollEvent));
                this._scrollEvent = undefined
            }


            if (!this.hasOnRefreshPassed) return

            //业务逻辑模拟，执行onRefresh
            if (this.lastVal < 20) {
                this.onRefreshMethod && this.onRefreshMethod();
                return;
            }
            //松手归位
            const refreshing = (this.data._r || this.data.R).refreshing
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
            // 当有刷新头的时候（默认向上滚80），也会触发onEndReached， 但是这一次不应该调用
            if (this.hasOnRefreshPassed && !this.hasRefreshFirstCall) {
                this.hasRefreshFirstCall = true
                return
            }

            if (!this.compInst.props.data) {
                return
            }

            const query = wx.createSelectorQuery().in(this)
            query.select('#container').boundingClientRect((res) => {
                const height = res.height
                if (this.lastHeight === height) return


                this.lastHeight = height
                const method = getPropsMethod(this, 'onEndReached')
                method && method()
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
})
