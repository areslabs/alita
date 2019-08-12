var _class, _temp;

import React, { PureComponent, h } from "@areslabs/wx-react";
import PropTypes from "@areslabs/wx-prop-types";
import { Router, Route, TabRouter } from "@areslabs/wx-router";
const RNAppClass = (_temp = _class = class App extends PureComponent {
  getChildContext() {
    return {
      txt: '6666',
      test: 'test'
    };
  }

  render() {
    return h(Router, {
      navigationOptions: {
        title: 'HelloWorld'
      },
      diuu: "DIUU00001"
    }, h(TabRouter, {
      diuu: "DIUU00002"
    }, h(Route, {
      diuu: "DIUU00003"
    }), h(Route, {
      diuu: "DIUU00004"
    }), h(Route, {
      diuu: "DIUU00005"
    })), h(TabRouter, {
      diuu: "DIUU00006"
    }, h(Route, {
      diuu: "DIUU00007"
    })), h(TabRouter, {
      diuu: "DIUU00008"
    }, h(Route, {
      diuu: "DIUU00009"
    })));
  }

}, _class.childContextTypes = {
  txt: PropTypes.string,
  test: PropTypes.string,
  store: PropTypes.object
}, _temp);
React.render(h(RNAppClass, {
  diuu: React.rootUuid
}), null, {}, null, null, null, []);
const rootContext = React.getRootContext();
export default {
  childContext: rootContext
};
wx._historyConfig = Object.assign({}, wx._historyConfig || {}, {}, {
  "A": "/pages/HelloWorld/src/a/index",
  "C": "/pages/HelloWorld/src/c/index",
  "E": "/pages/HelloWorld/src/e/index",
  "B": "/pages/HelloWorld/src/b/index",
  "D": "/pages/HelloWorld/src/d/index"
});