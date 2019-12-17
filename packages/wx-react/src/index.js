/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import createElement from './createElement'
import {PureComponent, Component, FuncComponent, HocComponent, RNBaseComponent} from './AllComponent'
import WxNormalComp from './WxNormalComp'
import tackleWithStyleObj, {parseElement, flattenStyle} from './tackleWithStyleObj'
import styleType from './styleType'
import instanceManager from './InstanceManager'
import {getPropsMethod} from './util'
import reactCompHelper from './reactCompHelper'
import {unstable_batchedUpdates, renderPage, renderApp} from './UpdateStrategy'


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
    parseElement,
    flattenStyle,
    styleType,
    h: createElement,
    instanceManager,
    getPropsMethod,
    unstable_batchedUpdates,
    renderApp,
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
    parseElement,
    flattenStyle,
    styleType,
    instanceManager,
    getPropsMethod,
    unstable_batchedUpdates,
    renderApp,
}
export const h = createElement
export const render = deprecated


wx.__bridge = {
    reactCompHelper,
    WxNormalComp
}