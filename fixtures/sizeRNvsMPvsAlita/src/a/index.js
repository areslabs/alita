import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {
    AppState,
    View,
    Text,
    Button,
    StyleSheet,
    FlatList,
    SectionList,
    Image,
    Modal,
    MaskedViewIOS,
    Picker,
    Slider,
    Switch,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    StatusBar,
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

import {Dic1, Dic21, Dic22, Dic3, Dic31, Dic32, DicFunc, DF3, DF1, DF2, DF4} from './dic'

import styles from './styles';


// 测试导入json文件
import info from './info'
const info2 = require('./info')


import {history} from '@areslabs/router'




global.store = {
    name: 'yk'
}

function f(global) {
    console.log('HelloHello')

}
f(global)


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

        console.log('info: ', info, info2)

        this.f()
            .then(x => {
                console.log('ASYNC OKOK')
            })

        AppState.addEventListener('change', () => {});
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
        console.log('A componentDidMount:', Platform.OS)
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

                <StatusBar backgroundColor="blue" barStyle="light-content" />

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

                {/*测试组件路径寻找*/}
                <Dic1 style={styles.item}/>
                <Dic21 style={styles.item}/>
                <Dic22 style={styles.item}/>
                <Dic3 style={styles.item}/>
                <Dic31 style={styles.item}/>
                <Dic32 style={styles.item}/>
                <DicFunc style={styles.item}/>
                <View
                    style={styles.item}
                >
                    <DF1/>
                    <DF2/>
                    <DF3/>
                </View>




                <MaskedViewIOS
                    style={{flex: 1, flexDirection: 'row', height: '100%'}}
                    maskElement={
                        <View
                            style={{
                                // Transparent background because mask is based off alpha channel.
                                backgroundColor: 'transparent',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Text
                                style={{
                                    fontSize: 60,
                                    color: 'black',
                                    fontWeight: 'bold',
                                }}>
                                Basic Mask
                            </Text>
                        </View>
                    }>
                    {/* Shows behind the mask, you can put anything here, such as an image */}
                    <View style={{flex: 1, height: '100%', backgroundColor: '#324376'}} />
                    <View style={{flex: 1, height: '100%', backgroundColor: '#F5DD90'}} />
                    <View style={{flex: 1, height: '100%', backgroundColor: '#F76C5E'}} />
                </MaskedViewIOS>

            </ScrollView>
        )
    }
}
