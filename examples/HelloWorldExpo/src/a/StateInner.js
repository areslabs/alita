/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react'
import {View, Text} from 'react-native'

export default class StatelessTest extends React.Component {
    render() {
        const {label, name} = this.props
        return (
            <View>
                <Text>{label}</Text>

                <StateInner name={name}/>
            </View>
        )
    }
}