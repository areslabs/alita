import React, { Component } from "react";
import { StyleSheet, Text, View, Platform, FlatList, SectionList, ScrollView, Button } from "react-native"

import ChildComp, {A}from './ChildComp'

import FuncComps from './FuncComps'

const DATA = [
	{
		title: "Main dishes",
		data: ["Pizza", "Burger", "Risotto"]
	},
	{
		title: "Sides",
		data: ["French Fries", "Onion Rings", "Fried Shrimps"]
	},
	{
		title: "Drinks",
		data: ["Water", "Coke", "Beer"]
	},
	{
		title: "Desserts",
		data: ["Cheese Cake", "Ice Cream"]
	}
];

class Head extends Component{

	componentDidMount() {
		console.log('Head: didMount')
	}

	render() {
		return <Text>Head</Text>
	}
}

function getUsers(num) {
	const arr = []

	for(let i = 0; i < num; i ++) {
		arr.push({
			name: parseInt(Math.random() * 10000000)
		})
	}
	return arr
}


export default class HelloWorld extends Component {

	state = {
		users: getUsers(4),
	}


    render() {
        return (
            <View style={styles.container}>
				<ChildComp
					renderHead={<Head/>}
					renderFooter={(x, y, z) => <Text>Footer: {x}{y}{z}</Text>}

					renderBodys={[
						<View style={{flex: 1, backgroundColor: 'green'}}/>,
						<View style={{flex: 2, backgroundColor: 'blue'}}/>,
						<View style={{flex: 3, backgroundColor: 'black'}}/>,
					]}

					renderSwitch={(bool) => {
						return bool ? <A/> : <B/>
					}}

					renderKeys={(arr) => {
						return arr.map(item => {
							return <Item key={item} txt={item}/>
						})
					}}

					renderKeys2={(arr) => {
						return arr.map((item, index) => {
							return <Item key={index} txt={item}/>
						})
					}}

					renderNull={() => {
						return null
					}}

					xxComponent={<Text>xxComponent</Text>}


					notStartWithRender={() => {
						return <Text>notStartWithRender</Text>
					}}

					notEndWithComponentHH={<Text>notEndWithComponentHH</Text>}
				>
					<Text>children1</Text>
					<Text>children2</Text>
					<Text>children3</Text>
				</ChildComp>

				<FuncComps/>


				<ScrollView>
					<Text>HI</Text>
				</ScrollView>

				<Button
					title={"reverse list Data!"}
					onPress={() => {

						const users = [...this.state.users]
						users.reverse()
						this.setState({
							users: users
						})
					}}
				/>

				<FlatList
					style={{ width: '100%', height: 200}}


					ListHeaderComponent={() => <View><Text>ListHeaderComponent</Text></View>}

					data={this.state.users}
					keyExtractor={this.keyExtractor}
					renderItem={this.renderItem}
				/>


				<SectionList
					sections={DATA}
					keyExtractor={(item, index) => item + index}
					renderItem={({ item }) => <Item txt={item} />}
					renderSectionHeader={({ section: { title } }) => (
						<Text style={{fontSize: 18, color: 'blue', borderWidth: 1}}>{title}</Text>
					)}
				/>


            </View>

        );
    }


	renderItem = ({item, index}) => {
		return <ListItem txt={item.name}/>
	}
	count = 1

	keyExtractor = (item, index) => {
		return (this.count ++) + ''
	}

}

class ListItem extends Component {

	componentDidMount() {
		console.log('ListItem: didMount:', this.props.txt)
	}

	componentWillReceiveProps(nextProps) {
		console.log('ListItem componentWillReceiveProps: props:', this.props.txt, ' nextProps:', nextProps.txt)
	}

	render() {
		return <Text>ListItem: {this.props.txt}</Text>
	}
}

class Item extends Component {

	componentDidMount() {
		console.log('Item: didMount:', this.props.txt)
	}

	componentWillReceiveProps(nextProps) {
		console.log('Item componentWillReceiveProps: props:', this.props.txt, ' nextProps:', nextProps.txt)
	}

	render() {
		return <Text>Item: {this.props.txt}</Text>
	}
}



class B extends Component {

	componentDidMount() {
		console.log('B: didMount')
	}

	render() {
		return <Text>B</Text>
	}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        width: 100,
        height: 100
    }
})