/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {unstable_batchedUpdates} from '@areslabs/wx-react'

import WXFlatList from './component/WXFlatList/index.comp'
import WXSectionList from './component/WXSectionList/index.comp'
import WXScrollView from './component/WXScrollView/index.comp'
import WXPicker from './component/WXPicker/index.comp'
import WXTextInput from './component/WXTextInput/index.comp'
import WXButton from './component/WXButton/index.comp'

import WXModal from './component/WXModal/index.comp'

import StyleSheet from './api/StyleSheet'
import Platform from './api/Platform'
import Dimensions from './api/Dimensions'
import Alert from './api/Alert'
import PixelRatio from './api/PixelRatio'
import AsyncStorage from './api/AsyncStorage'

import fetch from './api/fetch'
import alert from './api/galert'
import {requestAnimationFrame, cancelAnimationFrame} from './api/raf'


import {WXBaseComponent, getNotSupport} from './component/WXComponent'

// WXBaseComponent
const WXView = WXBaseComponent
const WXImage = WXBaseComponent
const WXSlider = WXBaseComponent
const WXSwitch = WXBaseComponent
const WXText = WXBaseComponent
const WXTextInner = WXBaseComponent
const WXTouchableHighlight = WXBaseComponent
const WXTouchableOpacity = WXBaseComponent
const WXTouchableWithoutFeedback = WXBaseComponent
const WXRefreshControl = WXBaseComponent
const WXWebView = WXBaseComponent

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
    unstable_batchedUpdates
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
    unstable_batchedUpdates
}