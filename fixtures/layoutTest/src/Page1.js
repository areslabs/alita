import React, {Component} from "react";
import {StyleSheet, Text, View, Platform, Button} from "react-native"
import {history} from '@areslabs/router'

import B1 from './B1'

class A extends Component {
	state = {
		height: 100
	}

	render() {
		return (
			<View style={{height: this.state.height}}>
				<Button
					title={"点击我！触发布局改变和多个setState调用"}
					onPress={() => {
						this.setState({
							height: this.state.height + 100
						})
					}}
				/>
			</View>

		)
	}
}

class B extends Component {
	state = {
		y: null,
	}

	render() {
		return <View
			onLayout={(e) => {
				console.log('B:', e.nativeEvent.layout)
				this.setState({
					y: e.nativeEvent.layout.y
				})
			}}
		>
			<Text>By: {this.state.y}</Text>
			<B1/>
		</View>
	}
}

export default class Page1 extends Component {

	state = {
		oneY: null,
		twoY: null,
	}

	render() {
		return (
			<View style={styles.container}
				  onLayout={(e) => {
					  console.log('container:', e.nativeEvent.layout)
				  }}
			>
				<Button
					title={"to Page2"}
					onPress={() => {
						history.push('Page2')
					}}
				/>

				<Button
					title={"点击 调用setState，不改变布局"}
					onPress={() => {
						this.setState({})
					}}
				/>

				<View onLayout={(e) => {
					console.log('one:', e.nativeEvent.layout)
					this.setState({
						oneY: e.nativeEvent.layout.y
					})
				}}>
					<Text>Oney: {this.state.oneY}</Text>
				</View>
				<A/>
				<View onLayout={(e) => {
					console.log('two:', e.nativeEvent.layout)
					this.setState({
						twoy: e.nativeEvent.layout.y
					})
				}}>
					<Text>Twoy:{this.state.twoy} </Text>
				</View>
				<B/>
			</View>

		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
	},
	logo: {
		width: 100,
		height: 100
	}
})