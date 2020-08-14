import React, {useState, useEffect} from 'react'
import {View, Button, Text} from 'react-native'
import styles from './styles';

export default function Hooks() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    console.log('Hooks did Mount!')
  }, [])

  return (
    <View style={[styles.item, {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}>
      <Button onPress={() => setCount(count + 1)} title="+" />
      <View>
        <Text>count: {count}</Text>
      </View>
      <Button onPress={() => setCount(count => count - 1)} title="-" />
    </View>
  )
}