import React, {Component} from 'react'

import {
    View,
    Text,
    Image,
    Button,
    Switch,
    Slider,
    FlatList,
    SectionList,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Dimensions,

    ActivityIndicator,
    ImageBackground
} from 'react-native'
import styles from '../a/styles'

import base64Img from './img'


export default class B extends Component {

    componentDidMount() {
        console.log('B componentDidMount:')
    }

    state = {
        sv: true,
        users: [
            {
                name: parseInt(Math.random() * 10000000)
            },
            {
                name: parseInt(Math.random() * 10000000)
            },
            {
                name: parseInt(Math.random() * 10000000)
            },
            {
                name: parseInt(Math.random() * 10000000)
            }

        ],
        scrollList: [
            {id: 1, img: require('./imgs/001.jpg')},
            {id: 2, img: require('./imgs/002.jpg')},
            {id: 3, img: require('./imgs/003.jpg')},
            {id: 4, img: require('./imgs/004.jpg')},
            {id: 5, img: require('./imgs/005.jpg')},
            {id: 6, img: require('./imgs/006.jpg')}
        ],
        refreshing: false,
        value: '1'
    }

    renderItem = ({item}) => {
        return <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
        </View>
    }

    keyExtractor = (item) => {
        return item.name + ''
    }

    _onEndReached() {
        console.log('_onEndReached:')

        if (this.state.users.length > 30) {
            return
        }

        this.setState({
            users: this.state.users.concat([
                {
                    name: parseInt(Math.random() * 10000000)
                },
                {
                    name: parseInt(Math.random() * 10000000)
                },
                {
                    name: parseInt(Math.random() * 10000000)
                },
                {
                    name: parseInt(Math.random() * 10000000)
                },
            ])
        })

    }

    render() {
        return (
            <ScrollView style={{flex: 1}} contentContainerStyle={{backgroundColor: '#fff'}}>

                <View style={styles.button}>
                    <Text style={styles.title}>图片</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Image
                        source={require('./local.png')}
                        resizeMode="contain"
                        style={{
                            width: 200,
                            height: 200
                        }}/>
                    <Image
                        style={{width: 150, height: 200}}
                        source={{uri: base64Img}}
                    />
                </View>


                <View style={styles.button}>
                    <Button
                        title="点击 列表项 + 1"
                        onPress={() => {
                            this.setState({
                                users: this.state.users.map(user => ({
                                    ...user,
                                    name: user.name + 1
                                }))
                            })
                        }}
                    />
                </View>
                <View style={styles.button}>
                    <Text style={styles.title}>FlatList 列表</Text>
                </View>
                <FlatList
                    style={{ width: '100%', height: 200}}
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                        this.setState({
                            refreshing: true,
                        })

                        setTimeout(() => {
                            this.setState({
                                refreshing: false,
                            })
                        }, 2000)
                    }}

                    data={this.state.users}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    contentContainerStyle={{ minHeight:  450}}
                    ListFooterComponent={<View style={[styles.item, {borderBottomWidth: 0}]}><Text style={styles.itemText}></Text><Text>ListFooterComponent</Text></View>}
                    ListHeaderComponent={() => <View style={styles.item}><Text style={styles.itemText}>ListHeaderComponent</Text></View>}
                    ListEmptyComponent={() => <View style={styles.item}><Text style={styles.itemText}>ListEmptyComponent</Text></View>}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => { this._onEndReached(); }}
                />
                <View style={styles.button}>
                    <Text style={styles.title}>横向ScrollView</Text>
                </View>
                <ScrollView
                    horizontal={true}
                    style={{ width: '100%'}}
                >
                    {
                        this.state.scrollList.map(item => {
                            return (
                                <View key={item.id} style={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Image source={item.img} 
                                        style={{width: Dimensions.get('window').width / 2, height: 160}} resizeMode={'stretch'}/>
                                </View>
                            )
                        })
                    }
                </ScrollView>
                
                <View style={styles.button}>
                    <Text style={styles.title}>输入框</Text>
                </View>
                <Button
                    title={"点击-->Focus"}
                    onPress={() =>{
                        this._input.focus()
                    }}
                />
                <TextInput
                    ref={(input) => this._input = input}
                    style={{borderWidth: 1, height: 40, borderColor: '#bbb', paddingLeft: 10, }}
                    value={this.state.value}
                    onChangeText={value => {
                        this.setState({
                            value
                        })
                    }}
                />


                <View style={styles.button}>
                    <Text style={styles.title}>ActivityIndicator</Text>
                </View>
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <ActivityIndicator size="small" color="#00ff00" />
                    <ActivityIndicator size="large" color="#0000ff" animating={false}  hidesWhenStopped={false} />
                    <ActivityIndicator size="small" color="#00ff00" />
                </View>


                <View style={styles.button}>
                    <Text style={styles.title}>ImageBackground</Text>
                </View>
                <ImageBackground
                    source={require('./local.png')}
                    resizeMode="cover"
                    style={{
                        width: 200,
                        height: 200
                    }}>
                    <Text style={styles.title}>ImageBackground</Text>
                </ImageBackground>



                <View style={styles.button}>
                    <Text style={styles.title}>其它</Text>
                </View>
                <Switch
                    value={this.state.sv}
                    style={{margin: 10}}
                    onValueChange={(sv) => {
                        this.setState({
                            sv,
                        })
                    }}
                />

                <Slider
                    value={0.2}
                    style={{width: '100%'}}
                />

                
                <TouchableOpacity
                    onPress={() => {
                        console.log('click TouchableOpacity')
                    }}
                >
                    <View style={styles.button}>
                        <Text style={{fontSize:18, color: '#fff'}}>TouchableOpacity</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}