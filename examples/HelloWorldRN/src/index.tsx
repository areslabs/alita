import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import {
    Router,
    Route,
    TabRouter
} from '@areslabs/router'


import A from './a'



export default class App extends PureComponent {
    static childContextTypes = {
        txt: PropTypes.string,
        test: PropTypes.string,
        store: PropTypes.object
    }


    getChildContext() {
        return {
            txt: '6666',
            test: 'test',
        };
    }



    render() {

        return (
            <Router
                wxNavigationOptions={{
                    navigationBarTitleText: "HelloWorld",
                    navigationBarBackgroundColor: "#eee",
                    navigationBarTextStyle: "black",
                }}

                navigationOptions={{
                    title: 'HelloWorld'
                }}
            >
                <Route key={"A"} component={A}/>
            </Router>
        )
    }
}