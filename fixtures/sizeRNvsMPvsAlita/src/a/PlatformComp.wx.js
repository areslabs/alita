import React, {Component} from 'react'
import {Text, View} from 'react-native'

export default class PlatformComp extends Component {

    render() {
        return <View style={this.props.style}><Text style={{color: '#444', fontSize: 14}}>WEIXIN PlatformComp</Text></View>
    }
}