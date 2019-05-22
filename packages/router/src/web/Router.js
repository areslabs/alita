/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import React from 'react'
import Tabs from './Tabs'
import history from './history'



export default class Router extends React.Component {
    constructor(props, context) {
        super(props, context)
        const {tabInfoList, indexKey, keyCompMap} = this.getRouterData()
        this.tabInfoList = tabInfoList
        this.keyCompMap = keyCompMap
        this.indexKey = indexKey

        if (window && window.addEventListener) {
            window.addEventListener("hashchange", () => {
                this._activeComp.componentWillUnfocus && this._activeComp.componentWillUnfocus()

                const {activeKey, params} = this.getKeyAndParams()
                this.setState({
                    activeKey,
                    params
                }, () => {
                    this._activeComp.componentDidFocus && this._activeComp.componentDidFocus()
                })
            })
        }

        if (window) {
            const {activeKey, params} = this.getKeyAndParams()

            this.state = {
                activeKey,
                params,
            }
        }

        this.tabChange = this.tabChange.bind(this)
        this.activeCompRef = this.activeCompRef.bind(this)
    }

    getKeyAndParams() {
        const whash = window.location.hash
        if (whash === '') {
            return {
                activeKey: this.indexKey,
                params:  {}
            }
        } else {
            const fhash = decodeURIComponent(whash.startsWith('#') ? whash.substring(1) : whash)
            const hashInfo = JSON.parse(fhash)
            return {
                activeKey: hashInfo.hash,
                params: hashInfo.params || {}
            }
        }
    }

    getRouterData() {
        const {children} = this.props

        const r = {
            keyCompMap: {},
            tabInfoList: []
        }


        React.Children.forEach(children, (child, index)=> {
            const {type: {displayName}} = child

            if (displayName === 'TabRouter') {
                const {children: tabChildren, image, selectedImage, text, initRoute} = child.props
                React.Children.forEach(tabChildren, (tChild, tIndex) => {
                    const {key, props: { component }} = tChild
                    component.__tabIndex__ = index
                    r.keyCompMap[key] = component


                    if (tIndex === 0) {
                        r.tabInfoList.push({
                            image,
                            selectedImage,
                            text,
                            firstKey: initRoute || key
                        })
                    }
                })

            } else {
                const {key, props: {component}} = child
                r.keyCompMap[key] = component
                if (index === 0) {
                    r.indexKey = this.props.initRoute || key
                }
            }
        })

        if (r.tabInfoList.length > 0) {
            r.indexKey = r.tabInfoList[0].firstKey
        }

        return r
    }

    tabChange (index) {
        const firstKey = this.tabInfoList[index].firstKey
        history.push(firstKey)
    }

    activeCompRef(ac) {
        this._activeComp = ac
    }

    componentDidMount() {
        this._activeComp.componentDidFocus && this._activeComp.componentDidFocus()
    }

    render() {
        const ActiveComp = this.keyCompMap[this.state.activeKey]
        const tabIndex = ActiveComp.__tabIndex__
        let isTabFirstKey = false
        if (tabIndex !== undefined) {
            isTabFirstKey = this.tabInfoList[tabIndex].firstKey === this.state.activeKey
        }

        return (
            <div style={{width: '100%', height: '100%'}}>
                <div
                    style={{
                        background: '#e9e9e9',
                        width: '100%',
                        height: `calc(100% - ${isTabFirstKey ? '50' : '0'}px)`,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <ActiveComp
                        key={window.location.href}
                        routerParams={this.state.params}
                        ref={this.activeCompRef}
                    />
                </div>

                {isTabFirstKey && <Tabs
                    onTabChange={this.tabChange}
                    activeIndex={tabIndex}
                    tabInfoList={this.tabInfoList}
                />}
            </div>
        )
    }
}