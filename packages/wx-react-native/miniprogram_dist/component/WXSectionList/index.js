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
        R: null
    },

    attached() {
        instanceManager.setWxCompInst(this.data.diuu, this)
    },

    ready() {
        instanceManager.setWxCompInst(this.data.diuu, this)
        const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
        this.compInst = compInst

        const method = getPropsMethod(this, "onRefresh");
        this.hasOnRefreshPassed = !!this.data.R.onRefreshPassed
        this.onRefreshMethod = method

        this.onScrollFunc = getPropsMethod(this, 'onScroll');
        this.onScrollEndDragFunc = getPropsMethod(this, 'onScrollEndDrag');

    },

    detached() {
        instanceManager.removeWxInst(this.data.diuu)
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
        },
        startTouch() {
            this.underTouch = true
            const method = getPropsMethod(this, "onScrollBeginDrag");
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
        onEndReached() {
            // 当有刷新头的时候（默认向上滚80），也会触发onEndReached， 但是这一次不应该调用
            if (this.hasOnRefreshPassed && !this.hasRefreshFirstCall) {
                this.hasRefreshFirstCall = true
                return
            }

            if (!this.compInst.props.sections) {
                return
            }

            if (this.compInst.props.sections === this.endReachedInvokeSections) {
                return
            }

            const method = getPropsMethod(this, 'onEndReached')
            method && method()
            this.endReachedInvokeSections = this.compInst.props.sections
        },
    },
    data: {
        withAni: false,
        outLeft: 0,
        sr: false
    }
})
