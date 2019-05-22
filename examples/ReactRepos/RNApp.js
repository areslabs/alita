/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Router, Route} from '@areslabs/router'

import List from './src/components/list'
import Detail from './src/components/detail'


export default class App extends Component {
  render() {
      return (
          <Router
              wxNavigationOptions={{
                  navigationBarBackgroundColor: "#ffffff",
                  navigationBarTextStyle: "black",
              }}
          >
              <Route key="list" component={List}/>
              <Route key="detail" component={Detail}/>
          </Router>
      )
  }
}

