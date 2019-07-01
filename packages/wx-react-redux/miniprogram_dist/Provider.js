/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, {Component} from '@areslabs/wx-react'
import PropTypes from '@areslabs/wx-prop-types'

export default class Provider extends Component {

    static childContextTypes = {
        store: PropTypes.object
    };

    getChildContext() {
        return {
            store: this.props.store
        };
    }

    render() {}
}
 
