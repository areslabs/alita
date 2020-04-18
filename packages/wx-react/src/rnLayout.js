/**
 *  Copyright (c) Areslabs.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *
 * onLayout: Invoked on mount and layout changes with
 *
 * class A extends Component {
 *     state = {
 *         height: 100
 *     }
 *
 *     render() {
 *         <View style={{height: this.state.height}}>
 *             <Text
 *                onPress={() => {
 *                    this.setState({
 *                        height: this.state.height + 100
 *                    })
 *                }}
 *             >HW</Text>
 *         </View>
 *     }
 * }
 *
 * class App extends Component {
 *     render() {
 *         return (
 *             <View>
 *                 <View onLayout={() => {console.log('one'}}/>
 *                 <A/>
 *                 <View onLayout={() => {console.log('two'}}/>
 *             </View>
 *
 *         )
 *     }
 * }
 *
 * 根据onLayout的定义，首先在初始渲染的时候，需要打印`one`, `two`
 *
 * 当不断的点击A组件的时候，由于A组件高度的变化，将会导致 two不断的被打印
 *
 * 在小程序上如何实现类似onLayout的机制呢？小程序无法在渲染之前获取布局，但是在渲染之后是有机会获取的。
 * 我们在每一次渲染之后，都对含有onLayout标签的节点，进行一次布局检测，发现布局变化就调用onLayout 回调（感谢canfoo[https://github.com/canfoo]的启发性工作）
 *
 * 具体的，我们通过微信小程序API wx.createSelectorQuery，获取元素的布局。 为了减少调用createSelectorQuery次数（是个异步操作），利用跨自定义组件的后代选择器 特性使用如下的选择元素代码：
 * wx.createSelectorQuery().selectAll('.page-container, .page-container >>> .m-lt')
 *
 * 此外：如上面的例子所示，一个更新可能导致n（n >= 0）个毫无父子关系节点的布局变化，故会同时发生多个节点调用onLayout，而onLayout方法回调之中通常存在setState调用，
 * 我们需要合并这些setState，故对onLayout的调用，需要包裹在`unstable_batchedUpdates`中
 *
 */

import {unstable_batchedUpdates} from './UpdateStrategy'
import {getEventHandler, getMpCurrentPage} from './util'


const pageLayoutElements = {}

/**
 * 当页面销毁的时候，需要把缓存的数据清空
 * @param pageDiuu
 */
export function cleanPageLayoutElements(pageDiuu) {
	delete pageLayoutElements[pageDiuu]
}

export function invokeAllLayout() {
	// 我们只检查当前页面所有的onLayout节点布局变化
	wx.createSelectorQuery()
		.selectAll('.m-lt, .page-container >>> .m-lt') // 通过`跨自定义组件的后代选择器` 减少createSelectorQuery的次数
		.boundingClientRect()
		.exec(res => {
			const allItems = res[0]
			if (allItems.length === 0) return

			// 批量更新，减少实际的更新次数
			unstable_batchedUpdates(() => {
				const curPage = getMpCurrentPage()
				const pageDiuu = curPage.data.diuu

				const oldPageElements = pageLayoutElements[pageDiuu]
				const newPageElements = {}

				allItems.forEach(item => {
					const diuu = item.dataset.diuu

					if (oldPageElements && oldPageElements[diuu] && layoutEqual(oldPageElements[diuu], item)) {
						// 布局没有变化
						newPageElements[diuu] = oldPageElements[diuu]
						return
					}

					newPageElements[diuu] = {
						x: item.left,
						y: item.top,
						width: item.width,
						height: item.height
					}

					const method = getEventHandler(item.dataset.parent, diuu, 'onLayout')
					if (method) {
						method({
							nativeEvent: {
								layout: newPageElements[diuu]
							}
						})
					}
				})
				pageLayoutElements[pageDiuu] = newPageElements
			})
		})
}

function layoutEqual(layout1, layout2) {
	return (layout1.x === layout2.left
		&& layout1.y === layout2.top
		&& layout1.width === layout2.width
		&& layout1.height === layout2.height
	)
}
