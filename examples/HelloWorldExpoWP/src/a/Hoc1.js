function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
}

import React, { HocComponent, h } from "@areslabs/wx-react"
export default function(WrappedComponent) {
    var _temp

    return (
        (_temp = class Hoc1 extends HocComponent {
            constructor(...args) {
                super(...args)

                _defineProperty(this, "state", {
                    name: "y5g"
                })
            }

            componentDidMount() {
                console.log("Hoc1 componentDidMount")
            }

            componentWillUnmount() {
                console.log("Hoc1 componentWillUnmount")
            }

            render() {
                return React.createElement(
                    WrappedComponent,
                    Object.assign(
                        {},
                        this.props,
                        {
                            name: this.state.name,
                            changeName: newName => {
                                this.setState({
                                    name: newName
                                })
                            }
                        },
                        this.hocProps
                    )
                )
            }
        }),
        _temp
    )
}
