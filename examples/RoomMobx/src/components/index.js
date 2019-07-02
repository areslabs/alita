/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {Component} from 'react'
import {View, StyleSheet, Text, Button} from 'react-native'
import {inject} from 'mobx-react'
import TotalInfo from './TotalInfo'
import Room from './Room'

@inject('room')
class Index extends Component {

    render() {
        const {bedRoom1, bedRoom2, kitchen, bookroom, reset} = this.props.room

        return (
            <View style={styles.container}>
                <Text>一个房子</Text>
                <View style={styles.room}>
                    <Room
                        autoFocus={true}
                        style={styles.bedRoom1}
                        data={bedRoom1}
                    />

                    <Room
                        style={styles.bedRoom2}
                        data={bedRoom2}
                    />

                    <Room
                        style={styles.kitchen}
                        data={kitchen}
                    />

                    <Room
                        style={styles.bookroom}
                        data={bookroom}
                    />
                </View>

                <TotalInfo/>

                <Button
                    title="重置"
                    onPress={() => {
                        this.props.room.reset()
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    room: {
        borderWidth: 2,
        height: 300,
        width: 300
    },

    bedRoom1: {
        width: 120,
        height: 120,
        borderWidth: 1,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    bedRoom2: {
        width: 120,
        height: 120,
        borderWidth: 1,
        position: 'absolute',
        right: 0,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    kitchen: {
        width: 120,
        height: 120,
        borderWidth: 1,
        position: 'absolute',
        left: 0,
        bottom: 0,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    bookroom: {
        width: 120,
        height: 120,
        borderWidth: 1,
        position: 'absolute',
        right: 0,
        bottom: 0,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    input: {
        borderBottomWidth: 2,
        width: 40
    }

})

export default Index