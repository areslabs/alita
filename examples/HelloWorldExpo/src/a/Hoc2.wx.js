// HocComponent 只在微信小程序平台存在
import React, {HocComponent} from 'react'


export default function (WrappedComponent) {
    return class Hoc2 extends HocComponent {

        componentDidMount() {
            console.log('Hoc2 componentDidMount')
        }

        componentWillUnmount() {
            console.log('Hoc2 componentWillUnmount')
        }


        render() {
            return (
                React.createElement(WrappedComponent,
                    {
                        ...this.props,
                        age: "28",
                        ...this.hocProps,
                    })
            )
        }
    }

}