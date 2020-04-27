import React, { Component } from "react";
import { StyleSheet, Text, View, Platform, Button } from "react-native"

import {history} from '@areslabs/router'



export default class CommonPage extends Component {


    render() {
        return (
            <View>
				<Button
					title={"to Page1"}
					onPress={() => {
						history.push('Page1')
					}}
				/>
            </View>

        );
    }
}
