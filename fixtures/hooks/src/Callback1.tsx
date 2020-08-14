import React, { useState, useCallback, useMemo } from 'react'
import { View, Text, Button } from 'react-native'

import ChildMemo from './Child1'

const Callback1 = () => {
  const [count, setCount] = useState(0)
  const [count1, setCount1] = useState(0)
  const [name, setName] = useState('Child组件')

  const onClick = useCallback((newName: string) => setName(newName + count1), [
    count1
  ])
  const newName = useMemo(
    () => ({ name, color: name.indexOf('name') !== -1 ? 'red' : 'green' }),
    [name]
  )

  return (
    <View>
      <Button
        onPress={() => {
          setCount(count + 1)
        }}
        title="count-加1"
      />
      <Button
        onPress={() => {
          setCount1(count1 + 1)
        }}
        title="count1-加1"
      />
      <Text>count:{count}</Text>
      <Text>count1:{count1}</Text>
      <ChildMemo name={newName} onClick={onClick} />
    </View>
  )
}

export default Callback1
