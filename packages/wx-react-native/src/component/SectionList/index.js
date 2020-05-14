/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {
    PureComponent,
    createElement,
    instanceManager,
    styleType,
    tackleWithStyleObj
} from "@areslabs/wx-react"
const {SCROLL} = styleType

//TODO 移除phblock 使用

function getGenericTemplate(tempVnode, datakey,) {
	return createElement('template', {
		datakey,
		tempVnode
	})
}

export default class WXSectionList extends PureComponent {

    componentWillReceiveProps(nextProps) {
        if (this.props.refreshing !== undefined && this.props.refreshing !== nextProps.refreshing) {
            const wxInst = instanceManager.getWxInstByUUID(this.__diuu__);
            wxInst.setData({
                sr: nextProps.refreshing
            })
        }
    }

    getStyleAndDiuu() {
        const {style, contentContainerStyle} = this.props
        return {
            diuu: '',
            style: tackleWithStyleObj(style, SCROLL),
            contentContainerStyle: tackleWithStyleObj(contentContainerStyle)
        }
    }

    render() {
        const {
            ListHeaderComponent,
            ListFooterComponent,

            sections,
            renderItem,
            renderSectionFooter,
            renderSectionHeader,

            keyExtractor,
            contentContainerStyle = '',
            numColumns = 1,
            onEndReachedThreshold = null,
            refreshing = false,
            onRefresh,
            renderScrollComponent
        } = this.props

        const children = []

        if (ListHeaderComponent) {
			const CPTVnode = ListHeaderComponent.isReactElement ? ListHeaderComponent : ListHeaderComponent()

			children.push(getGenericTemplate(CPTVnode, 'ListHeaderComponent'))
        }

        if (sections && sections.length > 0) {
            const body = createElement("template", {
                datakey: "sections",
                tempVnode: sections.map((item, index) => {

                    const seChildren = []

                    if (renderSectionHeader) {
                    	const CPTVnode = renderSectionHeader({
							section: item
						})
                        seChildren.push(getGenericTemplate(CPTVnode, 'renderSectionHeader'))
                    }

                    if (item.data && item.data.length > 0 && renderItem) {
                        const sbody = createElement('template', {
                            datakey: 'renderItem',
                            tempVnode: item.data.map((iitem, index) => {

                                const CPTVnode = renderItem({
                                    item: iitem,
                                    index,
                                    section: item
                                })


                                let key = index
                                if (keyExtractor) {
                                    key = keyExtractor(iitem, index)
                                } else {
                                    key = iitem.key
                                }

								if (CPTVnode.isReactElement) {
									CPTVnode.key = key
								}

								return CPTVnode
                            })
                        })
                        seChildren.push(sbody)
                    }

                    if (renderSectionFooter) {
						const CPTVnode = renderSectionFooter({
							section: item
						})

						seChildren.push(getGenericTemplate(CPTVnode, 'renderSectionFooter'))
                    }

					return createElement('phblock', {
						key: item.key || index,
						tempName: 'sectionsRender'
					}, ...seChildren)
                }),
            })

            children.push(body)
        }


		if (ListFooterComponent) {
			const CPTVnode = ListFooterComponent.isReactElement ? ListFooterComponent : ListFooterComponent()

			children.push(getGenericTemplate(CPTVnode, 'ListFooterComponent'))
		}

        return createElement('phblock', {
            contentContainerStyle,
            numColumns,
            onEndReachedThreshold: onEndReachedThreshold ? onEndReachedThreshold * 300 : 0,
            refreshing,
            onRefreshPassed: !!onRefresh,
            renderScrollComponentPassed: !!renderScrollComponent,

            ...(this.getStyleAndDiuu())
        }, ...children)
    }
}