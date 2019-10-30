/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


import React from 'react'
import {View, Text} from 'react-native'

export default class HelloRN extends React.Component {
    render() {
        return (
            <View style={this.props.style}>
                <Text
                    style={this.props.textStyle}
                    onPress={() => {
                        console.log('HelloRN: ', this.props.name, ' !')
                        this.props.textPress && this.props.textPress()
                    }}
                >HelloRN: {this.props.name}!</Text>
            </View>
        )
    }
}

