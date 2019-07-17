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
import {getCurrentContext, DEFAULTCONTAINERSTYLE, setDeepData, HOCKEY, FR_DONE, FR_PENDING, recursionMount, EMPTY_FUNC} from './util'
import reactUpdate from './ReactUpdate'
import shallowEqual from './shallowEqual'
import getObjSubData from './getObjSubData'


const P_R =  Promise.resolve()

/**
 * 出于对性能的考虑，我们希望react层和小程序层数据交互次数能够近可能的少。比如如下的情形：
 *        Father
 *       /  |   \
 *      /   |    \
 *     /    |     \
 *   son1  son2   son3
 *
 * 当父组件Father setState 引起 son1，son2，son3 UI发生改变的时候， 这3个组件增量的uiDes描述数据，需要传递到对应的小程序组件上，最不理想
 * 情况是react层和小程序层交互3次，最初版本的alita（包括1.0.2版本以前）的确是这么做的。 自小程序2.4.0版本提供groupSetData之后，小程序提供了
 * 批量设置数据的功能。现在我们可以通过类似如下的代码来批量的设置小程序数据
 *    father.groupSetData(() => {
 *          son1.setData(uiDes1)
 *          son2.setData(uiDes2)
 *          son3.setData(uiDes3)
 *    })
 * 也就是说在更新的时候，我们利用groupSetData 可以做到本质上只交互一次。
 *
 * 下面我们在考虑一下Father组件初始建立的过程： Father初始的时候，在wxFather（Father组件对应的小程序组件实例，这里暂时称为wxFather）的ready
 * 声明周期里，调用了 wxFather.setData(uiDes)，完成之后，分别会触发wxSon1, wxSon2, wxSon3的 ready 并调用setData设置数据。 这里会调用4次setData，
 * 我们有办法通过groupSetData，批量设置这里的数据吗？比较麻烦，不能简单的通过上面的方式使用groupSetData，因为只有当wxFather设置数据结束之后，son才有
 * 机会ready
 * 所以，alita先阶段采用的方案是：在组件初始阶段，会先构造出所有uiDes数据，包括子组件，孙组件等等
 *     const allUiDes = {
 *           ... // fatherUiDes
 *
 *           son1R: {
 *               ... // son1UiDes
 *           },
 *
 *           son2R: {
 *               ... // son2UiDes
 *           },
 *
 *           son3R: {
 *               ... // son3UiDes
 *           }
 *     }
 * 然后 father.setData(allUiDes) 。 初始结束以后，father组件不再持有子组件数据，以后的更新将通过groupSetData方式。
 *
 */
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

        return instanceManager.getWxInstByUUID(diuu)
    }

    /**
     * 组件初始渲染
     */
    firstUpdateUI() {
        const diuu = this.__diuu__
        const allData = getObjSubData(this._r)
        const wxInst = instanceManager.getWxInstByUUID(diuu)

        console.log('first wow:', allData, this)
        if (Object.keys(allData).length === 0) {
            recursionMount(this)
        } else {
            wxInst.setData({_r: allData}, () => {
                recursionMount(this)
            })
        }
    }


    /**
     * 刷新数据到小程序
     * @param cb
     * @param styleUpdater 上报样式的updater
     */
    updateWX(cb, styleUpdater) {
        const updaterList = []

        let gpr = null
        const groupPromise = new Promise((resolve) => {
            gpr = resolve
        })

        this.updateWXInner(cb || EMPTY_FUNC, updaterList, groupPromise)

        if (styleUpdater) {
            updaterList.push(styleUpdater)
        }

        /// groupSetData 来优化多次setData

        const topWX = styleUpdater ? styleUpdater.inst : this.getWxInst()
        let hasGprAdd = false
        topWX.groupSetData(() => {
            console.log('update wow:', updaterList)
            for(let i = 0; i < updaterList.length; i ++ ) {
                const {inst, data} = updaterList[i]
                if (!hasGprAdd) {
                    hasGprAdd = true
                    inst.setData(data, gpr)
                } else {
                    inst.setData(data)
                }
            }
        })
    }

    /**
     * 递归程序。 主要做两个事情
     * 1. 构建出updaterList， 包含所以需要更新的微信实例/数据
     * 2. 构建出组件完成渲染的Promise 回调关系，方便didUpdate/didMount 生命周期的正确执行
     *
     * //TODO 由于小程序groupSetData的合并， Object.keys(cp).length === 0 的判断是否还有必要？
     * @param doneCb
     * @param updaterList
     * @param groupPromise
     */
    updateWXInner(doneCb, updaterList, groupPromise) {
        const updatePros = []
        const updateObj = {}
        const children = this._c
        for (let i = 0; i < children.length; i++) {
            const childUuid = children[i]
            const child = instanceManager.getCompInstByUUID(childUuid)

            if (child.firstRender !== FR_DONE && child.hocWrapped) {
                const allSubData = getObjSubData(child._r)
                const wxInst = child.getWxInst()

                // HOC 多次嵌套的情况，allSubData可能是{}
                if (Object.keys(allSubData).length === 0) {
                    recursionMount(child)
                    updatePros.push(P_R)
                } else {
                    updaterList.push({
                        inst: wxInst,
                        data: {
                            _r: allSubData
                        }
                    })

                    const p = new Promise(resolve => {
                        groupPromise.then(() => {
                            recursionMount(child)
                            resolve()
                        })
                    })
                    updatePros.push(p)
                }
            } else if (child.firstRender !== FR_DONE && !child.hocWrapped) {
                updateObj[`${child._keyPath}R`] = getObjSubData(child._r)

                const p = new Promise(resolve => {
                    groupPromise.then(() => {
                        recursionMount(child)
                        resolve()
                    })
                })
                updatePros.push(p)
            } else if (child.shouldUpdate) {
                // 已经存在的节点更新数据
                const p = new Promise((resolve) => {
                    child.updateWXInner(resolve, updaterList, groupPromise)
                })
                updatePros.push(p)
            }
        }


        // HOC 组件不需要刷数据到 微信小程序， 直接done!
        if (this instanceof HocComponent) {
            updatePros.push(P_R)
            Promise.all(updatePros)
                .then(() => {
                    doneCb()
                    this.componentDidUpdate && this.componentDidUpdate()
                })

            return
        }


        const cp = getChangePath(this._r, this._or)
        Object.assign(cp, updateObj)
        if (Object.keys(cp).length === 0) {
            updatePros.push(P_R)
        } else {
            updaterList.push({
                inst: this.getWxInst(),
                data: cp
            })
            updatePros.push(groupPromise)
        }

        Promise.all(updatePros)
            .then(() => {
                doneCb()
                this.componentDidUpdate && this.componentDidUpdate()
            })
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
        // 在firstUpdate 接受到小程序的回调之前，如果组件调用setState 可能会丢失！
        if (this.firstRender === FR_PENDING) {
            console.warn('组件未准备好调用setState，状态可能会丢失！')
            return
        }

        // willMount之前的setState
        if (!this.willMountDone) {
            this.state = {
                ...this.state,
                ...newState,
            }
            return
        }

        // 没有找到对应wxInst
        if (!this.getWxInst()) {
            console.warn(`wxInst should not null, please create an issue!`)
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

        // 一般发生于didFoucs里面的setState，此时还未调用firstUpdate
        if (this.firstRender !== FR_DONE) {
            return
        }

        this.flushDataToWx(subVnode, cb)
    }

    /**
     * render过程结束之后，各组件渲染数据已经生成完毕，执行updateWX递归的把数据刷新到小程序。
     * 此外：由于微信小程序自定义组件会生成一个节点，需要把内部最外层样式上报到这个节点
     */
    flushDataToWx(subVnode, finalCb) {
        const oldOutStyle = this._myOutStyle

        if (this.isPageComp) {
            this.updateWX(finalCb)
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

        // 如果setState之后 outStyle发生变化， 则需要上报到父（可能需要多次上报）
        if (oldOutStyle !== newOutStyle) {

            let p = this

            /* eslint-disable-next-line */
            while (true) {
                const pp = p._p
                if (pp.isPageComp || !p._isFirstEle) {
                    const stylePath = `${p._keyPath}style`
                    setDeepData(pp, newOutStyle, stylePath)

                    const diuu = pp.__diuu__
                    const wxInst = instanceManager.getWxInstByUUID(diuu)

                    this.updateWX(finalCb, {
                        inst: wxInst,
                        data: {
                            [stylePath]: newOutStyle
                        }
                    })

                    return
                }
                p = p._p
            }
        } else {
            this.updateWX(finalCb)
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
 *  Hoc1的uuid 和wxA属性接收到的uuid 是一致的，所以在实例管理器中 Hoc1 和wxA是一对，但是Hoc1包裹Hoc2包裹A在运行结束时产生的uiDes 数据
 *  才是最终决定 wxA渲染的。
 *
 *  当 Hoc1， Hoc2 初始化的时候： getObjSubData会收集到A的数据，通过小程序属性_r 把数据传递到wxA
 *
 *  当 Hoc1， Hoc2 调用setState的时候：
 *      1. 执行在React过程
 *      2. 调用 this.updateWX
 *      3. updateWX的过程中会跳过HOC，直接到A
 *      4. A把数据传递给wxA，更新UI
 */
export class HocComponent extends Component {
    constructor(props, context) {
        super(props, context)

        this.hocProps = {
            diuu: HOCKEY
        }

    }
}

export class RNBaseComponent {
}
