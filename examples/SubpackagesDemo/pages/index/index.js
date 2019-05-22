//index.js
//获取应用实例
const app = getApp()

Page({
    data: {},
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    enterHW: function () {
        wx.navigateTo({
            url: '/pages/HelloWorld/src/a/index'
        })
    },

    enterTD: function () {
        wx.navigateTo({
            url: '/pages/Todo/src/components/index'
        })
    }
})
