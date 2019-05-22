/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import instanceManager from "./InstanceManager";
import render from "./render";
import getChangePath from "./getChangePath";
import {getCurrentContext, DEFAULTCONTAINERSTYLE, setDeepData, HOCKEY, FR_DONE, recursionMount} from './util'
import reactUpdate from './ReactUpdate'
import shallowEqual from './shallowEqual'
import getObjSubData from './getObjSubData'

export class BaseComponent {
    getWxInst() {
        let diuu = null

        if (this.hocWrapped) {
            let p = this._p
            while (p.hocWrapped) {
                p = p._p
            }

            diuu = p.__diuu__
        } else {
            diuu = this.__diuu__
        }

        const wxInst = instanceManager.getWxInstByUUID(diuu)
        return wxInst
    }


    updateUI(cb) {
        const cbPros = []


        // 先渲染children
        const children = this._c
        for (let i = 0; i < children.length; i++) {
            const childUuid = children[i]
            const child = instanceManager.getCompInstByUUID(childUuid)

            //TODO child.firstRender !== FR_DONE的新节点，状态应该也托管给父，通过父的setData来设置

            if (child.firstRender !== FR_DONE && !child.stateless) {
                // 一般而言 hocWrapped 都会在外层firstUpdateUI的过程中 状态就会变成FR_DONE，
                // 这里状态不是FR_DONE 只有一种情况，就是在HOC里面调用了setState新产生的节点， 由于外层
                // firstUpdateUI只会触发一次， 所以这里需要调用updateUI
                if (child.hocWrapped) {
                    const p = new Promise(function (resolve) {
                        child.updateUI(resolve)
                    })

                    cbPros.push(p)
                    continue
                }


                // 新增有状态节点，还未初始化， 此节点的firstUpdateUI过程，将会处理其子节点的渲染，结束会调用firstRenderRes
                const p = new Promise(function (resolve) {
                    child.firstRenderRes = resolve
                })
                cbPros.push(p)
            } else if (child.firstRender !== FR_DONE && child.stateless) {
                // 新增无状态节点， 还未初始化，
                const p = new Promise(function (resolve) {
                    child.updateUI(resolve)
                })

                cbPros.push(p)
            } else if (child.shouldUpdate) {
                // 已经存在节点
                const p = new Promise(function (resolve) {
                    child.updateUI(resolve)
                })

                cbPros.push(p)
            }
        }
        
        // HOC 和stateless 本身不会setData刷数据， 其中stateless是为了减少setData做的优化
        if (this.stateless || this instanceof HocComponent) {
            Promise.all(cbPros).then(() => {
                cb && cb()
                if (this.firstRender === FR_DONE) {
                    this.componentDidUpdate && this.componentDidUpdate()
                } else {
                    this.firstRender = FR_DONE
                    this.componentDidMount && this.componentDidMount()
                }
            })
            return
        }

        const cp = getChangePath(this._r, this._or)

        if (Object.keys(cp).length === 0) {
            Promise.all(cbPros).then(() => {
                cb && cb()

                if(this.hocWrapped && this.firstRender !== FR_DONE) {
                    this.firstRender = FR_DONE
                    this.componentDidMount && this.componentDidMount()
                } else {
                    this.componentDidUpdate && this.componentDidUpdate()
                }
            })
            return
        }

        const wxInst = this.getWxInst()
        if (!wxInst) {
            console.warn('miniprogram instance not exist， update error! ', this)
            cb && cb()
            return
        }

        wxInst.setData(cp, () => {
            Promise.all(cbPros).then(() => {
                cb && cb()

                if(this.hocWrapped && this.firstRender !== FR_DONE) {
                    this.firstRender = FR_DONE
                    this.componentDidMount && this.componentDidMount()
                } else {
                    this.componentDidUpdate && this.componentDidUpdate()
                }
            })
        })
    }


    firstUpdateUI() {
        const diuu = this.__diuu__
        const allData = getObjSubData(this._r)
        const wxInst = instanceManager.getWxInstByUUID(diuu)

        if (Object.keys(allData).length === 0) {
            recursionMount(this)
        } else {
            wxInst.setData({_r: allData}, () => {
                recursionMount(this)
            })
        }
    }
}

