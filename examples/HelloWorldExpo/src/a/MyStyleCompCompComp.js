import React, {Component} from 'react'
import {View, Text, Button, StyleSheet} from 'react-native'

export default class MyStyleCompCompComp extends Component {

    state = {
        bw: 2
    }

    render() {
        return <View style={{borderWidth: this.state.bw, borderColor: '#89abcd'}}>
            <View style={styles.item}>
                <Text style={styles.itemText}>MyStyleCompCompComp</Text>
            </View>
            <Button
                title="Change Boder Width"
                onPress = {() => {
                    this.setState({
                        bw: this.state.bw * 2
                    })
                }}
            />
        </View>
    }
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 38
    },
    itemText: {
        color: '#444',
        fontSize: 14
    },
});