## ScrollView

* 不支持 `scrollEnabled` 属性。
* 不支持 `pagingEnabled` 属性 ，推荐使用 `ViewPager` 这个组件替代。
* 当发现滚动不了的时候，通常需要添加 `flex: 1`, 指明高度。