import React, {Component} from 'react'
import {Platform, StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity} from 'react-native'
import {AnimatedText, AnimatedView, createAnimation, AnimatedImage} from '@areslabs/wx-animated'
import SecBody from './SecBody'
import down from '../../assets/arrow_down.png'


export default class Detail extends Component {

    constructor(props) {
        super(props)

        const {stargazers_url, contributors_url, forks_url, subscribers_url} = this.props.routerParams
        this.state = {
            secDatas: [
                {
                    key: 'Stargazers',
                    aniImage: null,
                    aniBody: null,
                    open: false,
                    apiUrl: stargazers_url,
                },
                {
                    key: 'Subscribers',
                    aniImage: null,
                    aniBody: null,
                    open: false,
                    apiUrl: subscribers_url
                },
                {
                    key: 'Contributors',
                    aniImage: null,
                    aniBody: null,
                    open: false,
                    apiUrl: contributors_url
                },
            ]
        }
    }

    render() {

        const {description, owner} = this.props.routerParams

        return (
            <View>
                <View style={styles.sections}>
                    <Image style={{height: 180, width: 180, alignSelf: 'center', marginTop: 10}} source={{uri: owner.avatar_url}}></Image>
                    <Text style={styles.des}>{description}</Text>
                </View>

                {
                    this.state.secDatas.map((sec, index) => {
                        return (
                            <View key={sec.key}>
                                <TouchableOpacity style={styles.aniSections}
                                                  onPress={() => {
                                                      const aniImage = createAnimation({
                                                          duration: 300,
                                                          timingFunction: 'ease',
                                                      })
                                                      aniImage
                                                          .rotateZ(sec.open ? 0 : 180)
                                                          .step()

                                                      const aniBody = createAnimation({
                                                          duration: 300,
                                                          timingFunction: 'ease',
                                                      })
                                                      aniBody
                                                          .height(sec.open ? 0: 200)
                                                          .step()


                                                      const newSecDatas = [...this.state.secDatas]
                                                      newSecDatas[index].aniImage = aniImage.export()
                                                      newSecDatas[index].aniBody = aniBody.export()
                                                      newSecDatas[index].open = !sec.open

                                                      this.setState({
                                                          secDatas: newSecDatas
                                                      })
                                                  }}
                                >
                                    <Text>{sec.key}</Text>
                                    <AnimatedImage animation={sec.aniImage} style={{height: 15, width: 15}} source={down} />
                                </TouchableOpacity>
                                <SecBody animation={sec.aniBody} apiUrl={sec.apiUrl} skey={sec.key}/>
                            </View>

                        )
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    sections: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 5
    },
    des: {
        fontSize: 18,
        lineHeight: 26,
        marginBottom: 10,
        marginTop: 10,
        color: '#333'
    },
    aniSections: {
        height: 40,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})