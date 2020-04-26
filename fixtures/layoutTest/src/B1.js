/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {Component} from "react";
import {StyleSheet, Text, View, Platform, Button} from "react-native"

export default class B1 extends Component {
	state = {
		y: null,
	}

	componentWillUpdate() {
		console.log('更新的时候：B1 componentWillUpdate 应该只打印一次！！！')
	}

	render() {
		return <View
			onLayout={(e) => {
				console.log('B1:', e.nativeEvent.layout)
				this.setState({
					y: e.nativeEvent.layout.y
				})
			}}
		>
			<Text>B1y: {this.state.y}</Text>
		</View>
	}
}
