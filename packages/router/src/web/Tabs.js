/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import React from 'react'

export default class Tabs extends React.Component {

    render() {
        const {
            onTabChange,
            activeIndex,
            tabInfoList
        } = this.props
        return (
            <div style={{
                height: '50px',
                background: '#fff',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                {
                    tabInfoList.map(({ image, selectedImage, text }, index) => {

                        return (
                            <div
                                onClick={() => {
                                    onTabChange(index)
                                }}
                                key={`tab_${index}`}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-around',
                                    alignItems: 'center'
                                }}>
                                <img style={{width: '25px'}} src={activeIndex === index ?  selectedImage : image}/>
                                <span style={{color: '#aaa', fontSize: '12px'}}>{text}</span>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}