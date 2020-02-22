import React, {Component} from "react";


function getRandomColor () {
    const rgb = []
    for (let i = 0 ; i < 3; ++i){
        let color = Math.floor(Math.random() * 256).toString(16)
        color = color.length == 1 ? '0' + color : color
        rgb.push(color)
    }
    return '#' + rgb.join('')
}

export default class Video extends Component {

    state = {
        danmuList: [
            {
                text: '第 1s 出现的弹幕',
                color: '#ff0000',
                time: 1
            },
            {
                text: '第 3s 出现的弹幕',
                color: '#ff00ff',
                time: 3
            }
        ]
    }

    componentDidMount() {
        this.videoContext = wx.createVideoContext('myVideo')
    }


    sendDanmu = (e) => {
        this.videoContext.sendDanmu({
            text: this.inputValue,
            color: getRandomColor()
        })
    }

    blurInput = (e) => {
        this.inputValue = e.detail.value
    }

    getVideo = (e) => {
        var that = this
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: ['front','back'],
            success: function(res) {
                that.setData({
                    src: res.tempFilePath
                })
            }
        })
    }

    render() {

        return (<view>
            <video
                id="myVideo"
                src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
                danmu-list={[
                    {
                        text: '第 1s 出现的弹幕',
                        color: '#ff0000',
                        time: 1
                    },
                    {
                        text: '第 3s 出现的弹幕',
                        color: '#ff00ff',
                        time: 3
                    }
                ]}
                enable-danmu
                danmu-btn
                controls
            />

            <view>
                <button bindtap={this.getVideo}>获取视频</button>
                <input bindblur={this.blurInput}/>
                <button bindtap={this.sendDanmu}>发送弹幕</button>
            </view>
        </view>)
    }
}