## React与小程序的数据交换方式
通常你并不需要了解底层的React与小程序的数据交换方式，但是了解这部分知识，可以帮助你写出在小程序上性能更好的应用。 

我们以下面的组件来说明数据交换方式

首先React Natie的3个组件
App.js
```javascript
export default class App extends React.Component {
    render() {
        return (
            <View>
                <Text>1</Text>
                <StateComp/>
                
                <StatelessComp/>
            </View>
        )
    }
}
```

StatelessComp.js
```javascript
// 无状态组件
export default function StatelessComp(props) {
  
    return (
        <View/>
    )
}
```

StateComp.js
```javascript
// 有状态组件
export default class StateComp extends React.Component {
    state = {
        width: 1,
    }
    render() {
        return <View style={{width: this.state.width}}/>
    }
}
```




转化为微信小程序之后的wxml形式
App.wxml
```html
<template name="tn0001">
    <view>
        <text>1</text>
        <StateComp uiDes="{{StateCompUiDes}}"/>
        <StatelessComp uiDes="{{StatelessCompUiDes}}"/>
    </view>
</template>

<template is="{{uiDes.tempName}}" data="{{...uiDes}}"></template>
```

StateComp.wxml
```html
<template name="tn0001">
    <view style="{{x0001Style}}"/>  
</template>

<template is="{{uiDes.tempName}}" data="{{...uiDes}}"></template>
```

StatelessComp.wxml
```html
<template name="tn0001">
    <view>  
</template>

<template is="{{uiDes.tempName}}" data="{{...uiDes}}"></template>
```



### 组件首次渲染
在上面的例子中出现来3个组件， App， StateComp， StatelessComp。 当组件首次渲染的时候，render阶段会计算出他们渲染的UI描述， 大概如下的一个结构
```javascript
const uiDes = {
    tempName: 'tn0001',
   
    
    StateCompUiDes: {
        tempName: 'tn0002',
        
        x0001Style: 'width: 1px',
        ...
    },
    
    StatelessCompUiDes: {
        tempName: 'tn0003',
        ...
    }
    ...
}
```
这个结构被App组件实例（React实例）所持有

在看下转化为微信小程序的App.js
```javascript
Component({
    ...
    ready() {
        const compInst = instanceManager.getReactInst()
        this.setData({
            uiDes: compInst.uiDes
        })
    },
    ...
})
```
可以看到在App组件（微信小程序实例）ready的时候，会通过instanceManager模块获取到其对应的React实例， 然后将其uiDes通过setData的方式
设置给小程序， 这样首次的时候就实现了3个组件的渲染
### 更新
当组件通过调用setState更新UI的时候，其所有的子组件的uiDes都可以可能发生改变， 这个时候render过程会重新计算子组件的
uiDes（遇上shouldComponentUpdate为false的跳过），然后将每一个组件的新uiDes与老uiDes进行比较，如果有修改，则把修改通过setData的方式传递给
微信小程序，伪代码描述如下： 
```javascript

let oldUiDes = // 获取oldUiDes
let newUiDes = null
render() {
    ...
    newUiDes = // 生成newUiDes
}

const changePath = diffPath(oldUiDes, newUiDes)

if (hasChange(changePath)) {
    const wxInst = instanceManager.getWxInst() // 通过instanceManager模块获取微信小程序实例
    wxInst.setData(changePath)
}
```
注意这里与首次渲染的区别，首先渲染的时候所有数据通过父组件一次setData就把本身已经子组件的数据传递到微信小程序平台了。 而每次setState的时候
所有子组件都会自己管理自己的更新，子组件会根据自己的uiDes变化与否，来决定是否需要把数据传递给自己所对应的微信小程序组件。所有可能会出现一次setState
对应多次setData的情况。 通常这并不是问题，相比于首次渲染，之后的更新影响的组件相对来说更少。 

### 无状态组件
正如前文所说， 一次setState可能会对应多次setData，那么我有办法避免这种情况吗？ 比如FlatList的场景，每次onReachEnd的给列表添加数据的时候，
添加10条，就有可能会调用10次setData去交换数据。 针对这种情况， 我们对无状态组件（函数式组件也是无状态组件）进行了优化， 无状态组件不持有uiDes，
其父组件持有，如果其父组件也是无状态组件，就是其父组件的父组件持有。。。。所以对于无状态组件是不会setData。 还是以FlatList为例， 如果其
renderItem是无状态组件（包括其子组件也是无状态组件），那么当onReachEnd添加数据的时候，就不会调用多次setData了。 当你的应用卡顿的时候，不妨尝试
把里面的关键组件改写成无状态组件， 不仅在微信小程序端，即使在React Native端，无状态组件的性能更好的。 

### 最后
从实际表现来看，现在的数据传递方式，转化出来的微信小程序性能已经很优异了。 那么有可能做到一次setState至多对应一次setData吗？是有方案的， 我们
也在权衡，拭目以待吧。 

