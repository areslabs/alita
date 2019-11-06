import React, { HocComponent } from "@areslabs/wx-react"
const h = React.h
export default function(WrappedComponent) {
    return class Hoc2 extends HocComponent {
        componentDidMount() {
            console.log("Hoc2 componentDidMount")
        }

        componentWillUnmount() {
            console.log("Hoc2 componentWillUnmount")
        }

        render() {
            return React.createElement(
                WrappedComponent,
                Object.assign(
                    {},
                    this.props,
                    {
                        age: "28"
                    },
                    this.hocProps
                )
            )
        }
    }
}
