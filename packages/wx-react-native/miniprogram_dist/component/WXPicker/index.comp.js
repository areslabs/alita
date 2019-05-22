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
    tackleWithStyleObj,
    styleType
} from "@areslabs/wx-react"

const {VIEW} = styleType

import PickerItem from '../WXPickerItem/index.comp'


export default class WXPicker extends PureComponent {

    getStyleAndDiuu() {
        const {style} = this.props
        return {
            diuu: '',
            style: tackleWithStyleObj(style, VIEW),
        }
    }

    getSelectableIndex(pickData) {
        const {selectedValue} = this.props

        for(let i = 0; i < pickData.length; i++) {
            const item = pickData[i]
            if (item.value === selectedValue) {
                return [i]
            }
        }

        return [0]
    }

    render() {
        const {children} = this.props

        const pickData = []
        const body = createElement("template", {
            datakey: "childrenData",
            tempVnode: children.map((child, index) => {
                const CPTVnode = child
                const {label, value} = child.props
                pickData.push({
                    label,
                    value
                })

                const key = index

                return createElement(
                    'childrenCPT',
                    {
                        key,
                        diuu: "childrenDIUU",
                        CPTVnode,

                        // 最外层元素需要tempName属性， 在这里无实际意义， 只是为了标志， 会影响render函数的执行
                        tempName: 'children'
                    },
                )
            }),
        })

        const seleIndex = this.getSelectableIndex(pickData)


        return createElement('phblock', {
            itemLength: children.length,
            pickData,
            seleIndex,

            ...(this.getStyleAndDiuu()),
        }, body)

    }
}

WXPicker.Item = PickerItem