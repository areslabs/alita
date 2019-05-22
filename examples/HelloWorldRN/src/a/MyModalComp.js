import React, {Component} from 'react'
import {View, Text, Button, StyleSheet} from 'react-native'

export default class MyModalComp extends Component {

    state = {
        count: 0
    }

    increCount = () => {
        this.setState({
            count: this.state.count + 1
        })
    }

    render() {
        return (
            <JDNetworkd style/>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});