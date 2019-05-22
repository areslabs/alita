### 支持Redux
Redux是react实际最流行的数据层管理方案， 小程序转化引擎是完全支持Redux的使用的。 

Redux项目的入口文件需要做一些修改, 手动把store通过context方式传递下去。 
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
需要添加 代码中的1， 2

具体的使用参考 examples目录下的Todo
