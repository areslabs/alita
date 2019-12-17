/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import instanceManager from './InstanceManager'
import geneUUID from './geneUUID'
import tackleWithStyleObj from './tackleWithStyleObj'
import { DEFAULTCONTAINERSTYLE, filterContext, getCurrentContext, ReactWxEventMap, getRealOc} from './util'
import { CPTComponent, FuncComponent, RNBaseComponent, HocComponent } from './AllComponent'

import {UPDATE_EFFECT, INIT_EFFECT, UpdateState, ForceUpdate, mpRoot} from './constants'
import {rnvcReportExistStyle, rnvcReportStyle, rReportExistStyle, rReportStyle} from './reportStyle'
import {enqueueEffect} from './effect'

import {unstable_batchedUpdates, oldChildren} from './UpdateStrategy'

export function renderNextValidComps(inst) {
    if (inst.didSelfUpdate) {
        // setState / forceUpdate 的节点，将会被设置didSelfUpdate

        const {hasForceUpdate, nextState, callbacks} = processUpdateQueue(inst)

        // renderNextValidComps 方法里面的更新，props不会变化，props的变化的更新都属于render
        const shouldUpdate = checkShouldComponentUpdate(inst, hasForceUpdate, inst.props, nextState)

        shouldUpdate && inst.componentWillUpdate && inst.componentWillUpdate(inst.props, nextState)
        shouldUpdate && inst.UNSAFE_componentWillUpdate && inst.UNSAFE_componentWillUpdate(inst.props, nextState)

        inst.state = nextState

        const effect = {}
        if (!shouldUpdate) {
            if (inst.didChildUpdate) {
                for(let i = 0; i < inst._c.length; i ++ ) {
                    const child = inst._c[i]
                    renderNextValidComps(child)
                }

                rnvcReportExistStyle(inst)
            }

            inst.didChildUpdate = false
            inst.didSelfUpdate = false
            return
        }
        effect.tag = UPDATE_EFFECT
        effect.callbacks = callbacks
        effect.inst = inst
        enqueueEffect(effect)

        const oc = inst._c
        resetInstProps(inst)


        const subVnode = inst.render()
        if (subVnode && subVnode.isReactElement) {
            subVnode.isFirstEle = true

            inst._styleKey = `${subVnode.diuu}style`
        } else {
            inst._styleKey = undefined
        }

        const context = getCurrentContext(inst, inst._parentContext)
        render(subVnode, inst, context, inst._r, inst._or, '_r')

        getRealOc(oc, inst._c, oldChildren)

        rnvcReportStyle(inst, effect)

        inst.didChildUpdate = false
        inst.didSelfUpdate = false
    } else if (inst.didChildUpdate) {
        for(let i = 0; i < inst._c.length; i ++ ) {
            const child = inst._c[i]
            renderNextValidComps(child)
        }

        rnvcReportExistStyle(inst)

        inst.didChildUpdate = false
        inst.didSelfUpdate = false
    }
}

/**
 * 转化引擎的核心渲染函数， 负责把React结构渲染成中间态的数据和结构
 * @param vnode
 * @param parentInst
 * @param parentContext
 * @param data
 * @param oldData
 * @param dataPath
 */
export default function render(vnode, parentInst, parentContext, data, oldData, dataPath) {

    try {
        if (Array.isArray(vnode)) {
            console.warn('小程序暂不支持渲染数组！')
            return
        }

        if (typeof vnode === 'string'
            || typeof vnode === 'number'
            || typeof vnode === 'boolean'
            || vnode === null
            || vnode === undefined
            || vnode === 'slot'
        ) {
            return
        }

        const {ref, nodeName, tempName} = vnode

        if (typeof ref === "string") {
            console.warn('ref 暂时只支持函数形式!')
        }

        if (data && tempName) {
            data.tempName = tempName
        }

        if (nodeName === 'view' || nodeName === 'block' || nodeName === 'image') {
            updateBaseView(vnode, parentInst, parentContext, data, oldData, dataPath)
        } else if (nodeName === 'template') {
            updateTemplate(vnode, parentInst, parentContext, data, oldData, dataPath)
        } else if (nodeName === 'phblock') {
            updatePhblock(vnode, parentInst, parentContext, data, oldData, dataPath)
        } else if (typeof nodeName === 'string' && nodeName.endsWith('CPT')) {
            updateCPTComponent(vnode, parentInst, parentContext, data, oldData, dataPath)
        } else if (nodeName.prototype && Object.getPrototypeOf(nodeName) === FuncComponent) {
            updateFuncComponent(vnode, parentInst, parentContext, data, oldData, dataPath)
        } else if (nodeName.prototype && Object.getPrototypeOf(nodeName) === RNBaseComponent) {
            updateRNBaseComponent(vnode, parentInst, parentContext, data, oldData, dataPath)
        } else if (typeof nodeName === 'function') {
            updateClassComponent(vnode, parentInst, parentContext, data, oldData, dataPath)
        } else  {
            //TODO waring重构
            if(vnode.__source) {
                console.error(`${vnode.__source.fileName} 存在形式<XX/> 其中XX是${vnode.nodeName}！请排查`)
            }
        }
    } catch (e) {
        console.error(e)
    }
}

