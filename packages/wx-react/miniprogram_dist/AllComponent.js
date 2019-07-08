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
                // 新增无状态节点，还未初始化，无状态节点的渲染数据由父节点管理，不过无状态节点需要调用updateUI 递归更新子节点
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

    forceUpdate(cb) {
        this.updateInner({}, cb, true)
    }

    setState(newState, cb) {
        this.updateInner(newState, cb, false)
    }

    updateInner(newState, cb, isForce) {
        // 还未渲染完成调用setState/forceUpdate，通常发生在willMount等处，此时把更新入队，在渲染结束的时候会统一检查一下这种情况的更新
        if (!(this instanceof HocComponent) && this.firstRender !== FR_DONE) {
            this.updateQueue.push(newState)
            cb && this.updateQueueCB.push(cb)
            if (isForce) {
                this.isForceUpdate = isForce
            }

            return
        }

        // 没有找到对应wxInst
        if (!(this instanceof HocComponent) && !this.getWxInst()) {
            console.warn(`the component has unmount, should not invoke ${isForce ? 'forceUpdate' : 'setState'}!!`)
            return
        }

        if (reactUpdate.inRe()) {
            this.updateQueue.push(newState)
            if (cb) {
                this.updateQueueCB.push(cb)
            }
            if (isForce) {
                this.isForceUpdate = isForce
            }
            reactUpdate.addUpdateInst(this)
            return
        }

        const nextState = {
            ...this.state,
            ...newState
        }

        let shouldUpdate
        if (isForce) {
            shouldUpdate = true
        } else if (this.shouldComponentUpdate) {
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

        /// 重置实例字段：_or 旧的渲染数据， _r 渲染数据， _c 所以孩子实例 ， __eventHanderMap 方法回调map

        this._or = this._r
        this._r = {}
        this._c = []
        this.__eventHanderMap = {}


        const parentContext = this._parentContext
        const context = getCurrentContext(this, parentContext)

        render(subVnode, this, context, this._r, this._or, '_r')

        this.flushDataToWx(subVnode, cb)
    }

    /**
     * render过程结束之后，各组件渲染数据已经生成完毕，执行updateUI递归的把数据刷新到小程序。
     * 此外：由于微信小程序自定义组件会生成一个节点，需要把内部最外层样式上报到这个节点
     */
    flushDataToWx(subVnode, finalCb) {
        const oldOutStyle = this._myOutStyle

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

/***
 * 由于alita默认处理的情况是 一个React组件 对应一个微信小程序组件。
 * Hoc的情况，会出现多个 React组件 对应一个微信小程序组件， 比如Hoc1(Hoc2(A)) 。HOC现阶段的处理如下：
 *
 *     Hoc1 -> Hoc2 -> A
 *      ↓             /
 *      ↓            /
 *      ↓           /
 *   实例对应       /
 *      ↓         /
 *      ↓        /
 *      ↓   wxA 渲染的数据
 *      ↓      /
 *      ↓     /
 *      ↓    /
 *      ↓   /
 *      ↓  /
 *      wxA
 *
 *  Hoc1的uuid 和wxA属性接收到的uuid 是一致的，所以在实例管理器中 Hoc1 和wxA是一对，但是Hoc1包裹Hoc2包裹A在运行结束时产生的_r 数据
 *  才是最终决定 wxA渲染的。
 *
 *  当 Hoc1， Hoc2 初始化的时候： getObjSubData会收集到A的数据，通过小程序属性_r 把数据传递到wxA
 *
 *  当 Hoc1， Hoc2 调用setState的时候：
 *      1. 执行在React过程
 *      2. 调用 this.updateUI
 *      3. updateUI的过程中会跳过HOC，直接到A
 *      4. A执行 getWxInst 方法 获取到wxA
 *      5. wxA 获取A的数据，更新
 */
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
