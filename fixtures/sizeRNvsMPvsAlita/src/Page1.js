import React, { Component } from "react";
import { StyleSheet, Text, View, Platform } from "react-native"

import Comp1 from './Comp1'

import A from './a'

export default class Page1 extends Component {


    render() {
        return (
            <View>
				<Text>Page1</Text>
				<Comp1/>
				<A/>
            </View>
        );
    }
}