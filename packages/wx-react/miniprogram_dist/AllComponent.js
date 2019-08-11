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
import {
    getCurrentContext,
    DEFAULTCONTAINERSTYLE,
    setDeepData,
    HOCKEY,
    FR_DONE,
    FR_PENDING,
    recursionMount,
    EMPTY_FUNC,
    getRealOc,
    invokeWillUnmount
} from './util'
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
 * 然后 father.setData(allUiDes) 。 初始结束以后，father会去收集所有新产生的节点，统一调用一次 groupSetData把数据在刷给每一个子孙节点，
 * 这一次groupSetData 可以lazy调用吗？即和下一次setState合并，其实是可以的，这样的好处是节省了一次groupSetData。但是实际运行情况表明，这样
 * 做了以后，在FlatList里面存在这闪屏现象。 所以最终的方案还是初始结束以后，就刷数据给子孙节点
 *
 */
export class BaseComponent {
    getTopDiuu() {
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
        return diuu
    }

    /**
     * 当组件新产生的时候，获取刷数据的 目标小程序实例，数据路径
       需要考虑 自定义组件render返回null的时候，需要往回追溯
     *
     * @returns {*}
     */
    getTopWx() {
        if (this.isPageComp) {
            const diuu = this.getTopDiuu()
            compInst = instanceManager.getCompInstByUUID(diuu)
            return {
                comp: compInst,
                wx: this.getWxInst(),
                key: '_r'
            }
        }

        let compInst = this
        let wxParent = null
        let key = '_r'

        while (!wxParent) {
            const diuu = compInst.getTopDiuu()
            compInst = instanceManager.getCompInstByUUID(diuu)

            wxParent = compInst._p.getWxInst()
            key = key.replace('_r', compInst._keyPath + 'R')
            compInst = compInst._p
        }

        return {
            comp: compInst,
            wx: wxParent,
            key: key,
        }
    }


    getWxInst() {
        const diuu = this.getTopDiuu()
        return instanceManager.getWxInstByUUID(diuu)
    }

    /**
     * 页面组件初始渲染
     */
    firstUpdateWX() {
        const diuu = this.__diuu__
        const allData = getObjSubData(this._r)
        const wxInst = instanceManager.getWxInstByUUID(diuu)

        if (Object.keys(allData).length === 0) {
            recursionMount(this)
        } else {
            const start = Date.now()
            wxInst.setData({_r: allData}, () => {
                const firstReplaceRAllList = getRAllList(this)
                console.log('first duration:', Date.now() - start, this, allData)

                if (firstReplaceRAllList.length > 0) {
                    const start = Date.now()
                    wxInst.groupSetData(() => {
                        for(let i = 0; i < firstReplaceRAllList.length; i ++ ) {
                            const {inst, data} = firstReplaceRAllList[i]
                            inst.setData(data)
                        }

                        wxInst.setData({}, () => {
                            console.log('first replace duration:', Date.now() - start, firstReplaceRAllList)
                            recursionMount(this)
                        })
                    })
                } else {
                    recursionMount(this)
                }
            })
        }
    }


    /**
     * 刷新数据到小程序，使用 groupSetData 来优化多次setData
     * @param cb
     * @param styleUpdater 上报样式的updater
     */
    updateWX(cb, styleUpdater) {
        let updaterList = []

        // 可能会收集出重复的，所以使用set结构
        const firstReplaceRList = new Set()

        let gpr = null
        const groupPromise = new Promise((resolve) => {
            gpr = resolve
        })

        let frp = null
        const firstReplacePromise = new Promise((resolve) => {
            frp = resolve
        })

        this.updateWXInner(cb || EMPTY_FUNC, updaterList, groupPromise, firstReplaceRList, firstReplacePromise)

        if (styleUpdater) {
            updaterList.push(styleUpdater)
        }

        console.log('updaterList:', updaterList)
        if (updaterList.length === 0) {
            gpr()
            return
        }

        const topWX = styleUpdater ? styleUpdater.inst : this.getWxInst()

        if (firstReplaceRList.size > 0) {
            groupPromise.then(() => {
                const start = Date.now()
                topWX.groupSetData(() => {
                    firstReplaceRList.forEach(({inst ,data}) => {
                        inst.setData(data)
                    })

                    topWX.setData({}, () => {
                        console.log('update Replace duration:', Date.now() - start, firstReplaceRList)
                        frp()
                    })
                })
            })
        } else {
            frp()
        }

        topWX.groupSetData(() => {
            updaterList = simpleUpdaterList(updaterList)
            const start = Date.now()

            for(let i = 0; i < updaterList.length; i ++) {
                const {inst, data} = updaterList[i]
                inst.setData(data)
            }

            topWX.setData({}, () => {
                console.log('update duration:', Date.now() - start, updaterList)
                gpr()
            })
        })
    }

