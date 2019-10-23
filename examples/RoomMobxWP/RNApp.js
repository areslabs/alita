import React, { PureComponent, h } from "@areslabs/wx-react";
import { Router, Route } from "@areslabs/wx-router";
import { Provider } from "@areslabs/wx-mobx-react";
import Room from './src/store/Room';
const room = new Room();
const RNAppClass = class RNApp extends PureComponent {
  render() {
    return h(Provider, {
      room: room,
      diuu: "DIUU00001"
    }, h(Router, {
      diuu: "DIUU00002"
    }, h(Route, {
      diuu: "DIUU00003"
    })));
  }

};
React.renderApp(RNAppClass);
wx._historyConfig = Object.assign({}, wx._historyConfig || {}, {}, {
  "RoomMobxinit": "/src/components/index"
});