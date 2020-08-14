import React, { useReducer } from 'react'
import { View, Button, Text } from 'react-native'

const initialCount = 0

function init(initCont) {
  return { count: initCont }
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    case 'reset':
      return init(action.payload)
    default:
      throw new Error()
  }
}

export default function UseReducer1() {
  const [state, dispatch] = useReducer(reducer, initialCount, init)

  return (
    <View>
      <View>
        <Text>UseReducer1</Text>
      </View>
      <View>
        <Text>count：{state.count}</Text>
      </View>
      <Button
        onPress={() => dispatch({ type: 'reset', payload: initialCount })}
        title="reset"
      />
      <Button onPress={() => dispatch({ type: 'decrement' })} title="-" />
      <Button onPress={() => dispatch({ type: 'increment' })} title="+" />
    </View>
  )
}
