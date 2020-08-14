import React, { useState, useContext } from 'react'
import { View, Text, Button, TextInput } from 'react-native'

import { ThemeContext } from './Context'

export default function Context1() {
  return (
    <View style={{ alignItems: 'center' }}>
      <View>
        <View style={{ width: '100%' }}>
          <ThemeContext.Consumer>
            {value => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>Context1：</Text>
                <Text>{value.theme}</Text>
              </View>
            )}
          </ThemeContext.Consumer>
        </View>
      </View>
    </View>
  )
}
