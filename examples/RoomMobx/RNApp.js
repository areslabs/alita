import React, {PureComponent} from 'react'
import {
    Router,
    Route
} from '@areslabs/router'
import {Provider} from 'mobx-react'

import Index from './src/components/index'

import Room from './src/store/Room'

const room = new Room()

export default class RNApp extends PureComponent {

    render() {
        return (
            <Provider room={room}>
                <Router>
                    <Route key="init" component={Index}/>
                </Router>
            </Provider>
        )
    }
}
