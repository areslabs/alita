import React, {PureComponent} from 'react'
import {Platform} from 'react-native'
import PropTypes from 'prop-types'


import {createStore, applyMiddleware} from 'redux'
//Middleware
import promiseMiddleware from 'redux-promise'
import thunk from 'redux-thunk'
import logger from 'redux-logger'


import todoApp from './src/reducers'
import {Provider} from 'react-redux'



import {
    Router,
    Route
} from '@areslabs/router'

import Index from './src/components/index'
const store = createStore(todoApp, applyMiddleware(thunk, promiseMiddleware, logger))


export default class RNApp extends PureComponent {

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Route key="init" component={Index}/>
                </Router>
            </Provider>
        );
    }
}
