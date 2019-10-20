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
import { DEFAULTCONTAINERSTYLE, filterContext, getCurrentContext, isEventProp, ReactWxEventMap, getRealOc} from './util'
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

        enqueueEffect({
            tag: UPDATE_EFFECT,

            inst,
            callbacks,
        })

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

        rnvcReportStyle(inst)

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

        const {animation, ref, nodeName, children, props, tempVnode, CPTVnode, tempName, datakey, diuu: vnodeDiuu, isFirstEle} = vnode

        if (typeof ref === "string") {
            console.warn('ref 暂时只支持函数形式!')
        }

        if (data && tempName) {
            data.tempName = tempName
        }

        // 由于小程序slot的性能问题， 把View/Touchablexxx/Image 等退化为view来避免使用slot。
        // 对于自定义组件，如果render的最外层是View， 这个View会退化成block。
        if (nodeName === 'view' || nodeName === 'block' || nodeName === 'image') {
            const allKeys = Object.keys(props)
            let finalNodeType = props.original

            let eventProps = []
            for (let i = 0; i < allKeys.length; i++) {
                const k = allKeys[i]
                const v = props[k]

                if (k === 'children' || k === 'original') continue

                if (k === 'src') {
                    data[`${vnodeDiuu}${k}`] = v.uri || v
                } else if (isEventProp(k)) {
                    eventProps.push(k)
                    // parentInst.__eventHanderMap[`${diuu}${ReactWxEventMap[k]}`] = reactEnvWrapper(v)
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
        } else if (nodeName === 'template') {
            if (typeof tempVnode === 'boolean'
                || tempVnode === undefined
                || tempVnode === null
            ) {
                // do nothing
                data[datakey] = ''
            } else if (typeof tempVnode === 'string'
                || typeof tempVnode === 'number'
            ) {
                // 不是jsx的情况
                data[datakey] = tempVnode
            } else if (Array.isArray(tempVnode)) {
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
        } else if (nodeName === 'phblock') {
            // 用于FlatList等外层， 用来占位

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
        } else if (typeof nodeName === 'string' && nodeName.endsWith('CPT')) {
            // 抽象组件节点， 处理属性是xxComponent/children的情况

            let {diuu, diuuKey, shouldReuse} = getDiuuAndShouldReuse(vnode, oldData)

            let inst = null
            if (shouldReuse) {
                inst = instanceManager.getCompInstByUUID(diuu)
                if (!inst) {
                    shouldReuseButInstNull(vnode)
                    return
                }

                parentInst._c.push(inst)
                inst._p = parentInst
                inst.shouldUpdate = true
            } else {
                inst = new CPTComponent()

                diuu = geneUUID()
                inst.__diuu__ = diuu
                inst.__diuuKey = diuuKey

                parentInst._c.push(inst)
                inst._p = parentInst


                instanceManager.setCompInst(diuu, inst)
            }
            data[diuuKey] = diuu

            inst._or = inst._r
            inst._r = {}
            const oc  = inst._c
            inst._c = []

            inst.__eventHanderMap = {}

            if (CPTVnode && CPTVnode.isReactElement) {
                CPTVnode.isFirstEle = true
            }

            render(CPTVnode, inst, parentContext, inst._r, inst._or, '_r')

            if (!inst._keyPath) {
                inst._keyPath = `${dataPath}.${vnodeDiuu}`
            }

            getRealOc(oc, inst._c, oldChildren)

            // 普通组件/CPT组件 需要接受内部外层子元素的样式， 外层子元素只需要继承
            reportSubStyleToOuter(inst)

        } else if (nodeName.prototype && Object.getPrototypeOf(nodeName) === FuncComponent) {
            // 函数组件， 没有声明周期， 没有setState
            let inst = null
            if (parentInst) {
                let {diuu, diuuKey, shouldReuse} = getDiuuAndShouldReuse(vnode, oldData)

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
                    inst._p = parentInst

                    inst.shouldUpdate = true
                    inst._or = inst._r
                } else {
                    const myContext = filterContext(nodeName, parentContext)
                    inst = new nodeName(props, myContext)

                    const instUUID = geneUUID()
                    data[diuuKey] = instUUID
                    inst.__diuu__ = instUUID
                    inst.__diuuKey = diuuKey

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
                }
            } else {
                // 页面组件
                const myContext = filterContext(nodeName, parentContext)
                inst = new nodeName(props, myContext)

                inst.isPageComp = true

                const instUUID = vnodeDiuu
                inst.__diuu__ = instUUID
                instanceManager.setCompInst(instUUID, inst)
            }

            inst._r = {}
            // children 重置， render过程的时候重新初始化， 因为children的顺序关系着渲染的顺序， 所以这里应该需要每次render都重置
            const oc = inst._c
            inst._c = []

            inst.__eventHanderMap = {}


            const subVnode = inst.render()
            if (subVnode && subVnode.isReactElement) {
                subVnode.isFirstEle = true
            }


            const context = getCurrentContext(inst, parentContext)

            render(subVnode, inst, context, inst._r, inst._or, '_r')

            if (!inst._keyPath) {
                inst._keyPath = `${dataPath}.${vnodeDiuu}`
            }

            getRealOc(oc, inst._c, oldChildren)

            // 动画相关
            if (animation) {
                data[`${vnodeDiuu}animation`] = animation
            }

            if (!inst.isPageComp) {
                reportSubStyleToOuter(inst)
            }
        } else if (nodeName.prototype && Object.getPrototypeOf(nodeName) === RNBaseComponent) {
            // 与下面 typeof nodeName === 'function' 相比， 这里面应该都是 RN base 组件，
            // RN base组件的渲染逻辑提前已知，可以预先对应好，出于两方面的考虑
            // 1. 预先对应好 对base组件 有更强的控制能力
            // 2. 由于现在的数据交换方式， 预先对应可以节省一次setData， 另由于base comp 大量存在， 整个应用会节省更多的setDate


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
                } else if (isEventProp(k)) {
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
        } else if (typeof nodeName === 'function') {
            let inst = null

            let {diuu, diuuKey, shouldReuse} = getDiuuAndShouldReuse(vnode, oldData)

            if (shouldReuse) {
                // 复用组件实例
                inst = instanceManager.getCompInstByUUID(diuu)

                if (!inst) {
                    shouldReuseButInstNull(vnode)
                    return
                }

                data[diuuKey] = diuu

                // render里面的实例，一定存在来自父的更新，固componentWillReceiveProps一定执行
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

                enqueueEffect({
                    tag: UPDATE_EFFECT,

                    inst,
                    callbacks,
                })
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
                    // 当组件往外层上报样式的时候，通过keyPath 确定数据路径
                    inst._keyPath = `${dataPath}.${vnodeDiuu}`
                }

                inst.__diuu__ = instUUID
                inst.__diuuKey = diuuKey


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

                enqueueEffect({
                    tag: INIT_EFFECT,
                    inst,
                })
            }


            const oc = inst._c
            resetInstProps(inst)


            // _TWFBStylePath, _isFirstEle两个字段 FuncComp 不需要设置，因为他们只有在setState的起作用
            inst._isFirstEle = isFirstEle
            if (vnode.TWFBStylePath) {
                inst._TWFBStylePath = vnode.TWFBStylePath
            }

            const subVnode = inst.render()
            if (subVnode && subVnode.isReactElement) {
                subVnode.isFirstEle = true

                inst._styleKey = `${subVnode.diuu}style`
            } else {
                inst._styleKey = undefined
            }

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

            rReportStyle(inst)

            inst.didChildUpdate = false
            inst.didSelfUpdate = false
        }
    } catch (e) {
        console.error(e)
    }
}

/**
 * 微信小程序的自定义组件会退化为一个节点， 所以需要把内部的节点样式上报给这个退化生成的节点
 * @param inst
 */
function reportOuterWithExistsStyle(inst) {
    const parentInst = inst._p
    const styleValue = inst._myOutStyle

    setStyleData(parentInst, styleValue, inst._keyPath)
}

/**
 * 微信小程序的自定义组件会退化为一个节点， 所以需要把内部的节点样式上报给这个退化生成的节点
 * @param inst
 */
function reportSubStyleToOuter(inst) {
    const parentInst = inst._p

    const styleKey = inst._styleKey
    let styleValue

    // render null，外层组件的节点 也应该消失
    if (!styleKey) {
        styleValue = false
    } else {
        /**
         * 当 render <view/> 等基本组件的时候， inst._r[styleKey] 是tackleWithStyleObj算出来的
         * 当 render <F/> 等非基本组件的时候，inst._r[styleKey] 是子元素上报上来的
         */
        styleValue = inst._r[styleKey]
        inst._r[styleKey] = DEFAULTCONTAINERSTYLE
    }

    setStyleData(parentInst, styleValue, inst._keyPath)
    inst._myOutStyle = styleValue
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

