import React, { useState, useContext } from 'react'
import { View, Text, Button, TextInput } from 'react-native'

import { ThemeContext } from './Context'

export default function Hook1() {
  const { theme } = useContext(ThemeContext)

  return (
    <View style={{ alignItems: 'center' }}>
      <View>
        <Text>主题：{theme}</Text>
      </View>
    </View>
  )
}
