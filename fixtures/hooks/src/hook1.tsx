import React, { useState, useEffect } from 'react'
import { View, Text, Button, TextInput } from 'react-native'

import Hook2 from './hook2'
import Context1 from './Context1'
import Callback1 from './Callback1'
import UseRef1 from './UseRef1'
import UseReducer1 from './UseReducer1'

export default function Hook1() {
  const [count, setCount] = useState(0)
  const [userName, setUserName] = useState('')
  useEffect(() => {
    console.log('ssssss111', count)
  }, [count])
  useEffect(() => {
    console.log('ssssss222')
    return () => {
      console.log('清理副作用')
    }
  }, [])
  useEffect(() => {
    console.log('userName', userName)
  }, [userName])

  return (
    <View style={{ alignItems: 'center' }}>
      <View>
        <Text>{count}</Text>
      </View>
      <Button onPress={() => setCount(count + 1)} title="+" />
      <Button onPress={() => setCount(count => count - 1)} title="-" />
      <TextInput
        style={{ height: 40 }}
        placeholder="Type here to translate!"
        onChangeText={text => setUserName(text)}
      />
      <Hook2 />
      <Context1 />
      <Callback1 />
      <UseRef1 />
      <UseReducer1 />
    </View>
  )
}
