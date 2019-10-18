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
import {unstable_batchedUpdates, renderPage} from './UpdateStrategy'


export default {
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
    rootUuid,
    unstable_batchedUpdates
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
    rootUuid,
    unstable_batchedUpdates
}
export const h = createElement