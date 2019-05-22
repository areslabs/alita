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
wx._historyConfig = {...(wx._historyConfig || {}), ...{"A":"/src/a/index","C":"/src/c/index","E":"/src/e/index","B":"/src/b/index","D":"/src/d/index"}};