/**
 * 事件回调/组件生命周期 出现的更新（setState）需要合并
 * @param func
 * @returns {function(...[*]=): *}
 */
function reactEnvWrapper(func) {
    return function(...args) {
        unstable_batchedUpdates(() => {
            func.apply(this, args)
        })
    }
}

function getDiuuAndShouldReuse(vnode, oldData) {
    const { key, nodeName, isTempMap } = vnode

    const diuuKey = vnode.diuu
    if (!oldData) {
        return {
            diuu: '',
            diuuKey,
            shouldReuse: false
        }
    }

    let diuu = null
    let shouldReuse = false

    // 如果是map 返回的最外层元素， 需要判断是否可以复用。
    // 由于key的存在， 可能出现diuu获取的实例并非nodeName类型的情况
    if (key !== undefined && oldData && isTempMap) {
        const od = oldData.diuu
        diuu = oldData[od]

        const inst = instanceManager.getCompInstByUUID(diuu)

        if (!diuu) {
            // TODO 考虑phblock的情况， 这种情况需要把FlatList等key，赋值给phblock
            shouldReuse = false
        } else if (!inst && (nodeName === 'view' || nodeName === 'block' || nodeName === 'image')) {
            // 前后都是view/image/blcok
            shouldReuse = true
        } else if (inst && inst instanceof CPTComponent && typeof nodeName === 'string' && nodeName.endsWith('CPT')) {
            // 前后都是cpt
            shouldReuse = true
        } else if (inst && typeof nodeName === 'function' && inst instanceof nodeName) {
            shouldReuse = true
        }
    }

    // TODO <A/> 是否考虑A是变量的情况， 如果考虑 这里也应该判断类型
    if (!isTempMap && oldData) {
        diuu = oldData[diuuKey]
        shouldReuse = !!diuu
    }

    return {
        diuu,
        diuuKey,
        shouldReuse
    }
}

function getKeyDataMap(arr, key) {
    const r = {}
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        const fkey = (item[key] === undefined ? `index_${i}` :  item[key])
        r[fkey] = item
    }
    return r
}


function shouldReuseButInstNull(vnode) {
    console.warn('未知原因导致React 实例丢失， please create an issue! 错误节点：', vnode)
}

function sovleNumberOfLines (newVal){
    if (newVal == null) { return ""}

    return "overflow:hidden;display: -webkit-box;;text-overflow:ellipsis;-webkit-line-clamp:"+newVal+";-webkit-box-orient: vertical; word-wrap:break-word;"
}


function resizeMode(newVal){
    if(newVal === 'cover'){
        return 'aspectFill';
    } else if (newVal === 'contain'){
        return 'aspectFit';
    } else if (newVal === 'stretch'){
        return 'scaleToFill';
    } else if (newVal === 'repeat') {
        console.warn('Image的resizeMode属性小程序端不支持repeat')
        return 'aspectFill'
    } else if (newVal === 'center') {
        return 'aspectFill'
    } else{
        return 'aspectFill';
    }
}


function activeOpacityHandler(v) {
    const opa = Math.round(v * 10)
    return `touchableOpacity${opa}`
}


