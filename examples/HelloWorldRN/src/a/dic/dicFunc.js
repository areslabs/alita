/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from "react";
import { Button, ScrollView, StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions } from "react-native";


function X() {
    return <Text>X</Text>
}

const Y = () => {
    return <Text>Y</Text>
}

const Z = function () {
    return <Text>ZZ</Text>
}

export const DF1 = () => {
    return <Text>DF1</Text>
}

export const DF2 = () => <Text>DF2</Text>

export function DF3() {
    return <Text>DF3</Text>
}


export default (props) => {
    return <View style={props.style}>
        <X/>
        <Y/>
        <Z/>
    </View>
}

