/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {Component} from "react";
import {StyleSheet, Text, View, Platform, Button} from "react-native"


export default class ChildComp extends Component {


	f() {
		return this.props.renderFooter('a', 'b', 'c')
	}

	fMap() {
		return ['a', 'b', 'c'].map(item => this.props.renderHead)
	}

	componentDidMount() {
		console.log('wx:', this.getWxInst(), this)
	}

	state = {
		x: false,
		arrKeys: ['c', 'b', 'a'],
	}

	render() {
		const {
			renderHead,
			renderFooter,
			renderBodys,
			renderSwitch,
			renderKeys,
			renderKeys2,
			xxComponent,
			renderNull,
			notStartWithRender,
			notEndWithComponentHH,
		} = this.props

		const arr = [
			renderHead,
			renderFooter('1', '2', '3')
		]

		return <View>

			<Button
				title={"toggle"}
				onPress={() => {
					this.setState({
						x: !this.state.x,
						arrKeys: this.state.x ? ['a', 'b', 'c'] : ['c', 'b', 'a']
					})
				}}
			/>

			{renderHead}
			{this.f()}
			{renderFooter && renderFooter('x', 'y', 'z')}

			{arr}

			{this.state.x ? renderHead : renderFooter('j', 'q', 'k')}
			{this.state.x ? renderHead : <A/>}


			<View style={{height: 60}}>
				{renderBodys[0]}
				{renderBodys[1]}
				{renderBodys[2]}
			</View>


			{
				renderKeys(this.state.arrKeys)
			}
			{
				renderKeys2(this.state.arrKeys)
			}

			{
				renderSwitch(this.state.x)
			}

			{
				xxComponent
			}

			{
				this.fMap()
			}

			{
				this.props.children
			}

			{
				notStartWithRender()
			}
			{
				notEndWithComponentHH
			}



			{renderNull()}
		</View>
	}
}

export class A extends Component {
	render() {
		return <Text>A</Text>
	}
}


