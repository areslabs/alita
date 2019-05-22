## 代码检查&Eslint
为了减少代码在转化过程中出现问题以及方便老项目转化， 我们提供了一个rntomp的eslint plugins。 建议项目在执行转化脚本之前，先用
eslint检查一下。我们正在不断优化这个plugins，争取让它能够覆盖的情形越来越多。


### Installation

首先， 安装 [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, 安装 `@areslabs/eslint-plugin-rntomp`:

```
$ npm install @areslabs/eslint-plugin-rntomp --save-dev
```

**注意:** 如果eslint是全局安装的（使用`-g`），那么`@areslabs/eslint-plugin-rntomp` 也需要全局安装

### 使用
最简单的使用方式， 在你的.eslint.js配置文件 添加`@areslabs/eslint-plugin-rntomp`
```javascript
module.exports = {
    ...
    extends: [
        ...
        "plugin:@areslabs/rntomp/all"
    ]
};
```
all配置里面， 包含了所以rntomp rules

### 单独rules使用
1. 添加 `@areslabs/rntomp` 到`.eslintrc`配置文件的 plugins

```json
{
    "plugins": [
        "@areslabs/rntomp"
    ]
}
```

2. 在rules 字段里面配置rule

```json
{
    "rules": {
        "@areslabs/rntomp/no-h": 2
    }
}
```

### Supported Rules

* [component-static-path]() 导入组件的需要确定路径
* [no-as-in-rncomponent]() 导入组件的时候不能使用as关键字
* [no-direct-children]() children会被引擎静态分析， 需要写全this.props.children
* [no-direct-xxcomponent]() xxComponent会被引擎静态分析, 需要写全this.props.xxComponent
* [no-global]() 小程序不支持global变量
* [no-h]() h是引擎保留字
* [no-jsxelement-inhoc]() 小程序高阶组件，需要使用createElement创建元素
* [no-jsxspreadattribute-basecomponent]() React Native基本组件不支持属性展开， 自定义组件可以使用属性展开
* [no-member-jsxelement]() 不允许使用<A.B/>
* [no-rn-animated]() 动画使用wx-animated库， 不要直接使用RN的动画
* [no-webview]() 小程序webview和RN webview差别比较大， 谨慎使用
* [not-support-api]() 小程序不支持的API
* [not-support-component]() 小程序不支持组件
* [not-support-jsxattributes]() 小程序不支持属性
* [one-file-one-component]() 一个JS文件最多存在一个组件
* [wx-hoc]() 小程序高阶组件限制