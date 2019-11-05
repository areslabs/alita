import React, { Component } from "react";
import { StyleSheet, Text, View, Platform } from "react-native"

/**
 * @areslabs/wx-animated 是参考小程序API实现的一套可以运行在React Native，小程序上的动画
 * 详情参考：https://areslabs.github.io/alita/%E5%8A%A8%E7%94%BB.html
 */
import {AnimatedImage, createAnimation} from '@areslabs/wx-animated'

/**
 *  @areslabs/stringutil-rn 由于在alita.config.js 的dependencies字段有对应配置，所有在微信小程序平台，会把替换为
 *  '@areslabs/stringutil-wx'。 语句将变成 ：import {camelCase} from '@areslabs/stringutil-wx'
 *
 *  对于不能直接在小程序运行的npm包，需要做类似处理。详情参考：
 *  普通npm包：https://areslabs.github.io/alita/npm%E5%8C%85%E8%AF%B4%E6%98%8E.html
 *  组件包： https://areslabs.github.io/alita/%E7%AC%AC%E4%B8%89%E6%96%B9%E7%BB%84%E4%BB%B6%E5%BA%93%E6%89%A9%E5%B1%95.html
 *
 */
import {camelCase} from '@areslabs/stringutil-rn'

import rnLogoPng from './rn_logo.png'

export default class HelloWorld extends Component {

    state = {
        logoAni: null,
    }

    componentDidMount() {
        this.logoAni()
    }

    render() {
        return (
            <View style={styles.container}>

                <AnimatedImage
                    animation={this.state.logoAni}
                    source={rnLogoPng}
                    style={styles.logo}
                />

                <Text>
                    Hello {Platform.OS}!
                </Text>
            </View>

        );
    }

    logoAni(num = 1) {
        const ani = createAnimation({
            duration: 5000,
        })
        ani.rotateZ(360 * num)
        ani.step()
        this.setState({
            logoAni: ani.export(() => {
                this.logoAni(num + 1)
            })
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        width: 100,
        height: 100
    }
})