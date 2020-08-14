import React from 'react'
import { Text, View } from 'react-native'
import { LinearGradient } from 'react-native-linear-gradient'
import { SanitationDetail } from '@src/secure-check-in/datasource/SecureCheckInModel'

import Hook1 from './hook1'
import { ThemeContext } from './Context'

interface Props {
  sanitationDetail: SanitationDetail
  sanitationLevelMC: () => void
  sanitationTreatyMC: () => void
  expandButtonMV: () => void
  expandButtonMC: () => void
  handleToService: () => void
}

interface State {
  theme: string
}

export default class SecureCheckIn extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      theme: 'iii'
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        theme: 'aaa'
      })
    }, 3000)
  }

  renderJsx() {
    return (
      <View style={{ alignItems: 'center', margin: 30 }}>
        <Text>hook demo</Text>
        {/* > */}
      </View>
    )
  }

  render() {
    const { theme } = this.state
    console.log('theme', theme)
    return (
      <LinearGradient
        colors={['#45E6A4', '#00CABC']}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={{ flex: 1 }}
      >
        <ThemeContext.Provider
          value={{
            theme
          }}
        >
          <View style={{ paddingTop: 20 }}>
            {this.renderJsx()}
            <Hook1 />
          </View>
        </ThemeContext.Provider>
      </LinearGradient>
    )
  }
}
