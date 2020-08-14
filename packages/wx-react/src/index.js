/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import createElement from './createElement'
import {PureComponent, Component, FuncComponent, HocComponent, RNBaseComponent, memo} from './AllComponent'
import WxNormalComp from './WxNormalComp'
import tackleWithStyleObj from './tackleWithStyleObj'
import styleType from './styleType'
import instanceManager from './InstanceManager'
import {getPropsMethod} from './util'
import reactCompHelper from './reactCompHelper'
import {unstable_batchedUpdates, renderPage, renderApp} from './UpdateStrategy'
import {
    useState,
    useEffect,
    useContext,
    useCallback,
    useMemo,
    useRef,
    useReducer,
    useImperativeHandle,
    useLayoutEffect,
    useDebugValue
} from './hooks'
import {Current} from './constants'
import {createContext} from './createContext'


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
    unstable_batchedUpdates,
    renderApp,
    memo,
    Current,
    useState,
    useEffect,
    useContext,
    useCallback,
    useMemo,
    useRef,
    useReducer,
    useImperativeHandle,
    useLayoutEffect,
    useDebugValue,
    createContext
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
    unstable_batchedUpdates,
    renderApp,
    memo,
    Current,
    useState,
    useEffect,
    useContext,
    useCallback,
    useMemo,
    useRef,
    useReducer,
    useImperativeHandle,
    useLayoutEffect,
    useDebugValue,
    createContext
}
export const h = createElement


wx.__bridge = {
    reactCompHelper,
    WxNormalComp
}