/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import createElement from './createElement'
import render from './render'
import {PureComponent, Component, FuncComponent, HocComponent, RNBaseComponent} from './AllComponent'
import WxCPTComp from './WxCPTComp'
import WxNormalComp from './WxNormalComp'
import tackleWithStyleObj from './tackleWithStyleObj'
import styleType from './styleType'
import instanceManager from './InstanceManager'
import {getPropsMethod} from './util'


export default {
    render,
    Component,
    PureComponent,
    FuncComponent,
    HocComponent,
    createElement,
    WxCPTComp,
    WxNormalComp,
    RNBaseComponent,
    tackleWithStyleObj,
    styleType,
    h: createElement,
    instanceManager,
    getPropsMethod
}

export {
    render,
    Component,
    PureComponent,
    FuncComponent,
    HocComponent,
    createElement,
    WxCPTComp,
    WxNormalComp,
    RNBaseComponent,
    tackleWithStyleObj,
    styleType,
    instanceManager,
    getPropsMethod
}
export const h = createElement