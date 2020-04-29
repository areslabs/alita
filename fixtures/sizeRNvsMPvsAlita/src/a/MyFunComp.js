import React from 'react'
import PropTypes from 'prop-types'
import {View, Text, StyleSheet} from 'react-native'
import styles from './styles';

export default function MyFunComp({name, age}, {color}) {

    return <View style={styles.item}>
        <Text style={styles.itemText}>{name}{age}{color}</Text>
    </View>
}

MyFunComp.contextTypes = {
    color: PropTypes.string,
}
