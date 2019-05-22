import React, {Component} from 'react'
import {View, Text, Button} from 'react-native'

export default class MyPropComp extends Component {

    render() {
        return <View>
            {this.props.headerComponent}
            {this.props.footerComponent()}
        </View>

    }
}