function processUpdateQueue(inst) {
    if (!inst.updateQueue || inst.updateQueue.length === 0) {
        return {
            hasForceUpdate: false,
            nextState: inst.state,
            callbacks: undefined
        }
    }

    let hasForceUpdate = false
    const callbacks = []
    const preState = Object.assign({}, inst.state)
    let hasStateChange = false
    for(let i = 0; i < inst.updateQueue.length; i ++ ) {
        const update = inst.updateQueue[i]

        if (update.tag === UpdateState) {
            const payload = update.payload
            if (typeof payload === 'function') {
                const partState = payload.call(inst, preState)
                Object.assign(preState, partState)
            }

            if (typeof payload === 'object') {
                Object.assign(preState, payload)
            }

            hasStateChange = true
        } else if (update.tag === ForceUpdate) {
            hasForceUpdate = true
        }

        if (update.callback && typeof update.callback === 'function') {
            callbacks.push(update.callback)
        }
    }

    inst.updateQueue = []

    return {
        hasForceUpdate,
        callbacks: callbacks.length > 0 ? callbacks : undefined,
        nextState: hasStateChange ? preState : inst.state
    }
}

function checkShouldComponentUpdate(inst, hasForceUpdate, nextProps, nextState) {
    let shouldUpdate
    if (hasForceUpdate) {
        shouldUpdate = true
    } else if (inst.shouldComponentUpdate) {
        shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState)
    } else {
        shouldUpdate = true
    }

    return shouldUpdate
}

// 某些实例属性的重置
function resetInstProps(inst) {
    inst._or = inst._r

    // ui des
    inst._r = {}

    // children 重置， render过程的时候重新初始化， 因为children的顺序关系着渲染的顺序， 所以这里应该需要每次render都重置
    inst._c = []

    // text /button 等基本组件 事件回调存放在 __eventHanderMap字段
    inst.__eventHanderMap = {}
}

/**
 * 函数组件，有context， 没有生命周期， 没有setState
 */
function updateFuncComponent(vnode, parentInst, parentContext, data, oldData, dataPath) {
    const {animation, nodeName, props, diuu: vnodeDiuu} = vnode

    let {diuu, diuuKey, shouldReuse} = getDiuuAndShouldReuse(vnode, oldData)
    let inst = null

    const effect = {}
    if (shouldReuse) {
        // 复用组件实例
        inst = instanceManager.getCompInstByUUID(diuu)
        if (!inst) {
            shouldReuseButInstNull(vnode)
            return
        }

        data[diuuKey] = diuu

        inst.props = props
        inst.context = filterContext(nodeName, parentContext)

        parentInst._c.push(inst)

        effect.tag = UPDATE_EFFECT
        effect.inst = inst
        enqueueEffect(effect)
    } else {
        const myContext = filterContext(nodeName, parentContext)
        inst = new nodeName(props, myContext)

        let instUUID
        if (parentInst === mpRoot) {
            instUUID = vnodeDiuu
            inst.isPageComp = true
        } else {
            instUUID = geneUUID()
            data[diuuKey] = instUUID
        }

        inst.__diuu__ = instUUID

        parentInst._c.push(inst)
        inst._p = parentInst // parent

        if (parentInst instanceof HocComponent) {
            inst.hocWrapped = true
            // 防止样式上报到HOC
            if (parentInst.isPageComp) {
                inst.isPageComp = true
            }
        }


        instanceManager.setCompInst(instUUID, inst)

        effect.tag = INIT_EFFECT
        effect.inst = inst
        enqueueEffect(effect)
    }


    const oc = inst._c
    resetInstProps(inst)

    const subVnode = inst.render()
    if (subVnode && subVnode.isReactElement) {
        subVnode.isFirstEle = true

        inst._styleKey = `${subVnode.diuu}style`
    } else {
        inst._styleKey = undefined
    }
    // 当组件往外层上报样式的时候，通过keyPath 确定数据路径
    inst._outStyleKey = `${dataPath}.${vnodeDiuu}style`

    const context = getCurrentContext(inst, parentContext)
    render(subVnode, inst, context, inst._r, inst._or, '_r')

    getRealOc(oc, inst._c, oldChildren)

    // 动画相关
    if (animation) {
        data[`${vnodeDiuu}animation`] = animation
    }

    rReportStyle(inst, effect)

    inst.didChildUpdate = false
    inst.didSelfUpdate = false
}

