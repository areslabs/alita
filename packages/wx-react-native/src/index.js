/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {unstable_batchedUpdates} from '@areslabs/wx-react'

import FlatList from './component/FlatList/index'
import SectionList from './component/SectionList/index'
import ScrollView from './component/ScrollView/index'
//TODO Picker, Picker.Item
import Picker from './component/Picker/index'
import TextInput from './component/TextInput/index'
import Button from './component/Button/index'
import ActivityIndicator from './component/ActivityIndicator/index'
import ImageBackground from './component/ImageBackground/index'
import Modal from './component/Modal/index'

import StyleSheet from './api/StyleSheet'
import Platform from './api/Platform'
import Dimensions from './api/Dimensions'
import Alert from './api/Alert'
import PixelRatio from './api/PixelRatio'
import AsyncStorage from './api/AsyncStorage'

import fetch from './api/fetch'
import alert from './api/galert'
import {requestAnimationFrame, cancelAnimationFrame} from './api/raf'


import {getWXBaseComponent} from './component/Component'

const Slider = getWXBaseComponent()
const Switch = getWXBaseComponent()
const RefreshControl = getWXBaseComponent()
const WebView = getWXBaseComponent()

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
    ActivityIndicator,
    ImageBackground,
    Button,
    FlatList,
    SectionList,
    Modal,
    Picker,
    Slider,
    Switch,
    TextInput,
    ScrollView,
    RefreshControl,
    WebView,

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
    ActivityIndicator,
    ImageBackground,
    Button,
    FlatList,
    SectionList,
    Modal,
    Picker,
    Slider,
    Switch,
    TextInput,
    ScrollView,
    RefreshControl,
    WebView,

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