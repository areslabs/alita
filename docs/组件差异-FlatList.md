## FlatList

* 当发现滚动不了的时候，通常需要添加 `flex: 1` , 指明高度。
* 下拉刷新，由于开发者工具和真机的效果可能不同，请以真机为准。
* `stickyHeaderIndices` 需要配合 `getItemLayout` 属性使用，否则将不生效。
  