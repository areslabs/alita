/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import createElement from './createElement'
//import render from './render'
import {PureComponent, Component, FuncComponent, HocComponent, RNBaseComponent} from './AllComponent'
import WxNormalComp from './WxNormalComp'
import tackleWithStyleObj from './tackleWithStyleObj'
import styleType from './styleType'
import instanceManager from './InstanceManager'
import {getPropsMethod, getRootContext, rootUuid} from './util'
import {unstable_batchedUpdates, renderPage, renderApp} from './UpdateStrategy'


const deprecatedInfo = "ERROR：请更新Alita，并重新转化!!\n\t更新：sudo npm install -g @areslabs/alita\n\t转化：alita -i RN源码目录 -o 输出小程序目录 "

function deprecated() {
    console.error(deprecatedInfo)
}

export default {
    render: deprecated,
    renderPage,
    Component,
    PureComponent,
    FuncComponent,
    HocComponent,
    createElement,
    WxNormalComp,
    RNBaseComponent,
    tackleWithStyleObj,
    styleType,
    h: createElement,
    instanceManager,
    getPropsMethod,
    getRootContext,
    unstable_batchedUpdates,
    renderApp
}

export {
    renderPage,
    Component,
    PureComponent,
    FuncComponent,
    HocComponent,
    createElement,
    WxNormalComp,
    RNBaseComponent,
    tackleWithStyleObj,
    styleType,
    instanceManager,
    getPropsMethod,
    getRootContext,
    unstable_batchedUpdates,
    renderApp
}
export const h = createElement
export const render = deprecated