// HocComponent 只在微信小程序平台存在
import React, {HocComponent} from 'react'


export default function (WrappedComponent) {
    return class Hoc1 extends HocComponent {

        state = {
            name: 'y5g'
        }

        componentDidMount() {
            console.log('Hoc1 componentDidMount')
        }

        componentWillUnmount() {
            console.log('Hoc1 componentWillUnmount')
        }


        render() {
            return (
                React.createElement(WrappedComponent,
                    {
                        ...this.props,
                        name: this.state.name,
                        changeName: (newName) => {
                            this.setState({
                                name: newName
                            })
                        },
                        ...this.hocProps,
                    })
            )
        }
    }

}