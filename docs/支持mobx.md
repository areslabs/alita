## 支持mobx
[mobx](https://github.com/mobxjs/mobx) 是React技术栈除了Redux之外，另一个比较流行的数据管理库。 Alita从1.0.2版本开始支持[mobx](https://github.com/mobxjs/mobx)的使用。

[mobx](https://github.com/mobxjs/mobx)最新的版本是**5.x**，但是**5.x**在实现上使用了[ES6 Proxies](https://kangax.github.io/compat-table/es6/#test-Proxy)。处于对兼容性的考虑，包括RN的兼容性，Alita转化H5的兼容性等等，我们并没有使用最新的**5.x**版本，而是使用了**4.11.0**， 对应的[mobx-react](https://github.com/mobxjs/mobx-react)使用了**5.4.4**版本。 所以在你的React Native项目，请：

```shell
npm install mobx@4.11.0 mobx-react@5.4.4 --save
```



