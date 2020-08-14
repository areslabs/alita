import React, { Component } from "react";
import { StyleSheet, View } from "react-native"

import Hook1 from './hook1'
import { ThemeContext } from './Context'

export default class HelloWorld extends Component {
	constructor(props) {
    super(props)
    this.state = {
      theme: 'iii'
    }
	}

	componentDidMount() {
    setTimeout(() => {
      this.setState({
        theme: 'aaa'
      })
    }, 3000)
  }
	
	render() {
		const {theme} = this.state

		return (
			<View style={styles.container}>
				<ThemeContext.Provider
          value={{
            theme
          }}
        >
          <View style={{ paddingTop: 20 }}>
            <Hook1 />
          </View>
        </ThemeContext.Provider>
			</View>
		)
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
