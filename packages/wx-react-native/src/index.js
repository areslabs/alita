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
const ViewPagerAndroid = getNotSupport('ViewPagerAndroid')
const StatusBar = getNotSupport('StatusBar')
const DatePickerAndroid = getNotSupport('DatePickerAndroid')
const DrawerAndroid = getNotSupport('DrawerAndroid')
const Animated = getNotSupport('Animated')
const ProgressBarAndroid = getNotSupport('ProgressBarAndroid')
const ProgressViewIOS = getNotSupport('ProgressViewIOS')
const SegmentedControlIOS = getNotSupport('SegmentedControlIOS')
const TabBarIOS = getNotSupport('TabBarIOS')
const TimePickerAndroid = getNotSupport('TimePickerAndroid')
const ToastAndroid = getNotSupport('ToastAndroid')
const ToolbarAndroid = getNotSupport('ToolbarAndroid')

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
    ViewPagerAndroid,
    StatusBar,
    DatePickerAndroid,
    DrawerAndroid,
    Animated,
    ProgressBarAndroid,
    ProgressViewIOS,
    SegmentedControlIOS,
    TabBarIOS,
    TimePickerAndroid,
    ToastAndroid,
    ToolbarAndroid,

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


    ViewPagerAndroid: ViewPagerAndroid,
    DatePickerIOS: DatePickerIOS,
    StatusBar: StatusBar,
    DatePickerAndroid: DatePickerAndroid,
    DrawerAndroid: DrawerAndroid,
    Animated: Animated,
    ProgressBarAndroid: ProgressBarAndroid,
    ProgressViewIOS: ProgressViewIOS,
    SegmentedControlIOS: SegmentedControlIOS,
    TabBarIOS: TabBarIOS,
    TimePickerAndroid: TimePickerAndroid,
    ToastAndroid: ToastAndroid,
    ToolbarAndroid: ToolbarAndroid,


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