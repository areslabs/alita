/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import React from 'react'
import {View, Text, Animated, StyleSheet} from 'react-native'


export default class Hi extends React.Component {

    state = {
        fadeAnim: new Animated.Value(1)
    }

    componentDidMount() {
        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: 0,
                duration: 5000,
            }
        ).start();
    }

    render() {
        return (
            <View
                style={[this.props.style, styles.container]}
            >
                <Animated.Text
                    style={{
                        ...this.props.textStyle,
                        opacity: this.state.fadeAnim,
                    }}
                    onPress={() => {
                        console.log('Hi ', this.props.name, ' !')
                        this.props.textPress && this.props.textPress()
                    }}
                >Hi {this.props.name}!</Animated.Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        backgroundColor: 'yellow',
    }
})