/**
 * 抽象组件节点， 处理属性是xxComponent/children的情况
 */
function updateCPTComponent(vnode, parentInst, parentContext, data, oldData, dataPath) {
    const {CPTVnode: subVnode, diuu: vnodeDiuu} = vnode
    let {diuu, diuuKey, shouldReuse} = getDiuuAndShouldReuse(vnode, oldData)

    const effect = {}
    let inst = null
    if (shouldReuse) {
        inst = instanceManager.getCompInstByUUID(diuu)
        if (!inst) {
            shouldReuseButInstNull(vnode)
            return
        }

        parentInst._c.push(inst)
        effect.tag = UPDATE_EFFECT
        effect.inst = inst
        enqueueEffect(effect)
    } else {
        inst = new CPTComponent()

        diuu = geneUUID()
        inst.__diuu__ = diuu

        parentInst._c.push(inst)
        inst._p = parentInst


        instanceManager.setCompInst(diuu, inst)

        effect.tag = INIT_EFFECT
        effect.inst = inst
        enqueueEffect(effect)
    }
    data[diuuKey] = diuu

    const oc = inst._c
    resetInstProps(inst)

    if (subVnode && subVnode.isReactElement) {
        subVnode.isFirstEle = true

        inst._styleKey = `${subVnode.diuu}style`
    } else {
        inst._styleKey = undefined
    }
    // 当组件往外层上报样式的时候，通过keyPath 确定数据路径
    inst._outStyleKey = `${dataPath}.${vnodeDiuu}style`

    render(subVnode, inst, parentContext, inst._r, inst._or, '_r')

    getRealOc(oc, inst._c, oldChildren)

    rReportStyle(inst, effect)
    inst.didChildUpdate = false
    inst.didSelfUpdate = false
}

/**
 * //TODO RN base 是否需要实例？？
 * RN base 组件的渲染，RN base组件的渲染逻辑提前已知，可以预先对应好，出于两方面的考虑
 * 1. 预先对应好 对base组件 有更强的控制能力
 * 2. 由于现在的数据交换方式， 预先对应可以节省一次setData数据交换。
 * RN base 是预先对应好数据的，不产生effect
 */
function updateRNBaseComponent(vnode, parentInst, parentContext, data, oldData, dataPath) {
    const {nodeName, props, animation, ref, diuu: vnodeDiuu, children} = vnode
    let {diuu, diuuKey, shouldReuse} = getDiuuAndShouldReuse(vnode, oldData)

    let inst = null
    if (shouldReuse) {
        inst = instanceManager.getCompInstByUUID(diuu)

        if (!inst) {
            shouldReuseButInstNull(vnode)
            return
        }

        inst.props = {}
    } else {
        inst = new nodeName()
        inst.props = {}
        diuu = geneUUID()
        inst.__diuu__ = diuu
        instanceManager.setCompInst(diuu, inst)
    }

    // 设置uuid绑定
    data[diuuKey] = diuu

    const allKeys = Object.keys(props)
    for (let i = 0; i < allKeys.length; i++) {
        const k = allKeys[i]
        const v = props[k]

        if (k === 'children') continue

        // nodeName === WXScrollView
        if (k === 'refreshControl') {
            const {refreshing = false, onRefresh} = v.props

            data[`${diuuKey}refreshing`] = refreshing

            if (onRefresh) {
                data[`${diuuKey}onRefreshPassed`] = true
                inst.props.onRefresh = reactEnvWrapper(onRefresh)
            } else {
                data[`${diuuKey}onRefreshPassed`] = false
            }
        } else if (typeof v === 'function') {
            inst.props[k] = reactEnvWrapper(v)
        } else {
            //避免小程序因为setData undefined报错
            data[`${diuuKey}${k}`] = v === undefined ? null : v
        }
    }


    if (typeof inst.getStyle === 'function') {
        const styleObj = inst.getStyle(props)
        for(let k in styleObj) {
            data[`${diuuKey}${k}`] = styleObj[k]
        }
    } else {
        console.warn('基本组件必须提供getStyle方法！')
    }

    if (props.numberOfLines) {
        data[`${diuuKey}style`] = data[`${diuuKey}style`] + sovleNumberOfLines(props.numberOfLines)
    }

    if (typeof ref === 'function') {
        ref(inst)
        inst._ref = ref
    }
    // 动画相关
    if (animation) {
        data[`${vnodeDiuu}animation`] = animation
    }

    for (let i = 0; i < children.length; i++) {
        const subVnode = children[i]
        render(subVnode, parentInst, parentContext, data, oldData, dataPath)
    }
}

