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


import {getNotSupport, getWXBaseComponent, BaseView} from './component/WXComponent'

// WXBaseComponent
const WXView = BaseView
const WXImage = BaseView
const WXText = BaseView
const WXTextInner = BaseView
const WXTouchableHighlight = BaseView
const WXTouchableOpacity = BaseView
const WXTouchableWithoutFeedback = BaseView


const WXSlider = getWXBaseComponent()
const WXSwitch = getWXBaseComponent()
const WXRefreshControl = getWXBaseComponent()
const WXWebView = getWXBaseComponent()

// not support yet
const DatePickerIOS = getNotSupport('DatePickerIOS')
const DrawerLayoutAndroid = getNotSupport('DrawerLayoutAndroid')
const InputAccessoryView = getNotSupport('InputAccessoryView')
const KeyboardAvoidingView = getNotSupport('KeyboardAvoidingView')
const MaskedViewIOS = getNotSupport('MaskedViewIOS')
const ProgressBarAndroid = getNotSupport('ProgressBarAndroid')
const ProgressViewIOS = getNotSupport('ProgressViewIOS')
const SegmentedControlIOS = getNotSupport('SegmentedControlIOS')
const TabBarIOS = getNotSupport('TabBarIOS')
const ToolbarAndroid = getNotSupport('ToolbarAndroid')
const ViewPagerAndroid = getNotSupport('ViewPagerAndroid')
const VirtualizedList = getNotSupport('VirtualizedList')


const Animated = getNotSupport('Animated')
const DatePickerAndroid = getNotSupport('DatePickerAndroid')
const TimePickerAndroid = getNotSupport('TimePickerAndroid')
const ToastAndroid = getNotSupport('ToastAndroid')


const AppState = {
    removeEventListener: () => {
        console.warn('not support AppState now!')
    },
    addEventListener: () => {
        console.warn('not support AppState now!')
    }
}
const NativeAppEventEmitter = {
    addListener: () => {
        console.warn('not support NativeAppEventEmitter now! use @areslabs/wx-eventemitter instead')
        return () => {
            console.warn('not support NativeAppEventEmitter now! use @areslabs/wx-eventemitter instead')
        }
    },
}
const DeviceEventEmitter = {
    addListener: () => {
        console.warn('use @areslabs/wx-eventemitter instead')
        return () => {
            console.warn('use @areslabs/wx-eventemitter instead')
        }
    },
}

export {
    WXActivityIndicator,
    WXImageBackground,
    WXButton,
    WXView,
    WXText,
    WXTextInner,
    WXFlatList,
    WXSectionList,
    WXImage,
    WXModal,
    WXPicker,
    WXSlider,
    WXSwitch,
    WXTextInput,
    WXTouchableHighlight,
    WXTouchableOpacity,
    WXTouchableWithoutFeedback,
    WXScrollView,
    WXRefreshControl,
    WXWebView,


    DatePickerIOS,
    DrawerLayoutAndroid,
    InputAccessoryView,
    KeyboardAvoidingView,
    MaskedViewIOS,
    ProgressBarAndroid,
    ProgressViewIOS,
    SegmentedControlIOS,
    TabBarIOS,
    ToolbarAndroid,
    ViewPagerAndroid,
    VirtualizedList,

    Animated,
    DatePickerAndroid,
    TimePickerAndroid,
    ToastAndroid,

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
    WXView,
    WXText,
    WXTextInner,
    WXFlatList,
    WXSectionList,
    WXImage,
    WXModal,
    WXPicker,
    WXSlider,
    WXSwitch,
    WXTextInput,
    WXTouchableHighlight,
    WXTouchableOpacity,
    WXTouchableWithoutFeedback,
    WXScrollView,
    WXRefreshControl,
    WXWebView,

    DatePickerIOS,
    DrawerLayoutAndroid,
    InputAccessoryView,
    KeyboardAvoidingView,
    MaskedViewIOS,
    ProgressBarAndroid,
    ProgressViewIOS,
    SegmentedControlIOS,
    TabBarIOS,
    ToolbarAndroid,
    ViewPagerAndroid,
    VirtualizedList,

    Animated,
    DatePickerAndroid,
    TimePickerAndroid,
    ToastAndroid,


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