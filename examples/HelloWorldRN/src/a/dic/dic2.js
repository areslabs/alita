/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from "react";
import { Button, ScrollView, StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions } from "react-native";


export class Dic21 extends Component {

    render() {
        return (
            <View style={this.props.style}>
                <Text
                    onPress={() => {
                        console.log('Dic21')
                    }}
                >Dic21</Text>
            </View>
        )
    }
}

export class Dic22 extends Component {

    render() {
        return (
            <View style={this.props.style}>
                <Text
                    onPress={() => {
                        console.log('Dic22')
                    }}
                >Dic22</Text>
            </View>
        )
    }
}