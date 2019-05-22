## 未实现组件和API

### 组件
平台相关的组件，我们均没有实现
* DatePickerIOS
* ViewPagerAndroid
* StatusBar
* DatePickerAndroid
* DrawerAndroid
* MaskedView
* ProgressBarAndroid
* ProgressViewIOS
* SegmentedControlIOS
* TabBarIOS
* TimePickerAndroid
* ToastAndroid
* ToolbarAndroid
* ViewPager
* ImageBackground

### API
* NativeModules
* Keyboard
* PanResponder
* Linking
* LayoutAnimation
* DeviceEventEmitter


### 替代方案
对应平台相关组件和一些常用组件，我们将会在稍后推出的官方组件库`alita-ui`里面推出兼容三端的方案，敬请期待。

#### DeviceEventEmitter
RN的DeviceEventEmitter 可以实现发送/监听事件的功能，对于这个事件的这个功能， 
我们提供了`@areslabs/wx-eventemitter` 这个包
##### 使用方式

```javascript
import {Event, eventEmitter} from '@areslabs/wx-eventemitter'

// 添加监听
const cancel = eventEmitter.on('load', (preload) => {
    console.log(preload)
})

// 取消监听
cancel()


// 触发事件
eventEmitter.emit(new Event('load', 2))
```

Event是一个事件类， 构造参数接受两个
1. type:  事件类型
2. preload: 事件携带信息

eventEmitter 有两个方法
1. emit: 触发事件
2. on: 添加监听， 监听函数的第一个参数是Event
