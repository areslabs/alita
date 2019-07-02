/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {Component} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {inject, observer} from 'mobx-react'

/*演示inject接收函数的时候*/
@inject((allStores) => {
    return {
        ...allStores.room
    }
})
@observer
export default class TotalInfo extends Component {

    render() {
        const {bedRoom1, bedRoom2, kitchen, bookroom, total} = this.props

        return (
            <View>
                <Text>{bedRoom1.label}：{bedRoom1.price}¥</Text>
                <Text>{bedRoom2.label}：{bedRoom2.price}¥</Text>
                <Text>{kitchen.label}：{kitchen.price}¥</Text>
                <Text>{bookroom.label}：{bookroom.price}¥</Text>
                <Text>总价：{total}¥</Text>
            </View>
        )
    }
}

