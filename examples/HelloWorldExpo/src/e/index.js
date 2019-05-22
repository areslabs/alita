import React, { Component } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TouchableWithoutFeedback } from "react-native"

import {history} from '@areslabs/router'

export default class C extends Component {


    getPush() {
        return <View>
            <Button
                title="POP"
                onPress={() => {
                    history.pop(1)
                }}
            />
            <Button
                title="BACK"
                onPress={() => {
                    history.back(1)
                }}
            />
            <Button
                title="POP TO TOP"
                onPress={() => {
                    history.popToTop(1)
                }}
            />

            <Button
                title="POP TO A"
                onPress={() => {
                    history.popTo("A")
                }}
            />

            <Button
                title="POP TO C WithProps"
                onPress={() => {
                    history.popToWithProps("C", {
                        text: 'newnew'
                    })
                }}
            />
        </View>
    }

    getReplace() {
        return (
            <View>
                <Button
                    title="BACK"
                    onPress={() => {
                        history.back(1)
                    }}
                />
            </View>
        )
    }

    render() {
        const type = this.props.routerParams.type
        return (
            <View style={{ flex: 1 }}>
                <Text>type: {type}</Text>

                {
                    type === 'PUSH' && this.getPush()
                }

                {
                    type === 'REPLACE' && this.getReplace()
                }
            </View>

        );
    }

}

