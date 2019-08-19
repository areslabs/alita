import React, { Component, h } from "@areslabs/wx-react";
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
React.render(h(RNAppClass, {
  diuu: React.rootUuid
}), null, {}, null, null, null, []);
const rootContext = React.getRootContext();
export default {
  childContext: rootContext
};
wx._historyConfig = Object.assign({}, wx._historyConfig || {}, {
  "ReactReposlist": "/src/components/list/index",
  "ReactReposdetail": "/src/components/detail/index"
});