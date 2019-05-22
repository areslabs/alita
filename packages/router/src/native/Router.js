/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import React from 'react'
import {View, Text, Image, Button} from 'react-native'

import {
    createStackNavigator,
    createBottomTabNavigator
} from 'react-navigation'

import hoistStatics from 'hoist-non-react-statics'

import history from './history'

function wrapperForNavi(Comp, isFirst) {

    class WrapperComp extends React.Component {
        constructor(props, context) {
            super(props, context)

            // react-navigation 2.x or react-navigation 3.x
            if (typeof props.navigation.addListener === 'function') {
                this.didFucusLis = props.navigation.addListener('didFocus', () => {
                    this.componentDidFocus()
                })

                this.didBlurLis = props.navigation.addListener('willBlur', () => {
                    this.componentWillUnfocus()
                })
            }
        }


        componentDidFocus() {
            this.rc.componentDidFocus && this.rc.componentDidFocus()
        }

        componentWillUnfocus() {
            this.rc.componentWillUnfocus && this.rc.componentWillUnfocus()
        }

        componentWillUnmount() {
            this.didFucusLis.remove()
            this.didBlurLis.remove()
        }

        render() {
            const params = this.props.navigation.state.params || {}

            return <Comp
                ref={rc => {
                    this.rc = rc
                }}
                {...this.props}
                routerParams={params}
            />
        }
    }

    WrapperComp = hoistStatics(WrapperComp, Comp)
    return WrapperComp
}

function getStackRoute(props, navigationOptions, initRoute) {
    const stackObj = {}
    React.Children.forEach(props.children, (child, index) => {
        const {key, props: {component}, type: {displayName}} = child
        if (displayName === 'Route') {
            stackObj[key] = {
                screen: wrapperForNavi(component, index === 0)
            }
        }
    })
    return createStackNavigator(stackObj, {
        initialRouteName: initRoute,
        navigationOptions
    })
}

export default class Router extends React.Component {
    constructor(props) {
        super(props)

        const childTabRouter = []
        React.Children.forEach(props.children, child => {
            const {type: {displayName}} = child
            if (displayName === 'TabRouter') {
                childTabRouter.push(child.props)
            }
        })

        this.Root = null
        if (childTabRouter.length > 0) {
            let allTabStack = {}
            const imageMap = {}
            for(let i = 0; i < childTabRouter.length; i++) {
                const tabRouter = childTabRouter[i]
                const {text, image, selectedImage, initialRouteName} = tabRouter

                allTabStack[text] = {
                    screen: getStackRoute(childTabRouter[i], this.props.navigationOptions, initialRouteName)
                }
                imageMap[text] = {
                    image,
                    selectedImage
                }
            }
            history.setNaviType('tab')
            this.Root = createBottomTabNavigator(
                allTabStack,
                {
                    navigationOptions: ({ navigation }) => {
                        let tabBarVisible = true;
                        if (navigation.state.index > 0) {
                            tabBarVisible = false;
                        }

                        return {
                            tabBarVisible,
                            tabBarIcon: ({ focused, tintColor }) => {
                                const { routeName } = navigation.state;
                                const {image, selectedImage} = imageMap[routeName]

                                return <Image
                                    resizeMode="stretch"
                                    source={focused ? selectedImage : image}
                                    style={{
                                        width: 25,
                                        height: 25
                                    }}
                                />;
                            }
                        }
                    }
                }
            )
        } else {
            history.setNaviType('stack')
            this.Root = getStackRoute(props, this.props.navigationOptions, this.props.initRoute)
        }
    }

    render() {
        const Root = this.Root
        return <Root
            ref={navigatorRef => {
                history.setTopLevelNavigator(navigatorRef)
            }}
        />
    }
}