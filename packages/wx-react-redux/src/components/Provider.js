import { Component } from '@areslabs/wx-react'

export default class Provider extends Component {
  getChildContext() {
    return { store: this.store }
  }

  constructor(props, context) {
    super(props, context)
    this.store = props.store
  }

  render() {}
}

Provider.childContextTypes = {
  store: {}
}