export class CPTComponent extends BaseComponent {
}

export class FuncComponent extends BaseComponent {
    constructor(props, context) {
        super()
        this.props = props
        this.context = context
    }
}

export class Component extends BaseComponent {
    constructor(props, context) {
        super()
        this.props = props
        this.context = context

        this.updateQueue = []
        this.updateQueueCB = []
    }

    //TODO
    forceUpdate() {
        console.warn('forceUpdate not support yet!')
    }

    setState(newState, cb) {
        if (!(this instanceof HocComponent) && this.firstRender !== FR_DONE) {
            this.updateQueue.push(newState)
            cb && this.updateQueueCB.push(cb)

            return
        }

        if (!(this instanceof HocComponent) && !this.getWxInst()) {
            console.warn('the component has unmount, should not invoke setState!!')
            return
        }


        if (reactUpdate.inRe()) {
            this.updateQueue.push(newState)
            if (cb) {
                this.updateQueueCB.push(cb)
            }
            reactUpdate.addUpdateInst(this)
            return
        }


        const nextState = {
            ...this.state,
            ...newState
        }

        let shouldUpdate
        if (this.shouldComponentUpdate) {
            shouldUpdate = this.shouldComponentUpdate(this.props, nextState)
        } else {
            shouldUpdate = true
        }

        shouldUpdate && this.componentWillUpdate && this.componentWillUpdate(this.props, nextState)
        shouldUpdate && this.UNSAFE_componentWillUpdate && this.UNSAFE_componentWillUpdate(this.props, nextState)


        this.state = nextState

        if (!shouldUpdate) {
            return // do nothing
        }


        const subVnode = this.render()
        this._or = this._r
        this._r = {}
        this._c = []
        this.__eventHanderMap = {}

        const parentContext = this._parentContext
        const context = getCurrentContext(this, parentContext)

        const oldOutStyle = this._myOutStyle
        render(subVnode, this, context, this._r, this._or, '_r')

        let finalCb = null
        // 合并之后的setState
        if (this.updateQueueCB.length > 0) {
            const cbQueue = this.updateQueueCB
            finalCb = () => {
                for (let i = 0; i < cbQueue.length; i++) {
                    cbQueue[i].call(this)
                }
            }
            this.updateQueueCB = []
        } else {
            finalCb = cb
        }

        // Page Comp 不需要上报样式
        if (this.isPageComp) {
            this.updateUI(finalCb)
            return
        }

        let newOutStyle = ''
        if (subVnode === null || subVnode === undefined || typeof subVnode === 'boolean') {
            newOutStyle = 'display: none;'
            this._myOutStyle = newOutStyle
        } else {
            const {diuu} = subVnode
            const styleKey = `${diuu}style`
            newOutStyle = this._r[styleKey]

            this._myOutStyle = newOutStyle
            this._r[styleKey] = DEFAULTCONTAINERSTYLE
        }


        this.updateUI(finalCb)

        // 如果setState之后 outStyle发生变化， 则需要上报到父（可能需要多次上报）
        if (oldOutStyle !== newOutStyle) {
            // 更新父包裹

            let p = this

            /* eslint-disable-next-line */
            while (true) {
                const pp = p._p
                if (pp.isPageComp || !p._isFirstEle) {
                    const stylePath = p._stylePath
                    setDeepData(pp, newOutStyle, stylePath)

                    const diuu = pp.__diuu__
                    const wxInst = instanceManager.getWxInstByUUID(diuu)
                    wxInst.setData({
                        [stylePath]: newOutStyle
                    })

                    return
                }

                p = p._p
            }
        }
    }
}

export class PureComponent extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(shallowEqual(nextProps, this.props) && shallowEqual(nextState, this.state))
    }
}

export class HocComponent extends Component {
    constructor(props, context) {
        super(props, context)

        this.hocProps = {
            diuu: HOCKEY
        }

    }

    getWxInst() {
        return null
    }

    hocClear() {
        console.warn('now ! hocClear 不再需要主动调用，系统会调用')
    }
}

export class RNBaseComponent {
}
