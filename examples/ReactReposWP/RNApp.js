import React, { Component } from "@areslabs/wx-react";
const h = React.h;
import { Router, Route } from "@areslabs/wx-router";
const RNAppClass = class App extends Component {
  render() {
    return h(Router, {
      diuu: "DIUU00001"
    }, h(Route, {
      diuu: "DIUU00002"
    }), h(Route, {
      diuu: "DIUU00003"
    }));
  }

};
React.renderApp(RNAppClass);
wx._historyConfig = Object.assign({}, wx._historyConfig || {}, {}, {
  "ReactReposlist": "/src/components/list/index",
  "ReactReposdetail": "/src/components/detail/index"
});