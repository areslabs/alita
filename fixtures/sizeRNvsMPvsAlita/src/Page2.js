import React, { Component } from "react";
import { StyleSheet, Text, View, Platform } from "react-native"

/*
    经过静态解析方式，以下代码由原来会生成以下6块代码段减少到0块
    <template name="c">
        <block wx:if="{{_t.l(d)}}">{{d}}</block>
        <_g wx:elif="{{d._generic}}" diuu="{{d._generic}}" style="{{_t.s(d._genericstyle)}}"/>
        <template wx:elif="{{d.tempName}}" is="{{d.tempName}}" data="{{...d}}"/>
        <block wx:else>
            <block wx:for="{{d}}" wx:key="key">
                <block wx:if="{{_t.l(item)}}">{{item}}</block>
                <_g wx:elif="{{item._generic}}" diuu="{{item._generic}}" style="{{_t.s(item._genericstyle)}}"/>
                <template wx:else is="{{item.tempName}}" data="{{...item}}"/>
            </block>
        </block>
    </template>
 */

const styles = StyleSheet.create({
    container: {
        textAlign: 'center',
        paddingTop: 50
    },
    red: {
        color: 'red',
        fontSize: 20
    },
    blue: {
        color: 'blue',
        fontSize: 20
    }
});


export default class Page2 extends Component {
    a() {
        return (
            <View>
                {this.b()}
            </View>
        )
    }

    b() {
        return (
            <View>
                {this.c()}
            </View>
        )
    }

    c() {
        return (
            <View>
                <Text style={styles.red}>
                    ccc
                </Text>
            </View>
        )
    }

    render() {
        const d = <View><Text style={styles.blue}>ddd</Text></View>
        let e = null
        e = <View><Text style={styles.red}>eee</Text></View>
        const isTrue = true

        return (
            <View style={styles.container}>
                <View>
                    {this.a()}
                    {this.c()}
                    <View>
                        <View>
                            {d}
                            {e}
                            <View>
                                {
                                    isTrue && d
                                }
                                {
                                    isTrue && this.c()
                                }
                                <View>
                                    {
                                        isTrue ? d : e
                                    }
                                    {
                                        isTrue ? this.c() : e
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

