import React, { PureComponent, h } from "@areslabs/wx-react";
import { Platform } from "@areslabs/wx-react-native";
import PropTypes from "@areslabs/wx-prop-types";
import { createStore, applyMiddleware } from "@areslabs/wx-redux";
import promiseMiddleware from "@areslabs/wx-redux-promise";
import thunk from "@areslabs/wx-redux-thunk";
import todoApp from "./src/reducers/index";
import { Provider } from "@areslabs/wx-react-redux";
import { Router, Route } from "@areslabs/wx-router";
const store = createStore(todoApp, applyMiddleware(thunk, promiseMiddleware));
const RNAppClass = class RNApp extends PureComponent {
  static childContextTypes = {
    store: PropTypes.object
  };

  getChildContext() {
    return {
      store: Platform.OS === 'wx' ? store : {}
    };
  }

};
const RNApp = new RNAppClass({});
RNApp.childContext = RNApp.getChildContext ? RNApp.getChildContext() : {};
export default RNApp;
wx._historyConfig = {...(wx._historyConfig || {}), ...{"Todoinit":"/src/components/index"}};