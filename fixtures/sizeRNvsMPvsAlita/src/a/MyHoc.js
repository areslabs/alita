import React, {Component} from 'react'
import {View, Text, Button, StyleSheet} from 'react-native'
import Hoc1 from './Hoc1'
import Hoc2 from './Hoc2'
import styles from './styles';

let i = 6
class MyHoc extends Component {

    componentDidMount() {
        console.log('MyHoc componentDidMount')
    }

    render() {
        return (
            <View>
                <View style={styles.button}>
                    <Button
                        title={"Change Name"}
                        color="#333"
                        onPress={() => {
                            this.props.changeName(`y${i++}g`)
                        }}
                    />
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemText}>{this.props.txt}: name={this.props.name}, age={this.props.age}</Text>
                </View>
            </View>
        )
    }
}


export default Hoc1(Hoc2(MyHoc))