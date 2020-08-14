import React from 'react'
import { View, Text, Button } from 'react-native'

//子组件会有不必要渲染的例子
interface ChildProps {
  name: { name: string; color: string }
  onClick: Function
}
const Child = ({ name, onClick }: ChildProps): JSX.Element => {
  console.log('子组件?')
  return (
    <View>
      <View>
        <Text style={{ color: name.color }}>
          我是一个子组件，父级传过来的数据：{name.name}
        </Text>
      </View>
      <Button onPress={onClick.bind(null, '新的子组件name')} title="改变name" />
    </View>
  )
}

// export default Child

const ChildMemo = React.memo(Child)

export default ChildMemo
