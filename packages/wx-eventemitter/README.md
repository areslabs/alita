## @areslabs/wx-eventemitter

可以在RN和小程序共用的EventEmitter， 用来取代 DeviceEventEmitter

### 使用方式

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