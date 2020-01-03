import React, { Component } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TouchableWithoutFeedback } from "react-native"

import {history} from '@areslabs/router'
import styles from '../a/styles';

import _ from 'lodash'

console.log('_:', _)

export default class C extends Component {

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={styles.item}><Text style={styles.itemText}>Hello</Text></View>
                <View style={[styles.item, {borderBottomWidth: 0}]}><Text style={styles.itemText}>{this.props.routerParams.text}</Text></View>

                <View style={styles.button}>
                    <Button
                        title="PUSH E PAGE"
                        color="#FFF"
                        onPress={() => {
                            history.push('E', {
                                type: 'PUSH'
                            })
                        }}
                    />
                </View>
                
                <View style={[styles.button, {borderTopWidth: 0}]}>
                    <Button
                        color="#fff"
                        title="REPLACE E PAGE"
                        onPress={() => {
                            history.replace('E', {
                                type: 'REPLACE'
                            })
                        }}
                    />
                </View>
                
            </View>

        );
    }

}