function updateClassComponent(vnode, parentInst, parentContext, data, oldData, dataPath) {
    const {animation, ref, nodeName, props, diuu: vnodeDiuu} = vnode
    let inst = null

    let {diuu, diuuKey, shouldReuse} = getDiuuAndShouldReuse(vnode, oldData)

    const effect = {}
    if (shouldReuse) {
        // 复用组件实例
        inst = instanceManager.getCompInstByUUID(diuu)

        if (!inst) {
            shouldReuseButInstNull(vnode)
            return
        }

        data[diuuKey] = diuu

        // render里面的实例，一定存在来自父的更新，所以componentWillReceiveProps一定执行
        inst.componentWillReceiveProps && inst.componentWillReceiveProps(props)
        inst.UNSAFE_componentWillReceiveProps && inst.UNSAFE_componentWillReceiveProps(props)


        const {hasForceUpdate, nextState, callbacks} = processUpdateQueue(inst)
        const shouldUpdate = checkShouldComponentUpdate(inst, hasForceUpdate, props, nextState)

        shouldUpdate && inst.componentWillUpdate && inst.componentWillUpdate(props, nextState)
        shouldUpdate && inst.UNSAFE_componentWillUpdate && inst.UNSAFE_componentWillUpdate(props, nextState)

        inst.props = props
        inst.context = filterContext(nodeName, parentContext)
        inst.state = nextState
        parentInst._c.push(inst)


        if (!shouldUpdate) {
            if (inst.didChildUpdate) {
                for(let i = 0; i < inst._c.length; i ++ ) {
                    const child = inst._c[i]
                    renderNextValidComps(child)
                }

            }

            rReportExistStyle(inst)
            inst.didChildUpdate = false
            inst.didSelfUpdate = false
            return
        }

        effect.tag = UPDATE_EFFECT
        effect.inst = inst
        effect.callbacks = callbacks
        enqueueEffect(effect)
    } else {
        const myContext = filterContext(nodeName, parentContext)
        inst = new nodeName(props, myContext)
        if (!inst.props) {
            inst.props = props
        }
        if (!inst.context) {
            inst.context = myContext
        }

        inst.componentWillMount && inst.componentWillMount()
        inst.UNSAFE_componentWillMount && inst.UNSAFE_componentWillMount()

        // 页面组件 是由页面 onLoad 方法计算的
        let instUUID = null
        if (parentInst === mpRoot) {
            instUUID = vnodeDiuu
            inst.isPageComp = true
        } else {
            instUUID = geneUUID()
            data[diuuKey] = instUUID
        }

        inst.__diuu__ = instUUID


        parentInst._c.push(inst)
        inst._p = parentInst // parent

        if (parentInst instanceof HocComponent) {
            inst.hocWrapped = true
            // 防止样式上报到HOC
            if (parentInst.isPageComp) {
                inst.isPageComp = true
            }
        }

        instanceManager.setCompInst(instUUID, inst)

        effect.tag = INIT_EFFECT
        effect.inst = inst
        enqueueEffect(effect)
    }


    const oc = inst._c
    resetInstProps(inst)

    const subVnode = inst.render()
    if (subVnode && subVnode.isReactElement) {
        subVnode.isFirstEle = true

        inst._styleKey = `${subVnode.diuu}style`
    } else {
        inst._styleKey = undefined
    }
    // 当组件往外层上报样式的时候，通过keyPath 确定数据路径
    inst._outStyleKey = `${dataPath}.${vnodeDiuu}style`
    // 记录一下_parentContext，当组件setState的时候会使用到
    inst._parentContext = parentContext
    const context = getCurrentContext(inst, parentContext)
    render(subVnode, inst, context, inst._r, inst._or, '_r')

    getRealOc(oc, inst._c, oldChildren)

    if (typeof ref === 'function') {
        ref(inst)
        inst._ref = ref
    }
    // 动画相关
    if (animation) {
        data[`${vnodeDiuu}animation`] = animation
    }

    rReportStyle(inst, effect)

    inst.didChildUpdate = false
    inst.didSelfUpdate = false
}

