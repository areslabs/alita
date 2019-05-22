import React, {PureComponent} from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'

export default class Todo extends PureComponent {

    render() {
        const {onClick, completed, text} = this.props

        return <View>
            <TouchableOpacity
                style={styles.item}
                onPress={onClick}
            >
                <Text
                    style={[styles.todo, {color: completed ? '#FF8077' : '#777'}]}
                >
                    {text}
                </Text>
            </TouchableOpacity>
        </View>
    }
}

const styles = StyleSheet.create({
    item: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    todo: {
        color: '#555',
        fontSize: 18,
        lineHeight: 44,
        paddingLeft: 10
        
    }
});