import React, { Component } from "react";
import { StyleSheet } from "react-native"


import {history} from '@areslabs/router'

export default class G extends Component {

    state = {
        btnLoading: false,
        btnType: 'default',

        iconType: [
            'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
        ],
        iconSize: [20, 30, 40, 50, 60, 70],
        iconColor: [
            'red', 'orange', 'yellow', 'green', 'rgb(0,255,255)', 'blue', 'purple'
        ],

        mx: 0,
        my: 0,
    }


    getIcon() {
        return [
            <view key="size" style={{
                flexDirection: 'row'
            }}>
                {
                    this.state.iconSize.map(size => <icon key={size} type="success" size={size} />)
                }
            </view>,
            <view key="type" style={{
                flexDirection: 'row'
            }}>
                {
                    this.state.iconType.map(type => <icon key={type} type={type} size="40"/>)
                }
            </view>,
            <view key="color" style={{
                flexDirection: 'row'
            }}>
                {
                    this.state.iconColor.map(color => <icon key={color} type="success" size="40" color={color}/>)
                }
            </view>
        ]
    }


    render() {
        return (
            <scroll-view
                style={{height: '100%'}}
                scroll-y
            >

                <view style={styles.section}>
                    <text>THIS IS View/Text</text>
                </view>


                <view style={styles.section}>
                    <button
                        type="primary"
                        size="default"
                        loading={this.state.btnLoading}
                        disabled="{{disabled}}"
                        bindtap={ () => {
                            this.setState({
                                btnLoading: !this.state.btnLoading
                            })
                        }}
                    >
                        切换loading
                    </button>
                    <button
                        type={this.state.btnType}
                        size="default"
                        disabled="{{disabled}}"
                        bindtap={ () => {
                            this.setState({
                                btnType: this.state.btnType === 'default' ? 'primary' : 'default'
                            })
                        }}
                    >
                        切换type
                    </button>
                </view>

                <view style={styles.section}>
                    {
                        this.getIcon()
                    }
                </view>

                <view style={styles.section}>
                    <progress percent="20" show-info />
                    <progress percent="40" stroke-width="12" />
                    <progress percent="60" color="pink" />
                    <progress percent="80" active />
                </view>


                <view style={[styles.section, {display: 'flex'}]}>
                    <movable-area style={{
                        height: 100,
                        width: 200,
                        backgroundColor: 'red'
                    }}>
                        <movable-view
                            bindchange={(e) => {
                                const {x, y} = e.detail
                                this.setState({
                                    mx: x,
                                    my: y,
                                })
                            }}
                            style={{
                                height: 50,
                                width: 50,
                                backgroundColor: 'blue'
                            }}
                            direction="all"
                        />
                    </movable-area>

                    <view style={{marginLeft: 20}}>
                        move:
                        <view>x: {this.state.mx}</view>
                        <view>y: {this.state.my}</view>
                    </view>
                </view>

                <view style={styles.section}>

                    <button bindtap={() => {
                        history.push('Form')
                    }}>跳转到表单组件页面</button>

                    <button bindtap={() => {
                        history.push('Video')
                    }}>跳转到Video</button>

                    <button bindtap={() => {
                        history.push('Map')
                    }}>跳转到地图Map</button>

                    <button bindtap={() => {
                        history.push('Canvas')
                    }}>跳转到Canvas</button>

                    <button bindtap={() => {
                        history.push('Custom')
                    }}>跳转到小程序自定义组件</button>
                </view>
            </scroll-view>

        );
    }

}



const styles = StyleSheet.create({

    section: {
        marginBottom: 10,
        backgroundColor: '#fff',
        padding: 15,
    },


    title: {
        color: '#FFF',
        fontSize: 18
    },

})