    /**
     * 递归程序。 主要做三个事情
     * 1. 构建出updaterList， 包含所有此次需要更新的微信实例 + 数据
     * 2. 构建出组件完成渲染的Promise 回调关系，方便didUpdate/didMount 等生命周期的正确执行
     * 3. 构建出firstReplaceRList，包含所有新节点，这些节点需要使用_r 替换R，以免闪屏
     *
     * @param doneCb
     * @param updaterList
     * @param groupPromise
     * @param firstReplaceRList
     * @param firstReplacePromise
     */
    updateWXInner(doneCb, updaterList, groupPromise, firstReplaceRList, firstReplacePromise) {
        const updatePros = []
        const children = this._c
        for (let i = 0; i < children.length; i++) {
            const childUuid = children[i]
            const child = instanceManager.getCompInstByUUID(childUuid)

            if (child.firstRender !== FR_DONE) {
                // 子节点还未初始化
                const allSubData = getObjSubData(child._r)

                if (Object.keys(allSubData).length === 0) {
                    recursionMount(child)
                    updatePros.push(P_R)
                } else {
                    const {wx, comp, key} = child.getTopWx()
                    updaterList.push({
                        inst: wx,
                        data: {
                            [key]: allSubData
                        }
                    })

                    addAllReplaceR(firstReplaceRList, getRAllList(comp))

                    const p = new Promise((resolve) => {
                        firstReplacePromise.then(() => {
                            console.log('recursionMount:', child)
                            recursionMount(child)
                            resolve()
                        })
                    })

                    updatePros.push(p)
                }
            } else if (child.shouldUpdate) {
                // 已经存在的节点更新数据
                const p = new Promise((resolve) => {
                    child.updateWXInner(resolve, updaterList, groupPromise, firstReplaceRList, firstReplacePromise)
                })
                updatePros.push(p)
            }
        }


        // 页面节点render null
        if (this.isPageComp && (Object.keys(this._r).length === 0)) {
            updaterList.push({
                inst: this.getWxInst(),
                data: {
                    _r: {}
                }
            })
            updatePros.push(groupPromise)
            Promise.all(updatePros)
                .then(() => {
                    doneCb()
                    this.componentDidUpdate && this.componentDidUpdate()
                })

            return
        }


        // HOC 组件不需要刷数据到 微信小程序，直接done!
        // this._r = {} 的节点 将会被销毁，直接done!
        if (this instanceof HocComponent || Object.keys(this._r).length === 0) {
            updatePros.push(P_R)
            Promise.all(updatePros)
                .then(() => {
                    doneCb()
                    this.componentDidUpdate && this.componentDidUpdate()
                })

            return
        }

        const wxInst = this.getWxInst()
        if (wxInst) {
            const cp = getChangePath(this._r, this._or)
            if (Object.keys(cp).length === 0) {
                updatePros.push(P_R)
            } else {
                updaterList.push({
                    inst: wxInst,
                    data: cp
                })
                updatePros.push(groupPromise)
            }
        } else {
            // 自定义组件在上一次的render中，返回了null
            const {wx, key, comp} = this.getTopWx()
            updaterList.push({
                inst: wx,
                data: {
                    [key]: {...this._r} // 需要展开，以免_r 被污染
                }
            })

            addAllReplaceR(firstReplaceRList, getRAllList(comp))
            updatePros.push(groupPromise)
        }

        this._or = {}

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
        if (subVnode && subVnode.isReactElement) {
            subVnode.isFirstEle = true
        }

        /// 重置实例字段：_or 旧的渲染数据， _r 渲染数据， _c 所以孩子实例 ， __eventHanderMap 方法回调map

        this._or = this._r
        this._r = {}
        const oc = this._c
        this._c = []
        this.__eventHanderMap = {}


        const parentContext = this._parentContext
        const context = getCurrentContext(this, parentContext)

        const oldChildren = []
        render(subVnode, this, context, this._r, this._or, '_r', oldChildren)

        getRealOc(oc, this._c, oldChildren)

        invokeWillUnmount(oldChildren)

        // firstRender既不是DONE，也不是PENDING，此时调用setState需要刷新_r数据
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

        let newOutStyle = null
        if (subVnode === null || subVnode === undefined || typeof subVnode === 'boolean') {
            newOutStyle = false
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
                if (pp.isPageComp || !p._isFirstEle || p._TWFBStylePath) {
                    const stylePath = p._TWFBStylePath || `${p._keyPath}style`
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


function getRAllList(inst) {
    const descendantList = []
    recursionCollectChild(inst, descendantList)
    return descendantList
}

function recursionCollectChild(inst, descendantList) {
    const children = inst._c
    for (let i = 0; i < children.length; i++) {
        const childUuid = children[i]
        const child = instanceManager.getCompInstByUUID(childUuid)

        recursionCollectChild(child, descendantList)
    }

    if (inst instanceof HocComponent) {
        return
    }

    if (Object.keys(inst._r).length === 0) {
        return
    }

    if (inst._myOutStyle === false) {
        return
    }

    const wxInst = inst.getWxInst()
    if (wxInst.data._r && !inst.isPageComp) {
        return
    }

    descendantList.unshift({
        inst: wxInst,
        data: {
            ...inst._r
        }
    })
}


function simpleUpdaterList(list) {

    const instMap = new Map()
    const simpleList = []

    for(let i = list.length - 1; i >= 0; i --) {
        const item = list[i]
        const {inst, data} = item

        if (instMap.has(inst)) {
            Object.assign(simpleList[instMap.get(inst)].data, data)
        } else {
            simpleList.push({
                inst,
                data
            })
            instMap.set(inst, simpleList.length - 1)
        }
    }

    return simpleList
}


function addAllReplaceR(rSet, nrList) {
    nrList.forEach(item => {
        rSet.add(item)
    })
}


