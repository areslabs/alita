import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text} from 'react-native'
import styles from './styles';

export default class MyContext extends Component {


    static contextTypes = {
        color: PropTypes.string
    }

    render() {
        return (
            <View style={[styles.item, {borderBottomWidth: 0}]}>
                <Text style={styles.itemText}>{this.context.color}{this.props.name}{this.props.age}</Text>
            </View>
        )
    }
}