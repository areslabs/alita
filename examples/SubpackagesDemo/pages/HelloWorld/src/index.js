import React, { PureComponent, h } from "@areslabs/wx-react";
import PropTypes from "@areslabs/wx-prop-types";
import { Router, Route, TabRouter } from "@areslabs/wx-router";
const RNAppClass = class App extends PureComponent {
  static childContextTypes = {
    txt: PropTypes.string,
    test: PropTypes.string,
    store: PropTypes.object
  };

  getChildContext() {
    return {
      txt: '6666',
      test: 'test'
    };
  }

};
const RNApp = new RNAppClass({});
RNApp.childContext = RNApp.getChildContext ? RNApp.getChildContext() : {};
export default RNApp;
wx._historyConfig = {...(wx._historyConfig || {}), ...{"A":"/pages/HelloWorld/src/a/index","C":"/pages/HelloWorld/src/c/index","E":"/pages/HelloWorld/src/e/index","B":"/pages/HelloWorld/src/b/index","D":"/pages/HelloWorld/src/d/index"}};