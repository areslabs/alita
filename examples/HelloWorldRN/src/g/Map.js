/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from "react";


export default class Map extends Component {

    state = {
        markers: [
            {
                iconPath: require("./alita.jpg"),
                id: 0,
                latitude: 23.099994,
                longitude: 113.324520,
                width: 50,
                height: 50
            },
        ],
        polyline: [
            {
                points: [{
                    longitude: 113.3245211,
                    latitude: 23.10229
                }, {
                    longitude: 113.324520,
                    latitude: 23.21229
                }],
                color:"#FF0000DD",
                width: 2,
                dottedLine: true
            }
        ],
        controls: [{
            id: 1,
            iconPath: require("./alita.jpg"),
            position: {
                left: 0,
                top: 300 - 50,
                width: 50,
                height: 50
            },
            clickable: true
        }]
    }

    render() {

        return (<map
            longitude="113.324520"
            latitude="23.099994"
            scale="14"
            controls={this.state.controls}
            bindcontroltap={(e) => {
                console.log(e.controlId)
            }}
            markers={this.state.markers}
            bindmarkertap={(e) => {
                console.log(e.markerId)
            }}
            polyline={this.state.polyline}
            bindregionchange={(e) => {
                console.log(e.type)
            }}
            show-location
            style={{
                width: '100%',
                height: 300,
            }}
        />)
    }
}