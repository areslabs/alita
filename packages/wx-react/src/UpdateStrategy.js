/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {getCurrentContext, invokeWillUnmount} from './util'
import createElement from './createElement'
import {mpRoot, STYLE_EFFECT, INIT_EFFECT, UPDATE_EFFECT, STYLE_WXINIT_EFFECT} from './constants'
import render, {renderNextValidComps} from './render'
import {resetEffect} from "./effect";
import instanceManager from "./InstanceManager";
import getChangePath from './getChangePath'
import {HocComponent} from './AllComponent'
import {LayoutConstsMap} from './constants'

let inRenderPhase = false
let shouldMerge = false

export let oldChildren = []

export function performUpdater(inst, updater) {
    // 如果有onLayout事件的话，则在setState回掉后执行一下
    if (inst[LayoutConstsMap.UpdateLayoutEvents]) {
        const callback = updater.callback
        updater.callback = function() {
            inst[LayoutConstsMap.UpdateLayoutEvents].call(inst)
            if (callback) {
                callback.call(inst)
            }
        }
    }
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

    const currentPage = getMpCurrentPage()

    /**
     * 出于对性能的考虑，我们希望react层和小程序层数据交互次数能够近可能的少。自小程序2.4.0版本提供groupSetData之后，小程序提供了
     * 批量设置数据的功能。现在我们可以通过类似如下的代码来批量的设置小程序数据
     *    father.groupSetData(() => {
     *          son1.setData(uiDes1)
     *          son2.setData(uiDes2)
     *          son3.setData(uiDes3)
     *    })
     * 也就是说在更新的时候，我们利用groupSetData 可以做到本质上只交互一次。
     */
    currentPage.groupSetData(() => {
        let effect = firstEffect
        while (effect) {
            const {tag, inst} = effect

            // 页面组件需要特殊处理
            if (inst.isPageComp && inst instanceof HocComponent && Object.keys(inst._r).length === 0) {
                // 这里不直接使用currentPage 的原因是 有可能在currentPage 是设置的是其他页面的组件
                const thisPage = inst.getWxInst()
                thisPage.setData({_r: {}})
                effect = effect.nextEffect
                continue
            }

            /**
             * 1. HOC节点不对应小程序节点，不需要传递数据
             * 2. myOutStyle 为false的节点，不产生小程序节点，不需要传递数据
             */
            if (inst instanceof HocComponent || inst._myOutStyle === false) {
                effect = effect.nextEffect
                continue
            }

            if (tag === STYLE_EFFECT) {
                const wxInst = inst.getWxInst()
                wxInst.setData(effect.data)
            }

            if (tag === STYLE_WXINIT_EFFECT) {
                const wxInst = inst.getWxInst()
                wxInst.setData({
                    _r: inst._r
                })
            }


            if (tag === INIT_EFFECT) {
                const wxInst = inst.getWxInst()
                wxInst.setData({
                    _r: inst._r
                })
            }

            if (tag === UPDATE_EFFECT) {
                const wxInst = inst.getWxInst()

                if (effect.hasMpInit) {
                    wxInst.setData({
                        _r: inst._r
                    })
                } else {
                    // getChangePath 在这里调用，而不是在render的过程调用，是考虑以后 render 采用fiber以后存在反复render的情况
                    const cp = getChangePath(inst._r, inst._or)
                    if (Object.keys(cp).length !== 0) {
                        wxInst.setData(cp)
                    }
                }
                // _or 不再有用
                inst._or = null
            }

            effect = effect.nextEffect
        }

        currentPage.setData({}, () => {
            unstable_batchedUpdates(() => {
                commitLifeCycles(lastEffect)
            })
        })
    })
}

function getMpCurrentPage() {
    const pages = getCurrentPages()
    return pages[pages.length - 1]
}


function commitLifeCycles(lastEffect) {
    let effect = lastEffect
    while (effect) {
        const {tag, inst} = effect

        // 如果 tag === STYLE_** , do nothing

        if (tag === INIT_EFFECT) {
            inst.componentDidMount && inst.componentDidMount()
        }


        if (tag === UPDATE_EFFECT) {
            inst.componentDidUpdate && inst.componentDidUpdate()

            if (effect.callbacks) {
                effect.callbacks.forEach(cb => {
                    cb && cb()
                })
            }
        }

        effect = effect.preEffect
    }
}
