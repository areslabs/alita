import React, { Component } from "@areslabs/wx-react"
const h = React.h
import MyStyleCompComp from "./MyStyleCompComp.comp"
export default class MyStyleComp extends Component {
    render() {
        return h(MyStyleCompComp, {
            diuu: "DIUU00001",
            tempName: "ITNP00002"
        })
    }
}
