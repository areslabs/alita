/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {Component} from 'react'
import {View, TextInput, Text} from 'react-native'
import {observer} from 'mobx-react'

@observer
class Room extends Component {


    render() {
        const {style, data, autoFocus} = this.props
        console.log('data:', data)
        return (
            <View style={style}>
                <Text>{data.label}：</Text>
                <TextInput
                    autoFocus={autoFocus}
                    value={data.price + ''}
                    style={{borderBottomWidth: 2, width: 40}}
                    onChangeText={(price) => {
                        console.log('price:', price)
                        data.price = Number(price)
                    }}
                />
                <Text> 元</Text>
            </View>
        )
    }
}

export default Room