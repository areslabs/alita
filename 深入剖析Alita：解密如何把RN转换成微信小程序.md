## 深入剖析Alita：解密如何把RN转换成微信小程序

作者：京东ARES技术团队

5月底我们正式对外开源了业内首个React Native转微信小程序引擎Alita项目（
[https://github.com/areslabs/alita](https://github.com/areslabs/alita)）。
这个项目的发起是因为团队内部有大量使用React Native开发的业务模块，大部分业务都有移植到H5和微信小程序的需求。所以我们开始思考如何通过技术的方式来实现把`React Native`代码转换微信小程序的。经过内部孵化和大量业务落地验证，最终我们对社区贡献了Alita引擎。她的定位非常明确，我们不造新框架，Alita必须低侵入性并且只做好一件事情，就是把你的`React Native`代码转换并运行在微信小程序端（未来可能覆盖更多端）。

开源社区其实也一直在致力于打通`React`和微信小程序，涌现出了很多优秀的框架（同是京东凹凸实验室出品的`Taro`就是非常出色的框架），我们发现大部分虽然基于`React`，但是提供了新的框架和新语法规则，对`React Native`的处理比较少。更重要的是现有框架对`React`语法采用的是**编译时**处理方案，对JSX语法限制比较大（后面文章会详细分析）。我们对`Alita`的期望是不能对`JSX`语法有太多限制，不能有侵入性，不给`React Native`的开发者带来太多的负担。所以最终`Alita`引擎没有基于任何现有的**编译时方案**，而是另辟溪路，走了一条颇具开创性的**运行期处理方案**。

抛开技术细节，针对Alita的使用者有2点必须了解：1）如果你打算转换复杂的`RN`应用，需要特别注意，微信小程序包有大小限制，不能超过4M。2）`Alita`不能直接把原生组件/第三方组件转换成小程序代码。不过，`Alita`提供了扩展这些组件的方式，这点很像在RN上提供原生平台组件。另外，我们近期会推出`alita-ui`，这个`UI`库包含了社区常用的`RN`组件，可以直接被`Alita`转换引擎支持。

Talk is cheap. [Show me the code](https://github.com/areslabs/alita/).

直接上干货！接下来我们从纯技术的角度剖析一下`Alita`引擎的核心部分：如何实现运行期处理JSX

### 现有社区方案的局限
在剖析Alita之前，我们先来看一下现有的社区方案，我们说现有方案对JSX现在比较大，那他们是怎么做的呢？他们主要是通过在**编译阶段**把`React`代码转换为等效的微信小程序代码，来把`React`代码运行在微信小程序端。 
举个例子，比如`React`逻辑表达式：

```
xx && <Text>Hello</Text>
```
将会被转换为等效的小程序`wx:if`指令：

```
<Text wx:if="{{xx}}">Hello</Text>
```

那么这种编译阶段处理的方式有什么问题呢，通过下面的`React`代码看下。

```javascript
class App extends React.Component {
    render () {
        const a = <Text>Hello</Text>
        const b = a

        return (
            <View>
                {b}
            </View>
        )
    }
}
```

这里声明了变量`a`：`const a = <Text>Hello</Text>`，变量`b`：`const b = a`。 我们看下编译方案（这里以`Taro1.3`为例）对上面代码的转换过程。

![](http://img30.360buyimg.com/njmobilecms/jfs/t1/71540/38/2151/483793/5d07550eE4eb5a84c/214893fc29eed93a.jpg)

这个例子不是特别复杂，却报错了。

要想理解上面的代码为什么报错，我们首先要理解**编译阶段**。本质上来说在编译阶段，代码其实就是‘字符串’，而**编译阶段**处理方案，就需要从这个‘字符串’中分析出必要的信息（通过`AST`，正则等方式）然后做对应的等效转换处理。

而对于上面的例子，需要做什么等效处理呢？需要我们在**编译阶段**分析出`b`是`JSX`片段：`b = a = <Text>Hello</Text>`，然后把`<View>{b}</View>`中的`{b}`等效替换为`<Text>Hello</Text>`。然而在**编译阶段**要想确定`b`的值是很困难的，有人说可以往前追溯来确定b的值，也不是不可以，但是考虑一下 由于`b = a`，那么就先要确定`a`的值，这个`a`的值怎么确定呢？需要在`b`可以访问到的作用域链中确定`a`，然而`a`可能又是由其他变量赋值而来，循环往复，期间一旦出现不是简单赋值的情况，比如函数调用，三元判断等运行时信息，追溯就宣告失败，要是`a`本身就是挂在全局对象上的变量，追溯就更加无从谈起。

所以在**编译阶段** 是无法简单确定`b`的值的。

我们再仔细看下上图的报错信息：`a is not defined`。 

![](http://img30.360buyimg.com/njmobilecms/jfs/t1/65430/35/2147/139560/5d075536Ea64acf0a/9ee7dfc3bcf1799d.jpg)

为什么说`a`未定义呢？这是涉及到另外一个问题，我们知道`<Text>Hello</Text>`，其实等效于`React.createElement(Text, null, 'Hello')`，而`React.createElement`方法的返回值就是一个普通`JS`对象，形如

```javascript
// ReactElement对象
{
   tag: Text,
   props: null,
   children: 'Hello'
   ...
}
```

但是，我们刚说了编译阶段需要对`JSX`做等效处理，需要把`JSX`转换为`wxml`，所以`<Text>Hello</Text>`这个`JSX`片段被特殊处理了，`a`不再是一个普通`js`对象，这里我们看到`a`变量甚至丢失了，这里暴露了一个很严重的问题：**代码语义被破坏了**。

### Alita处理方案
正因为**编译时**方案，有如上的限制，常常让你有“我还是在写`React`吗？”这种感觉，毕竟`React is "value UI"`。

![](http://img30.360buyimg.com/njmobilecms/jfs/t1/63346/1/2176/172936/5d087e52E4f54a9ac/2ab7e884d8362cb9.jpg)

而`Alita`保留了`JSX`语义, 实现了一种在小程序上动态处理JSX的方案，那接下来，我们就一步步揭秘Alita的**运行时方案**，沿着下面原理图。我们从两个方面说明：Alita编译阶段，Alita运行时。

![](https://m.360buyimg.com/njmobilecms/jfs/t1/71086/29/207/269191/5ce6731cEc8c1be21/6ece7aa7464b29fa.jpg)

#### 编译阶段
概括的来说，静态编译阶段主要做两个事情：

1. 转译`React`代码，使之可以被小程序识别，具体的比如用`React.createElement`替换`JSX`，比如`async/await`语法处理等等。
2. 枚举并标识独立`JSX`片段，生成小程序`wxml`文件。

为了直观的表明`Alita`与社区其他编译时方案的不同，假定有一下`JSX`片段，我们看下`Alita`静态编译做的事情。

```javascript
const x = <Text>x</Text>

const y = (
	<View>
		<Button/>
		<Image/>
		<View>
			<Text>HI</Text>
		</View>
	</View>
)
```
经过Alita编译阶段之后：

```javascript
const x = React.createElement(Text, {uuid: "000001"}, "x");
const y = React.createElement(
    View,
    {uuid: "000002"},
    React.createElement(Button, null),
    React.createElement(Image, null),
    React.createElement(
        View,
        null,
        React.createElement(Text, null, "HI")
    )
);
```
每一个独立JSX片段，都会被`uuid`唯一标识。同时生成 wxml文件

```html
<template name="000001">
	<Text>x</Text>
</template>

<template name="000002">
	<View>
		<Button/>
		<Image/>
		<View>
			<Text>HI</Text>
		</View>
	</View>
</template>

<!--占位template-->
<template is="{{uiDes.name}}" data="{{...uiDes}}"/>
```

用小程序`template`包裹独立JSX片段，其`name`属性就是上文的`uuid`。最后，需要在结尾生成一个占位模版：`<template is="{{uiDes.name}}" data="{{...uiDes}}"/>`。

`[template is]`的动态性配合`uuid`标识将是运行时处理JSX的关键，下文会继续提及。

编译阶段到这里就结束了。

#### Alita运行时
关于`Alita`运行时，核心是内嵌的`mini-react`，这是一个适用微信小程序并且五脏俱全的`React`。让我们先简单回顾一下`React`的渲染过程：

递归（`React16.x`引入`Fiber`之后，不再使用递归的方式了）的构建组件树结构，创建组件实例，执行组件对应生命周期，`context`计算，`ref`等等。当`state`有更新时，再次调用相应生命周期，判断节点是否复用（`virtual-dom`）等。此外，在执行过程中会调用浏览器`DOM API`（`appendChild`， `removeChild`, `insertBefore`等等方法）不断操作原生节点，最终生成UI视图。

`Alita mini-react`的执行过程基本和这一致，也会递归构建组件树，调用生命周期等等，区别在于`Alita`无法调用`DOM API`，熟悉微信小程序开发的同学都知道，微信小程序屏蔽了`DOM API`。那么没有了`DOM API`，只剩小程序的`wxml`静态模版，怎么实现动态化处理`React`语法呢？

还记得编译阶段生成的`uuid`吗？每一个`uuid`代表了一个独立的`JSX`片段，在`ReactDOM.render`递归执行阶段，Alita会收集聚合`JSX`片段的`uuid`属性，生成并返回`uiDes`数据结构，这个`uiDes`数据包含了所有要渲染的片段信息，这份数据会传递给小程序，然后小程序把`uiDes` 设置给占位模版`<template is="{{uiDes.name}}" data="{{...uiDes}}"/>`，递归渲染出最终的视图。 

下面我们看一段相对复杂的`React`代码，我们将以这段代码，完整的说明`Alita`的运行过程：

```javascript
class App extends React.Component {

    getHeader() {
        return (
            <View>
                <Image/>
                <Text>Header</Text>
            </View>
        )
    }

    f(a) {
        if (!this.props.xx) {
            return a
        }

        return null
    }

    render() {
        const a = <Text>Hello World</Text>
        const b = this.f(a)

        return <View>
            {this.getHeader()}
            {b}
        </View>
    }
}
```

首先用`uuid`标识独立`JSX`片段，并用`babel`转义以上代码，如下：

```javascript
class App extends React.Component {
    getHeader() {
        return React.createElement(
            View, 
            {uuid: "000001"},
            React.createElement(Image, null),
            React.createElement(Text, null, "Header")
        );
    }

    f(a) {
        if (!this.props.xx) {
            return a;
        }

        return null;
    }

    render() {
        const a = React.createElement(Text, {uuid: "000002"}, "Hello World");
        const b = this.f(a);
        return React.createElement(View, {uuid: "000003"}, this.getHeader(), b);
    }

}
```

同时提取独立`JSX`片段生成`wxml`文件：

```
<template name="000001">
    <View>
        <Image/>
        <Text>Header</Text>
    </View>
</template>

<template name="000002">
	<Text>Hello World</Text>
</template>

<template name="000003">
	<View>
		<template is="{{child001.name}}" data="{{...child001}}"/>
		<template is="{{child003.name}}" data="{{...child002}}"/>
	</View>
</template>

<!--占位template-->
<template is="{{uiDes.name}}" data="{{...uiDes}}"/>
```

以上过程都是在编译阶段就处理完毕的，现在让我们考虑一下`ReactDOM.render(<App/>, parent)`执行过程（这里使用`ReactDOM.render`只是方便理解）：
 
1. `ReactDOM.render` 判断出`App`是自定义组件，创建其实例，执行`componentWillMount`等生命周期。递归处理`render`方法返回的`ReactElement`对象，即：`React.createElement(View, {uuid: "000003"}, this.getHeader(), b);`。

2. 处理最外层 `View`，收集`uuid`，生成`UI`描述：`uiDes = {name: "000003"}`

3. 遍历`children`

4. 处理第一个孩子节点：`this.getHeader()`，它的值是`React.createElement(Text,{name: "000001"}, "Header")`，递归处理这个值，由于`Text`是基本元素，递归终止，第一个孩子处理结束。此时`uiDes`的值如下：

    ```
    uiDes = {
    	name: "000003",
    	
    	child001: {
    	    name: "000001"
    	}
    }
    ```
    
4. 处理第二个孩子节点，`b`。当`this.props.xx`为`true`的时候`b`就是`null`，直接忽略。 这里并没有传递`xx`属性，所以`b = a = React.createElement(Text, {name: "000002"}, "Hello World")`。`Text`是基本元素，递归终止，第二个孩子处理结束，此时`uiDes`的值如下：

    ```
    uiDes = {
    	name: "000003",
    	
    	child001: {
    	    name: "000001"
    	},
    	
    	child002: {
    	    name: "000002"
    	}
    }
    ```

5. `children`遍历结束。

6. 微信小程序获取到`uiDes`，设置到下面的占位模版，渲染对应视图，首先是外层`000003 `模版，然后是其两个孩子节点，分别是`000001`模版，`000002`模版，最终渲染出完整视图。

    ```
    <template is="{{uiDes.name}}" data="{{...uiDes}}"/>
    ```
    
在这整个过程中，你的所有`JS`代码都是运行在`React过程`中的，**语义完全一致**，`JSX`片段也不会被任何特殊处理，只是简单的`React.createElement`调用。最终会输出一个`uiDes`数据到小程序，小程序通过这个`uiDes`渲染出视图。另外由于这里的`React过程`只是纯`js`运算，不涉及`DOM`操作，执行是非常迅速的，通常只有几ms，也就是说`mini-react`的开销是很小的。

![](http://img30.360buyimg.com/njmobilecms/jfs/t1/67483/32/2137/19590/5d075583E3439096c/e8ab5af7b74481e2.jpg)

以上可见`Alita`对`JSX`片段的处理是动态的，你可以在任何地方，任何函数出现任何`JSX`片段, 最终代码执行结果会确定渲染哪一个片段，只有执行结果的片段的`uuid`会被写入`uiDes`。这和**编译时**方案的静态识别有着本质的区别。

另外由于上层运行还是`React`，所以`Alita`在支持`redux`等库上有天然的优势。
 
### 总结
我们需要一种更加`React`的方式处理小程序。`Alita`在这个方向上更进了一些，`Alita`的[源码](https://github.com/areslabs/alita)是完全公开的，我们也会不断提供剖析`Alita`原理的文章，希望给社区带来一个新的思路，也给开发者提供一个新的选择，另外让更多的的开发者理解`Alita`的原理，也是希望更多的人能够参与进来， "**The world needs more heroes!!**”。

`Alita`可以转换`React`应用吗？基于我们内部需求，我们只处理了`React Native`代码。但是`React`语法处理是相通的，把`Alita`扩展到转换`React`应用并不是很困难，不过暂时我们还没有扩展的排期，我们下一步的计划是优化/重构内部在使用的**RN转H5工具**，最终的形态应该是基于RN开发生态，通过`Alita`转换引擎支持实现全端的覆盖。

额外提一句，`Flutter`也是可以运行在`Web`端的，而微信小程序的运行环境就是`web`，那么基于`Alita`**运行时**方案，是不是可以幻想一下`Flutter`与微信小程序的融合呢。

Github: [https://github.com/areslabs/alita](https://github.com/areslabs/alita)