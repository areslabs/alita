const path = require('path')

module.exports = {
    name: "HelloWorldRN",

    entry: "./src/index.js",
    output: "./wx-dist",

    include:[
        path.resolve('src'),
        path.resolve('node_modules', '@areslabs', 'hello-rn')
    ],

    resolve: {
        alias: {
            "@areslabs/stringutil-rn": "@areslabs/stringutil-wx",
        },
        // for npm link /yarn link
        symlinks: false
    },


    componentPaths: {
        "TestPath": "/src/TestPath.js"
    },


    miniprogramComponents: {
        "badge": "/weixin/weui-miniprogram/badge/badge",
        "cell": "/weixin/weui-miniprogram/cell/cell",
        "cells": "/weixin/weui-miniprogram/cells/cells",

        // 防止和小程序内置icon重复
        "mp-icon": "/weixin/weui-miniprogram/icon/icon",

        "loading": "/weixin/weui-miniprogram/loading/loading",
        "searchbar": "/weixin/weui-miniprogram/searchbar/searchbar",
        "slideview": "/weixin/weui-miniprogram/slideview/slideview",
        "mp-tabbar": "/weixin/weui-miniprogram/tabbar/tabbar"
    }
}