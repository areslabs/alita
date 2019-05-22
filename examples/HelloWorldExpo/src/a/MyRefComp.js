import React, {Component} from 'react'
import {View, Text, Button, StyleSheet} from 'react-native'
import styles from './styles';

export default class MyRefComp extends Component {

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
            <View style={styles.item}>
                <Text style={styles.itemText}>{this.state.count}</Text>
            </View>
        )
    }
}
