import React, { PureComponent, h } from "@areslabs/wx-react";
import { createStore, applyMiddleware } from "@areslabs/wx-redux";
import promiseMiddleware from "@areslabs/wx-redux-promise";
import thunk from "@areslabs/wx-redux-thunk";
import todoApp from "./src/reducers/index";
import { Provider } from "@areslabs/wx-react-redux";
import { Router, Route } from "@areslabs/wx-router";
const store = createStore(todoApp, applyMiddleware(thunk, promiseMiddleware));
const RNAppClass = class RNApp extends PureComponent {
  render() {
    return h(Provider, {
      store: store,
      diuu: "DIUU00001"
    }, h(Router, {
      diuu: "DIUU00002"
    }, h(Route, {
      diuu: "DIUU00003"
    })));
  }

};
React.render(h(RNAppClass, {
  diuu: React.rootUuid
}), null, {}, null, null, null, []);
const rootContext = React.getRootContext();
export default {
  childContext: rootContext
};
wx._historyConfig = Object.assign({}, wx._historyConfig || {}, {
  "Todoinit": "/src/components/index"
});