/**
 * 动态JSX 对应template，运行过程收集数据到data对象， 不产生effect
 */
function updateTemplate(vnode, parentInst, parentContext, data, oldData, dataPath) {
    const {tempVnode, datakey} = vnode
    if (typeof tempVnode === 'boolean'
        || tempVnode === undefined
        || tempVnode === null
    ) {
        // do nothing
        data[datakey] = ''
        return
    }

    if (typeof tempVnode === 'string'
        || typeof tempVnode === 'number'
    ) {
        // 不是jsx的情况
        data[datakey] = tempVnode
        return
    }

    if (vnode.props.isTextElement) {
        let message = "Text子元素JSX表达式的值只能是简单类型！"
        console.error(message)
        data[datakey] = ''
        return
    }

    if (Array.isArray(tempVnode)) {
        // key必须明确指定，对于不知道key的情况， React和小程序处理可能存在差异，造成两个平台的行为差异

        let oldSubDataKeyMap = {}
        if (oldData && oldData[datakey] && Array.isArray(oldData[datakey])) {
            const oldSubDataList = oldData[datakey]
            oldSubDataKeyMap = getKeyDataMap(oldSubDataList, 'key')
        }

        const subDataList = []
        data[datakey] = subDataList
        for (let i = 0; i < tempVnode.length; i++) {
            const subVnode = tempVnode[i]

            if (subVnode === null || subVnode === undefined || typeof subVnode === 'boolean') {
                continue
            }

            if (typeof subVnode === 'string'
                || typeof subVnode === 'number'
            ) {
                data[datakey].push(subVnode)
                continue
            }


            if (typeof subVnode === 'object') {
                subVnode.isTempMap = true
            }

            let subKey = subVnode.key
            if (subKey === undefined) {
                console.warn('JSX数组，需要明确指定key！否则行为会有潜在的差异')
                subKey = subVnode.key = `index_${i}`
            }


            const subData = {
                key: subKey,
                diuu: subVnode.diuu  // 用来判断复用逻辑
            }
            data[datakey].push(subData)

            // 假设 Ua 对应的key为 Ka， Ub对应的key为 Kb。
            // 当Ua的key由Ka --> Kb 的时候， 那么组件变为Ub负责来渲染这一块， 故而需要给予Ub对应的数据
            // 对于明确且唯一的key，  小程序和React处理是一致的
            const vIndex = data[datakey].length - 1
            render(subVnode, parentInst, parentContext, subData, oldSubDataKeyMap[subKey], `${dataPath}.${datakey}[${vIndex}]`)
        }
    } else {
        let oldSubData = null
        if (oldData && oldData[datakey] && oldData[datakey].tempName) {
            oldSubData = oldData[datakey]
        }

        const subData = {}
        data[datakey] = subData

        render(tempVnode, parentInst, parentContext, subData, oldSubData, `${dataPath}.${datakey}`)
    }
}


/**
 * 由于小程序slot的性能问题， 把View/Touchablexxx/Image 等退化为view来避免使用slot。
 * 对于自定义组件，如果render的最外层是View， 这个View会退化成block。
 * 运行过程收集数据到data对象， 不产生effect
 */
