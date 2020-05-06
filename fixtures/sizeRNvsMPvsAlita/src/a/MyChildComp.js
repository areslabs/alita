import React from 'react'
import {View} from 'react-native'

export default class MyChildComp extends React.Component {


    render() {


        return (
            <View>
                {this.props.children[2]}
                {this.props.children[1]}
                {this.props.children[0]}
            </View>
        )
    }
}