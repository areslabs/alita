import React, {Component} from 'react'
import {Platform, StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity} from 'react-native'
import LoadingView from './LoadingView'

import {history} from '@areslabs/router'

import {formatK, token, fetchRepos} from '../../util'

const {width} = Dimensions.get('window')

const reposUrl = `https://api.github.com/search/repositories?q=react&sort=stars&per_page=20&access_token=${token}`
export default class List extends Component {

    static navigationOptions = {
        title: 'ReactRepos',
    }

    static wxNavigationOptions = {
        navigationBarTitleText: "ReactRepos",
    }

    state = {
        repos: [],
        refreshing: false
    }

    page = 1

    getReposUrl = (page = 1) => {
        return `${reposUrl}&page=${page}`
    }

    componentDidMount() {
        /*fetch(this.getReposUrl())
            .then(res => res.json())
            .then(res => {
                this.setState({
                    repos: res.items
                })
            })*/

        fetchRepos(this.page, 20)
            .then(res => {
                this.setState({
                    repos: res.items
                })
            })
    }

    renderItem = ({item}) => {
        return <TouchableOpacity style={styles.itemOut}
                                 onPress={() => {
                                     history.push('detail', item)
                                 }}
        >

            <Image style={styles.picStyle} source={{uri: item.owner.avatar_url}}/>

            <View style={{flex: 1}}>
                <View style={styles.intro}>
                    <Text numberOfLines={1} style={styles.name}>{item.name}</Text>

                    <View style={styles.star}>
                        <Image style={{height: 15, width: 15}} source={require('../../assets/stars.jpg')}/>
                        <Text>{formatK(item.watchers)}</Text>
                    </View>
                </View>

                <Text numberOfLines={2} style={styles.des}>{item.description}</Text>

                <Text style={styles.license}>{item.license ? item.license.spdx_id : 'ISC'}</Text>
            </View>
        </TouchableOpacity>
    }

    keyExtractor = (item, index) => item.id + ''

    onEndReached = () => {
        console.log('onEndReached:')
        this.page ++

        fetchRepos(this.page, 20)
            .then(res => {
                this.setState({
                    repos: this.state.repos.concat(res.items)
                })
            })
    }

    lfc = () => {
        if (this.state.repos.length === 0 ) {
            return null
        }

        return <View
            style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text>加载中...</Text>
        </View>
    }

    onRefresh = () => {
        this.setState({
            refreshing: true
        })
        setTimeout(() => {
            this.setState({
                refreshing: false
            })
        }, 4000)
    }

    render() {
        return (
            <View style={{flex: 1}}>

                {
                    this.state.repos.length === 0 && <LoadingView/>
                }

                <FlatList
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    style={{flex: 1}}
                    data={this.state.repos}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    onEndReached={this.onEndReached}
                    ListFooterComponent={this.lfc}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    fr: {
        flexDirection: 'row'
    },
    itemOut: {
        backgroundColor: '#fff',
        marginBottom: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10
    },
    picStyle: {
        width: 84,
        height: 84,
        alignSelf: 'center',
        marginRight: 10
    },
    intro: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    star: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    name: {
        fontSize: 20,
        lineHeight: 30,
        color: '#4876FF',
        fontWeight: '600',
        width: 200,
        marginTop: -4
    },
    des: {
        height: 34,
        color: '#555'
    },
    license: {
        marginTop: 3,
        color: '#787878'
    }
})