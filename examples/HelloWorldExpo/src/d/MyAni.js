import React, {Component} from 'react'
import {View, Image, Text} from 'react-native'
import {AnimationEnable} from '@areslabs/wx-animated'

// @AnimationEnable
class MyAni extends Component {

    render() {
        return (
            <View style={[{alignItems: 'center'}, this.props.style]}>
                <Image style={{width: 60, height: 60}} source={require('./alita.jpg')}/>
                <Text>Alita</Text>
            </View>
        )
    }
}

export default AnimationEnable(MyAni)