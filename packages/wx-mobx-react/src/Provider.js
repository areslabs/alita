import { Component } from "@areslabs/wx-react"
import * as PropTypes from "./propTypes"

const specialReactKeys = { children: true, key: true, ref: true }

class Provider extends Component {
    static contextTypes = {
        mobxStores: PropTypes.objectOrObservableObject
    }

    static childContextTypes = {
        mobxStores: PropTypes.objectOrObservableObject.isRequired
    }

    constructor(props, context) {
        super(props, context)
        this.state = {}
        copyStores(props, this.state)
    }

    render() {}

    getChildContext() {
        const stores = {}
        // inherit stores
        copyStores(this.context.mobxStores, stores)
        // add own stores
        copyStores(this.props, stores)
        return {
            mobxStores: stores
        }
    }
}

function copyStores(from, to) {
    if (!from) return
    for (let key in from) if (validStoreName(key)) to[key] = from[key]
}

function validStoreName(key) {
    return !specialReactKeys[key] && key !== "suppressChangedStoreWarning"
}


export default Provider
