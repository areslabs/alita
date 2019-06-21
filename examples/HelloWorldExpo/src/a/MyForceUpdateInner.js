import React, {Component} from 'react'
import MyForceUpdateInnerInner from './MyForceUpdateInnerInner'

export default class MyForceUpdateInner extends Component {

    shouldComponentUpdate() {
        console.log('MyForceUpdateInner shouldComponentUpdate')
        return true
    }

    render() {
        return <MyForceUpdateInnerInner/>
    }
}