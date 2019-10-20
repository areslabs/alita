/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {getCurrentContext, invokeWillUnmount} from './util'
import createElement from './createElement'
import {mpRoot, STYLE_EFFECT, INIT_EFFECT, UPDATE_EFFECT} from './constants'
import render, {renderNextValidComps} from './render'
import {resetEffect} from "./effect";
import instanceManager from "./InstanceManager";
import getChangePath from './getChangePath'

let inRenderPhase = false
let shouldMerge = false

export let oldChildren = []

export function performUpdater(inst, updater) {
    inst.updateQueue.push(updater)

    setUpdateTagToRoot(inst)
    updateRoot()
}


export function unstable_batchedUpdates(func) {
    if (shouldMerge) {
        // 如果 shouldMerge 为true 直接执行，防止嵌套调用的情况
        func()
        return
    }

    shouldMerge = true
    func()
    shouldMerge = false

    updateRoot()
}

function setUpdateTagToRoot(inst) {
    inst.didSelfUpdate = true

    let p = inst._p
    while(p && !p.didChildUpdate) {
        p.didChildUpdate = true
        p = p._p
    }
}

export function updateRoot() {
    if (shouldMerge) {
        return
    }

    if (inRenderPhase) {
        return
    }

    inRenderPhase = true
    renderNextValidComps(mpRoot)
    inRenderPhase = false

    //TODO invokeWillUnmount调用时机？这里调用有一个潜在的问题，即小程序渲染回调的时候，实例可能被另外一次的updateRoot给清理掉了
    // 如果这个问题发生，需要考虑把调用时机放置到 回调之后
    invokeWillUnmount(oldChildren)
    oldChildren = []

    const {firstEffect, lastEffect}  = resetEffect()
    commitWork(firstEffect, lastEffect)
}

export function renderPage(pageVode, mpPageInst) {
    inRenderPhase = true
    render(
        pageVode,
        mpRoot,
        mpRoot.childContext,
        null,
        null,
        null,
    )
    inRenderPhase = false

    instanceManager.setWxCompInst(mpPageInst.data.diuu, mpPageInst)

    const {firstEffect, lastEffect}  = resetEffect()
    commitWork(firstEffect, lastEffect)
}

// render 一次入口路由组件，获取childContext等
export function renderApp(appClass) {
    render(
        createElement(appClass, {
            diuu: "fakeUUID"
        }),
        mpRoot,
        {},
        {},
        null,
        null,
    )

    // 处理Provider 提供context的情况
    const {lastEffect}  = resetEffect()
    const lastInst = lastEffect.inst

    const childContext = getCurrentContext(lastInst, lastInst._parentContext)
    Object.assign(mpRoot.childContext, childContext)
    mpRoot._c = []
}

/**
 * 1. 负责把数据刷给小程序
 * 2. 负责小程序渲染完成之后，执行渲染回调
 * 注意：不能直接使用 effect模块的firstEffect字段，因为在小程序渲染回调回来之前，可能发生其他的render，修改了effect.js模块的firstEffect
 *
 * @param firstEffect
 * @param lastEffect
 */
function commitWork(firstEffect, lastEffect) {
    if (!firstEffect) {
        // 没有产生任何更新
        return
    }

    const topWx = getTopWx(firstEffect)

    topWx.groupSetData(() => {
        let effect = firstEffect
        while (effect) {
            const {tag, inst} = effect
            if (tag === STYLE_EFFECT) {
                const wxInst = inst.getWxInst()
                wxInst.setData(effect.data)
            }

            if (tag === INIT_EFFECT) {
                const wxInst = inst.getWxInst()
                wxInst.setData({
                    _r: inst._r
                })
            }

            if (tag === UPDATE_EFFECT) {
                const wxInst = inst.getWxInst()
                const cp = getChangePath(inst._r, inst._or)
                // _or 不再有用
                inst._or = null
                wxInst.setData(cp)
            }

            effect = effect.nextEffect
        }

        topWx.setData({}, () => {
            unstable_batchedUpdates(commitLifeCycles)
        })
    })
}

function getTopWx(firstEffect) {
    let effect = firstEffect

    while (effect.tag === STYLE_EFFECT) {
        effect = effect.nextEffect
    }
    const topComp = effect.inst
    return topComp.getWxInst()
}


function commitLifeCycles(lastEffect) {
    let effect = lastEffect
    while (effect) {
        const {tag, inst} = effect

        // 如果 tag === STYLE_EFFECT , do nothing

        if (tag === INIT_EFFECT) {
            inst.componentDidMount && inst.componentDidMount()
        }

        if (tag === UPDATE_EFFECT) {
            inst.componentDidUpdate && inst.componentDidUpdate()

            effect.callbacks.forEach(cb => {
                cb && cb()
            })
        }

        effect = effect.preEffect
    }
}
