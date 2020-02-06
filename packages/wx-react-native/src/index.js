/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {unstable_batchedUpdates} from '@areslabs/wx-react'

import WXFlatList from './component/WXFlatList/index'
import WXSectionList from './component/WXSectionList/index'
import WXScrollView from './component/WXScrollView/index'
//TODO Picker, Picker.Item
import WXPicker from './component/WXPicker/index'
import WXTextInput from './component/WXTextInput/index'
import WXButton from './component/WXButton/index'
import WXActivityIndicator from './component/WXActivityIndicator/index'
import WXImageBackground from './component/WXImageBackground/index'
import WXModal from './component/WXModal/index'

import StyleSheet from './api/StyleSheet'
import Platform from './api/Platform'
import Dimensions from './api/Dimensions'
import Alert from './api/Alert'
import PixelRatio from './api/PixelRatio'
import AsyncStorage from './api/AsyncStorage'

import fetch from './api/fetch'
import alert from './api/galert'
import {requestAnimationFrame, cancelAnimationFrame} from './api/raf'


import {getWXBaseComponent} from './component/WXComponent'

const WXSlider = getWXBaseComponent()
const WXSwitch = getWXBaseComponent()
const WXRefreshControl = getWXBaseComponent()
const WXWebView = getWXBaseComponent()

const AppState = {
    removeEventListener: () => {
        console.error('尚不支持 AppState!')
    },
    addEventListener: () => {
        console.error('尚不支持 AppState!')
    }
}
const NativeAppEventEmitter = {
    addListener: () => {
        console.error('尚不支持 NativeAppEventEmitter! use @areslabs/wx-eventemitter instead')
        return () => {
            console.error('尚不支持 NativeAppEventEmitter! use @areslabs/wx-eventemitter instead')
        }
    },
}
const DeviceEventEmitter = {
    addListener: () => {
        console.error('use @areslabs/wx-eventemitter instead')
        return () => {
            console.error('use @areslabs/wx-eventemitter instead')
        }
    },
}

export {
    WXActivityIndicator,
    WXImageBackground,
    WXButton,
    WXFlatList,
    WXSectionList,
    WXModal,
    WXPicker,
    WXSlider,
    WXSwitch,
    WXTextInput,
    WXScrollView,
    WXRefreshControl,
    WXWebView,

    StyleSheet,
    Platform,
    Dimensions,
    Alert,
    PixelRatio,
    AsyncStorage,
    fetch,
    alert,
    requestAnimationFrame,
    cancelAnimationFrame,
    unstable_batchedUpdates,

    AppState,
    NativeAppEventEmitter,
    DeviceEventEmitter
}

export default  {
    WXActivityIndicator,
    WXImageBackground,
    WXButton,
    WXFlatList,
    WXSectionList,
    WXModal,
    WXPicker,
    WXSlider,
    WXSwitch,
    WXTextInput,
    WXScrollView,
    WXRefreshControl,
    WXWebView,

    StyleSheet,
    Platform,
    Dimensions,
    Alert,
    PixelRatio,
    AsyncStorage,
    fetch,
    alert,
    requestAnimationFrame,
    cancelAnimationFrame,
    unstable_batchedUpdates,

    AppState,
    NativeAppEventEmitter,
    DeviceEventEmitter
}