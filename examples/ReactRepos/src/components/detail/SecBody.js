import React, {Component} from 'react'
import {Platform, StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity} from 'react-native'
import {AnimationEnable} from '@areslabs/wx-animated'
import {token} from '../../util'

class SecBody extends Component {

    state = {
        users: []
    }

    componentDidMount() {
        fetch(`${this.props.apiUrl}?access_token=${token}`)
            .then(res => res.json())
            .then(r => {
                this.setState({
                    users: r.slice(0, 20)
                })
            })
    }

    render() {
        return <View style={[{height: 0, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden'}, this.props.style]}>
            {
                this.state.users.map(ele => {
                    return (<Image key={ele.id + ''} source={{uri: ele.avatar_url}} style={{width: 70, height: 70, marginLeft: 5}}></Image>)
                })
            }
        </View>
    }
}

export default AnimationEnable(SecBody)