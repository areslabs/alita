import React, { Component } from "react";
import { StyleSheet, Text, View, Platform , Button} from "react-native"

function randomName() {
	return "ykforerlang".split('').sort(() => {
		return Math.random() > 0.5 ? 1 : -1
	}).join('')
}

export default class Comp1 extends Component {

	state = {
		users: [
			{
				name: randomName(),
				age: parseInt(Math.random() * 20),
			},
			{
				name: randomName(),
				age: parseInt(Math.random() * 20),
			},
			{
				name: randomName(),
				age: parseInt(Math.random() * 20),
			},
			{
				name: randomName(),
				age: parseInt(Math.random() * 20),
			}
		]
	}

	render() {
		return (
			<View
			>
				<View onPress={() => {
					console.log('hi')
				}}>

				</View>
				<Button
					title={"添加用户！"}
					onPress={() => {
						this.setState({
							users: this.state.users.concat([{
								name: randomName(),
								age: parseInt(Math.random() * 20)
							}])
						})
					}}
				/>
				{
					this.state.users.map(({name, age}) => {
						return <View>
							<View>
								<Text>{name}: {age}</Text>
							</View>

							<View>
								{
									age > 10 ? <Text>boy!</Text> : <Text>man!</Text>
								}
								{
									age > 10 ? <Text>young！</Text> : <Text>old!</Text>
								}
							</View>
						</View>
					})
				}
			</View>
		)
	}
}