import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Button,
    StyleSheet,
    FlatList,
    SectionList,
    Image,
    Modal,
    Picker,
    Slider,
    Switch,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    RefreshControl,
    Platform,
} from 'react-native'

import MyContext from './MyContext'
import MyRefComp from './MyRefComp'
import MyPropComp from './MyPropComp'
import MyFunComp from './MyFunComp'
import MyChildComp from './MyChildComp'
import MyStyleComp from './MyStyleComp'
import PlatformComp from './PlatformComp'
import MyHoc from './MyHoc'
import styles from './styles';
import Hi from '@areslabs/hi-rn'
import {Hello} from '@areslabs/hello-rn/index'

import {camelCase} from '@areslabs/stringutil-rn'



import {history} from '@areslabs/router'


const item3 = <View style={[styles.item, {borderBottomWidth: 0}]}><Text style={styles.itemText}>item3</Text></View>
export default class A extends Component {

    static wxNavigationOptions = {
        navigationBarTitleText: "WX A",
    }

    static navigationOptions={
        title: 'RN A',
    }


    static childContextTypes = {
        color: PropTypes.string,
    }


    static defaultProps = {
        name: 'yk'
    }


    getChildContext() {
        return {
            color: "purple",
        }
    }

    componentWillMount() {
        console.log('A componentWillMount:')


        this.f()
            .then(x => {
                console.log('ASYNC OKOK')
            })

    }


    async f() {
        return await 1
    }

    componentDidFocus() {
        console.log('A componentDidFocus')
    }

    componentWillUnfocus() {
        console.log('A componentWillUnfocus')
    }

    componentDidMount() {
        console.log('A componentDidMount:', Platform.OS, camelCase("Yan Kang"))
    }

    componentDidUpdate() {
        console.log('A componentDidUpdate:')
    }

    state = {
        toggleClicked1: false,

        arr: [
            'arr1',
            'arr2',
            'arr3'
        ],

        user: {
            name: 'kk',
            age: 18
        },

        hasZ: false
    }

    getText1() {
        return null
    }

    getText2(hello) {
        return <View style={styles.item}><Text style={styles.itemText}>{hello}</Text></View>
    }

    handleIncre = () => {
        // ref的使用
        this.mrc.increCount()
    }

    item2 = <View style={styles.item}><Text style={styles.itemText}>item2</Text></View>

    render() {
        const {toggleClicked1, arr, user, count} = this.state

        const item1 = <View style={styles.item}><Text style={styles.itemText}>item1</Text></View>
        return (
            <ScrollView style={{flex: 1}} contentContainerStyle={{backgroundColor: '#fff'}}>
                <View style={styles.button}>
                    <Button
                        color="#fff"
                        title="PUSH C PAGE"
                        onPress={() => {
                            history.push('C', {
                                text: 'Alita'
                            })
                        }}
                    />
                </View>
                <View style={styles.item}>
                    <Text style={{fontSize: 16, color: 'rgb(24, 144, 255)'}}>Platform: {Platform.OS}</Text>
                </View>
                <PlatformComp style={styles.item}/>

                {item1}
                {this.item2}
                {item3}

                <View style={styles.button}>
                    <Button
                        title="CLICK ME"
                        color="#fff"
                        onPress={() => {
                            this.setState({
                                toggleClicked1: !toggleClicked1
                            })
                        }}
                    />
                </View>
                {
                    toggleClicked1 && <View style={styles.item}><Text style={styles.itemText}>clicked is true</Text></View>
                }


                {
                    this.getText1()
                }
                {
                    this.getText2('function返回JSX')
                }


                <View style={styles.item}>
                    {
                        arr.map(ele => <Text style={styles.itemText} key={ele}>{ele},</Text>)
                    }
                </View>


                <MyContext {...user}/>


                <View style={styles.button}>
                    <Button
                        title="Add One"
                        color="#fff"
                        onPress={this.handleIncre}
                    />
                </View>

                <MyRefComp
                    ref={mrc => this.mrc = mrc}
                />


                <MyPropComp
                    headerComponent={<View style={styles.item}><Text style={styles.itemText}>header</Text></View>}
                    footerComponent={() => {
                        return <View style={styles.item}><Text style={styles.itemText}>footer</Text></View>
                    }}
                />

                <MyFunComp {...user}/>


                <MyChildComp>
                    <View style={styles.item}><Text style={styles.itemText}>a</Text></View>
                    <View style={styles.item}><Text style={styles.itemText}>b</Text></View>
                    <View style={[styles.item, {borderBottomWidth: 0}]}><Text style={styles.itemText}>c</Text></View>
                </MyChildComp>

                <MyHoc txt="HOC"/>

                <MyStyleComp/>

                <Hi name="Yvette"
                    style={styles.item}
                    textStyle={styles.itemText}
                    textPress={() => {
                        console.log('hihi!!! textPress')
                    }}
                />

                <Hello name="y5g" style={[styles.item, {borderBottomWidth: 0}]} textStyle={styles.itemText}/>


            </ScrollView>
        )
    }
}
