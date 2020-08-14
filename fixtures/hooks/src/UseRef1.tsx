import React, { useState, useRef, useEffect } from 'react'
import { View, Button, Text } from 'react-native'

import { usePrevious } from './usePrevious'

export default function UseRef1() {
  const [count, setCount] = useState(0)
  const latestCount = useRef(count)
  const prevCount = usePrevious(count)
  useEffect(() => {
    latestCount.current = count
  })

  function handleAlertClick() {
    setTimeout(() => {
      console.log('Clicked on: ' + latestCount.current)
    }, 3000)
  }

  return (
    <View>
      <View>
        <Text>UseRef1</Text>
      </View>
      <View>
        <Text>prevCount: {prevCount}</Text>
        <Text>count：{count}</Text>
      </View>
      <Button onPress={() => setCount(count + 1)} title="Click me" />
      <Button onPress={handleAlertClick} title="Show alert" />
    </View>
  )
}
