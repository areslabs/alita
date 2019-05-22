import React, {Component} from 'react'
import {Platform, StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity} from 'react-native'


export default class LoadingView extends Component {

    render() {
        return <View style={styles.loading}>
            <Text>Loading...</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})