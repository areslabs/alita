/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from "react";
import { Button, ScrollView, StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions } from "react-native";

import {Dic22, Dic21} from './dic2'

class Dic3X extends Component {

    render() {
        return (
            <View style={this.props.style}>
                <Text
                    onPress={() => {
                        console.log('Dic3')
                    }}
                >Dic3</Text>
            </View>
        )
    }
}

export class Dic31 extends Component {

    render() {
        return (
            <View style={this.props.style}>
                <Text
                    onPress={() => {
                        console.log('Dic31')
                    }}
                >Dic31</Text>
            </View>
        )
    }
}

export class Dic32 extends Component {

    render() {
        return (
            <View style={this.props.style}>
                <Text
                    onPress={() => {
                        console.log('Dic32')
                    }}
                >Dic32</Text>

                <Dic21/>
                <Dic22/>
            </View>
        )
    }
}

const Troublemaker = Dic3X

export default Troublemaker