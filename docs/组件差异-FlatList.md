## FlatList

* 当发现滚动不了的时候，通常需要添加`flex: 1`, 指明高度
* 下拉刷新，由于开发者工具和真机的效果可能不同，请以真机为准
* 长列表在Android 如果卡顿，请把renderItem 写成一个无状态组件，引擎在无状态组件的时候有[更好的性能体验](./React与小程序的数据交换方式.md)
* stickyHeaderIndices 需要配合 getItemLayout属性使用， 否则将不生效
  