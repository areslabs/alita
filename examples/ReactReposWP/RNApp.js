import React, { Component, h } from "@areslabs/wx-react";
import { Router, Route } from "@areslabs/wx-router";
const RNAppClass = class App extends Component {};
const RNApp = new RNAppClass({});
RNApp.childContext = RNApp.getChildContext ? RNApp.getChildContext() : {};
export default RNApp;
wx._historyConfig = {...(wx._historyConfig || {}), ...{"ReactReposlist":"/src/components/list/index","ReactReposdetail":"/src/components/detail/index"}};