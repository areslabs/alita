# @areslabs/eslint-plugin-rntomp

React Native 转化为小程序的rules

## Installation

首先， 安装 [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, 安装 `@areslabs/eslint-plugin-rntomp`:

```
$ npm install @areslabs/eslint-plugin-rntomp --save-dev
```

**注意:** 如果eslint是全局安装的（使用`-g`），那么`@areslabs/eslint-plugin-rntomp` 也需要全局安装

## 使用
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


## Supported Rules

* [component-static-path](./docs/rules/component-static-path.md) 导入组件的需要确定路径
* [no-as-in-rncomponent](./docs/rules/no-as-in-rncomponent.md) 导入组件的时候不能使用as关键字
* [no-direct-children](./docs/rules/no-direct-children.md) children会被引擎静态分析， 需要写全this.props.children
* [no-direct-xxcomponent](./docs/rules/no-direct-xxcomponent.md) xxComponent会被引擎静态分析, 需要写全this.props.xxComponent
* [no-global](./docs/rules/no-global.md) 小程序不支持global变量
* [no-h](./docs/rules/no-h.md) h是引擎保留字
* [no-jsxelement-inhoc](./docs/rules/no-jsxelement-inhoc.md) 小程序高阶组件，需要使用createElement创建元素
* [no-jsxspreadattribute-basecomponent](./docs/rules/no-jsxspreadattribute-basecomponent.md) React Native基本组件不支持属性展开， 自定义组件可以使用属性展开
* [no-member-jsxelement](./docs/rules/no-member-jsxelement.md) 不允许使用<A.B/>
* [no-rn-animated](./docs/rules/no-rn-animated.md) 动画使用wx-animated库， 不要直接使用RN的动画
* [no-webview](./docs/rules/no-webview.md) 小程序webview和RN webview差别比较大， 谨慎使用
* [not-support-api](./docs/rules/not-support-api.md) 小程序不支持的API
* [not-support-component](./docs/rules/not-support-component.md) 小程序不支持组件
* [not-support-jsxattributes](./docs/rules/not-support-jsxattributes.md) 小程序不支持属性
* [one-file-one-component](./docs/rules/one-file-one-component.md) 一个JS文件最多存在一个组件
* [wx-hoc](./docs/rules/wx-hoc.md) 小程序高阶组件限制



 







