/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, {Component} from "react";
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
    years.push(i)
}

for (let i = 1; i <= 12; i++) {
    months.push(i)
}

for (let i = 1; i <= 31; i++) {
    days.push(i)
}

export default class Form extends Component {

    state = {
        items: [
            {name: 'USA', value: '美国'},
            {name: 'CHN', value: '中国', checked: 'true'},
            {name: 'BRA', value: '巴西'},
            {name: 'JPN', value: '日本'},
            {name: 'ENG', value: '英国'},
            {name: 'TUR', value: '法国'},
        ],

        pickerArray: ['美国', '中国', '巴西', '日本'],
        pickerIndex: 0,


        years: years,
        year: date.getFullYear(),
        months: months,
        month: 2,
        days: days,
        day: 2,
        value: [9999, 1, 1],
    }


    cgc = (e) => {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    }

    submit = (e) => {
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
    }

    reset = (e) => {
        console.log('form发生了reset事件')
    }


    // 分割线
    seg = <view style={{
        height: 1,
        width: '100%',
        marginVertical: 3
    }}/>

    render() {

        return <scroll-view
            scroll-y
            style={{backgroundColor: '#fff', height: '100%'}}
        >
            <form
                bindsubmit={this.submit}
                bindreset={this.reset}
            >

                <input name="input" auto-focus placeholder="将会获取焦点" bindinput={e => {
                    console.log('input change:', e.detail.value)
                }}/>

                {this.seg}

                <checkbox-group name="checkbox-group" bindchange={this.cgc}>

                    {
                        this.state.items.map(item => {
                            return (
                                <label key={item.name}>
                                    <checkbox value={item.name} checked={item.checked}/>
                                    {item.value}
                                </label>
                            )
                        })
                    }
                </checkbox-group>

                {this.seg}

                <slider name="slider" bindchange={(e) => {
                    console.log('slider change:', e.detail.value)
                }} show-value/>

                {this.seg}

                <switch name="switch" bindchange={(e) => {
                    console.log('switch change:', e.detail.value)
                }}/>

                {this.seg}

                <view>普通选择器</view>
                <picker name="picker" bindchange={(e) => {
                    console.log('picker change:', e.detail.value)

                    this.setState({
                        pickerIndex: e.detail.value
                    })
                }} value={this.state.pickerIndex}
                        range={this.state.pickerArray}>
                    <view className="picker">
                        当前选择：{this.state.pickerArray[this.state.pickerIndex]}
                    </view>
                </picker>

                {this.seg}

                <view>{this.state.year}年{this.state.month}月{this.state.day}日</view>
                <picker-view name="picker-view" indicator-style="height: 50px;" style="width: 100%; height: 300px;"
                             value={this.state.value} bindchange={(e) => {
                                 console.log('picker-view change:', e)

                                  const val = e.detail.value

                                  this.setState({
                                      value: val,

                                      year: this.state.years[val[0]],
                                      month: this.state.months[val[1]],
                                      day: this.state.days[val[2]]
                                  })


                             }}>
                    <picker-view-column>
                        {
                            this.state.years.map(y => <view key={y} style="line-height: 50px">{y}年</view>)
                        }
                    </picker-view-column>
                    <picker-view-column>
                        {
                            this.state.months.map(m => <view key={m} style="line-height: 50px">{m}月</view>)
                        }
                    </picker-view-column>
                    <picker-view-column>
                        {
                            this.state.months.map(d => <view key={d} style="line-height: 50px">{d}日</view>)
                        }
                    </picker-view-column>
                </picker-view>

                {this.seg}

                <view style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <button size="mini" formType="submit">Submit</button>
                    <button size="mini" formType="reset">Reset</button>
                </view>
            </form>
        </scroll-view>
    }
}

