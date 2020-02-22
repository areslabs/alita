/**
 * Copyright (c) Areslabs.

 */


import React, {Component} from "react";


export default class Custom extends Component {

    state = {
        icons: [
            'add-friends', 'add', 'add2', 'album',  'at',
            'bellring-on', 'camera', 'cellphone',  'clip'
        ],


        list: [
            {
                "text": "对话",
                "iconPath": require('../../assets/faxian.png'),
                "selectedIconPath": require('../../assets/faxianCurrent.png'),
                dot: true
            },
            {
                "text": "设置",
                "iconPath": require('../../assets/my.png'),
                "selectedIconPath": require('../../assets/myCurrent.png'),
                badge: 'New'
            }
        ]
    }


    render() {
        return (<view
            style={{
                backgroundColor: '#EDEDED',
                height: '100%'
            }}
        >

            <loading type="circle"/>

            <searchbar
                bindinput={(e) => {
                    console.log('searchbar:', e.detail.value)

                }}
            />

            <cell link>
                <view style="display: inline-block; vertical-align: middle">单行列表</view>
                <badge style="margin-left: 5px;" content="New"/>
            </cell>


            <view style={{
                display: 'flex',
                flexWrap: 'wrap',
            }}>
                {
                    this.state.icons.map(icon =>
                        <view
                            key={icon}
                            style={{
                                height: 110,
                                width: '32%',
                                borderWidth: 1,
                                borderColor: '#999',
                                borderStyle: "solid",
                                display: "flex",
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column'}}
                        >
                            <mp-icon type="outline" icon={icon} color="black"/>
                            <view>{icon}</view>
                        </view>
                    )
                }
            </view>


            <mp-tabbar
                style="position:fixed;bottom:0;width:100%;left:0;right:0;"
                list={this.state.list}
                bindchange={(e) => {
                    console.log('tabbar:', e.detail.value)
                }}
            />
        </view>)
    }
}