function updateBaseView(vnode, parentInst, parentContext, data, oldData, dataPath) {
    // isFirstEle 表示这个 vnode是否是render的第一个节点，对于第一个节点由于样式需要上报给外层，在计算样式的时候需要特殊处理
    // TODO TWFBStylePath 作用同 isFirstEle， 考虑将其 移除到自定义实现， 它不应该侵犯render函数
    const {animation, props, diuu: vnodeDiuu, isFirstEle, children} = vnode
    const allKeys = Object.keys(props)
    let finalNodeType = props.original

    let eventProps = []
    for (let i = 0; i < allKeys.length; i++) {
        const k = allKeys[i]
        const v = props[k]

        if (k === 'children' || k === 'original') continue

        if (k === 'src') {
            data[`${vnodeDiuu}${k}`] = v.uri || v
        } else if (typeof v === 'function') {
            eventProps.push(k)
        } else if (k === 'mode') {
            data[`${vnodeDiuu}${k}`] = resizeMode(v)
        } else if (k === 'style' && finalNodeType !== 'TouchableWithoutFeedback') {
            data[`${vnodeDiuu}${k}`] = tackleWithStyleObj(v, (isFirstEle || vnode.TWFBStylePath) ? finalNodeType : null)
        } else if (k === 'activeOpacity') {
            data[`${vnodeDiuu}hoverClass`] = activeOpacityHandler(v)
        } else {
            data[`${vnodeDiuu}${k}`] = v
        }
    }

    // 如果基本组件有事件函数，需要产生唯一uuid
    if (eventProps.length > 0) {
        let {diuu, diuuKey, shouldReuse} = getDiuuAndShouldReuse(vnode, oldData)
        if (!shouldReuse) {
            diuu = geneUUID()
        }
        data[diuuKey] = diuu

        eventProps.forEach(k => {
            const v = props[k]
            parentInst.__eventHanderMap[`${diuu}${ReactWxEventMap[k]}`] = reactEnvWrapper(v)
        })
    }

    if (!props.style && finalNodeType !== 'TouchableWithoutFeedback' && (isFirstEle || vnode.TWFBStylePath)) {
        data[`${vnodeDiuu}style`] = tackleWithStyleObj('', finalNodeType)
    }

    if (props.activeOpacity === undefined && finalNodeType === 'TouchableOpacity') {
        data[`${vnodeDiuu}hoverClass`] = activeOpacityHandler(0.2)
    }
    if (props.activeOpacity === undefined && finalNodeType === 'TouchableHighlight') {
        data[`${vnodeDiuu}hoverClass`] = activeOpacityHandler(1)
    }

    if (props.numberOfLines !== undefined) {
        data[`${vnodeDiuu}style`] = (data[`${vnodeDiuu}style`] || '') + sovleNumberOfLines(props.numberOfLines)
    }


    // 动画相关
    if (animation) {
        data[`${vnodeDiuu}animation`] = animation
    }


    if (props.original === 'TouchableWithoutFeedback'
        || props.original === 'TouchableHighlight'
    ) {
        if (children.length !== 1) {
            console.warn(props.original,  '必须有且只有一个子元素')
        }
    }

    if (props.original === 'TouchableWithoutFeedback') {
        children[0].TWFBStylePath = `${dataPath}.${vnodeDiuu}style`
    }

    for (let i = 0; i < children.length; i++) {
        const childVnode = children[i]
        render(childVnode, parentInst, parentContext, data, oldData, dataPath)
    }


    // TouchableWithoutFeedback本身不接样式，对外表现是唯一子节点的样式
    if (props.original === 'TouchableWithoutFeedback') {
        const outStyleKey = `${vnodeDiuu}style`

        const firstChildNode = children[0]
        if (firstChildNode.datakey) {
            const childDiuu = firstChildNode.tempVnode.diuu
            const childStyle = data[firstChildNode.datakey].v[`${childDiuu}style`]
            data[outStyleKey] = childStyle
            data[firstChildNode.datakey].v[`${childDiuu}style`] = DEFAULTCONTAINERSTYLE
        } else {
            const childDiuu = firstChildNode.diuu
            const childStyle = data[`${childDiuu}style`]
            data[outStyleKey] = childStyle
            data[`${childDiuu}style`] = DEFAULTCONTAINERSTYLE
        }
    }
}


/**
 * //TODO 有存在的必要？？
 * 用于FlatList等外层， 用来占位
 */
function updatePhblock(vnode, parentInst, parentContext, data, oldData, dataPath) {
    const {props, children} = vnode
    const allKeys = Object.keys(props)
    for (let i = 0; i < allKeys.length; i++) {
        const k = allKeys[i]
        const v = props[k]

        if (k === 'children') continue
        data[k] = v
    }

    for (let i = 0; i < children.length; i++) {
        const childVnode = children[i]
        render(childVnode, parentInst, parentContext, data, oldData, dataPath)
    }
}
