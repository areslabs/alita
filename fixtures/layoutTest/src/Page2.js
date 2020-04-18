import React, {Component} from "react";
import {StyleSheet, Text, View, Button} from "react-native"

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

export default class Page2 extends Component {

	state = {
		oneY: null,
		twoY: null,
	}

	renderX() {
		return (
			<View style={styles.container}
				  onLayout={(e) => {
					  console.log('container:', e.nativeEvent.layout)
				  }}
			>
				<A/>
				<View onLayout={(e) => {
					console.log('two:', e.nativeEvent.layout)
					this.setState({
						twoy: e.nativeEvent.layout.y
					})
				}}>
					<Text>Twoy:{this.state.twoy} </Text>
				</View>
			</View>
		)
	}

	render() {
		return this.renderX()
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