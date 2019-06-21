import React, {Component} from 'react'
import {TouchableOpacity, View} from 'react-native'
import MyForceUpdateInner from './MyForceUpdateInner'

export default class MyForceUpdate extends Component {
    shouldComponentUpdate() {
        console.log('MyForceUpdate shouldComponentUpdate')
        return true
    }

    componentWillUpdate() {
        console.log('MyForceUpdate componentWillUpdate')
    }

    render() {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        this.forceUpdate(() => {
                            console.log('end forceUpdate')
                        })
                    }}
                >
                    <MyForceUpdateInner/>
                </TouchableOpacity>
            </View>
        )
    }
}