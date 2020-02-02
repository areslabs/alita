import React, { Component } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TouchableWithoutFeedback } from "react-native"

import styles from '../a/styles';






export default class C extends Component {

    componentDidMount() {
        const x = [
            {
                width: 20
            },
            [
                {
                    height: 30,
                },
                [
                    {
                        opacity: 1
                    }
                ]
            ]
        ]

        console.log(StyleSheet.flatten(x))
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff'}}>
                <View style={styles.button}><Text style={styles.title}>Flex</Text></View>
                <View style={{flexDirection: 'row', height: 60}}>
                    <View style={{flex: 1, backgroundColor: 'green'}}/>
                    <View style={{flex: 2, backgroundColor: 'blue'}}/>
                    <View style={{flex: 3, backgroundColor: 'yellow'}}/>
                </View>

                <View style={styles.button}><Text style={styles.title}>Transform</Text></View>
                <View style={{
                    height: 30,
                    width: 30,
                    backgroundColor: 'grey',
                    alignSelf: 'center',
                    transform: [
                        {translateX: 20},
                        {rotateZ: '45deg'},
                        {scale: 2},
                    ]
                }}/>

                <View style={styles.button}><Text style={styles.title}>Shadow</Text></View>
                <View style={{flexDirection: "row", justifyContent: 'space-around'}}>
                    <View
                        style={{
                            width: 60,
                            height: 60,
                            backgroundColor: 'blue',
                            shadowOffset:{
                                width: 10,
                                height: 10
                            },
                        }}
                    />
                    <View
                        style={{
                            width: 60,
                            height: 60,
                            backgroundColor: 'blue',
                            shadowOffset:{
                                width: 10,
                                height: 10
                            },
                            shadowColor: 'red'
                        }}
                    />
                    <View
                        style={{
                            width: 60,
                            height: 60,
                            backgroundColor: 'blue',
                            shadowOffset:{
                                width: 10,
                            },
                            shadowColor: 'red'
                        }}
                    />
                </View>

                <View style={styles.button}><Text style={styles.title}>textShadow</Text></View>
                <View>
                    <Text style={{
                        textShadowOffset: {
                            width: 10,
                        }
                    }}>Hello Alita</Text>
                </View>

                <View style={styles.button}><Text style={styles.title}>marginHorizontal</Text></View>
                <View style={{flexDirection: 'row', height: 60}}>
                    <View style={{marginHorizontal: 10, width: 60, backgroundColor: 'grey'}}/>
                    <View style={{marginHorizontal: 10, width: 60, backgroundColor: 'grey'}}/>
                </View>
                
            </View>

        );
    }

}

