import React, {Component} from 'react'
import {View, Text} from 'react-native'

import styles from './styles';

export default class MyForceUpdateInnerInner extends Component {
    shouldComponentUpdate() {
        console.log('MyForceUpdateInnerInner shouldComponentUpdate')
        return true
    }

    render() {
        console.log('xxx:', new Date().getTime(), this)
        return (
            <View style={styles.item}>
                <Text>forceUpdate: {new Date().getTime()}</Text>
            </View>
        )
    }
}