/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import React from 'react'
import {View, Text} from 'react-native'

import {camelCase} from '@areslabs/stringutil-rn'

export default class Hello extends React.Component {
    render() {
        return (
            <View style={this.props.style}>
                <Text
                    style={this.props.textStyle}
                    onPress={() => {
                        console.log('Hello: ', this.props.name, ' !')
                        this.props.textPress && this.props.textPress()
                    }}
                >Hello: {camelCase(this.props.name)}!</Text>
            </View>
        )
    }
}