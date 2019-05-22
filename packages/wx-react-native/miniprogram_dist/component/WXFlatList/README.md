### FlatList

对应 renderItem 这种形式， 有两种可选的解决方案
1. 使用template
2. 使用小程序的 "抽象组件"

#### 使用 template
1. 由于`<import src="template.wxml"/>` 这里的src不可以是变量绑定， 必须写死。 那么
只能把所有使用FlatList组件的地方都什么到一个文件
2. 当renderItem里面使用了其他组件， 必须在FlatList的json文件里面导入， 由于FlatList是可能会在
应用的任何地方使用， 所以这个json很难维护
3. renderItem里面可能使用了其他 template （可能是用函数调用等生成的template），需要在FlatList的wxml
导入这个template，  由于FlatList是可能会在应用的任何地方使用， 所以这个导入很难维护
 
#### 使用 抽象组件
1. 需要根据renderItem的内容生成一个组件， 根据小程序的规则，每个组件会生成至少需要4个文件(.js, .json, .wxml, .wxss),
会导致生成需要额外的文件
2. 组件实例的开销应该大于template

综上： 由于template方案实现起来比较复杂， 且考虑到之后的即时转化等功能， 我们FlatList的实现选用 "抽象组件" 
这种方式。


#### 其他
1. sticky 的问题
https://developers.weixin.qq.com/community/develop/doc/000822852048a0beb6185a28e56400?highLine=%25E6%25BB%259A%25E5%258A%25A8%2520setData
https://developers.weixin.qq.com/community/develop/doc/0006a6c1bc4aa88ebcd73fb7156400
https://developers.weixin.qq.com/community/develop/doc/0006a6c1bc4aa88ebcd73fb7156400
