### 支持Redux

Redux 是当前 react 应用中流行的数据层管理方案，小程序转化引擎是支持 Redux 的使用。 

使用 Redux 项目的入口文件需要做一些修改, 手动将 store 通过 context 方式传递下去。

```javascript
class ReactRedux extends PureComponent {
    static childContextTypes = {
        store: PropTypes.object // 这里 1
    }
    getChildContext() {
        return {
            store: Platform.OS === 'wx' ? store : {} // 这里 2
        }
    }
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Route key="init" component={Index}/>
                </Router>
            </Provider>
        );
    }
}
```

在 context 上增加 store 属性，需要添加 `childContextTypes` 和 `getChildContext`，如上面代码中的 1 和 2 部分。

具体的使用参考 examples 目录下的 Todo。
