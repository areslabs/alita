import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import {
    Router,
    Route,
    TabRouter
} from '@areslabs/router'


import A from './a'
import B from './b'
import C from './c'
import D from './d'
import E from './e'
import F from './f'
import G from './g'
import Video from './g/Video'
import Map from './g/Map'
import Form from './g/Form'
import Canvas from './g/Canvas'
import Custom from './g/Custom'

import faxianPNG from '../assets/faxian.png'
import myCurrentPNG from '../assets/myCurrent.png'
import myPNG from '../assets/my.png'



export default class App extends PureComponent {
    static childContextTypes = {
        txt: PropTypes.string,
        test: PropTypes.string,
        store: PropTypes.object
    }


    getChildContext() {
        return {
            txt: '6666',
            test: 'test',
        };
    }



    render() {

        return (
            <Router
                wxNavigationOptions={{
                    navigationBarTitleText: "HelloWorld",
                    navigationBarBackgroundColor: "#eee",
                    navigationBarTextStyle: "black",
                }}

                navigationOptions={{
                    title: 'HelloWorld'
                }}
            >
                <TabRouter text="常见写法" image={faxianPNG} selectedImage={require('../assets/faxianCurrent.png')}>
                    <Route key={"A"} component={A}/>
                    <Route subpage="sp1" key={"C"} component={C}/>
                    <Route subpage="sp2" key={"E"} component={E}/>
                </TabRouter>

                <TabRouter text="RN组件" image={require('../assets/comp_desel.png')} selectedImage={require('../assets/comp_sel.png')}>
                    <Route key={"B"} component={B}/>
                </TabRouter>

                <TabRouter text="常见动画" image={myPNG} selectedImage={myCurrentPNG}>
                    <Route key={"D"} component={D}/>
                </TabRouter>

                <TabRouter text="样式属性" image={myPNG} selectedImage={myCurrentPNG}>
                    <Route key={"F"} component={F}/>
                </TabRouter>

                <TabRouter text="小程序组件" image={myPNG} selectedImage={myCurrentPNG}>
                    <Route key={"G"} component={G}/>
                    <Route key={"Map"} component={Map}/>
                    <Route key={"Video"} component={Video}/>
                    <Route key={"Canvas"} component={Canvas}/>
                    <Route key={"Form"} component={Form}/>
                    <Route key={"Custom"} component={Custom}/>
                </TabRouter>
            </Router>
        )
    }
}