/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { Component } from "react";
import { Button, ScrollView, StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions } from "react-native";


class Inner extends Component {
    render() {
        return (<Text>Inner</Text>)
    }
}

class Dic1 extends Component {

    render() {
        return (
            <View style={this.props.style}>
                <Text
                    onPress={() => {
                        console.log('Dic1')
                    }}
                >Dic1</Text>

                <Inner/>
            </View>
        )
    }
}

const Troublemaker = Dic1
export default Troublemaker