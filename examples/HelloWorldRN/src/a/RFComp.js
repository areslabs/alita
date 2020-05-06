/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {Component} from 'react'

import {
	Text,
} from 'react-native'

export function RF() {

	return <>
		<Text>RF1!</Text>
		<Text>RF2!</Text>
	</>
}

export function RF2() {

	const x =  <>
		<Text>RF1!</Text>
		<Text>RF2!</Text>
	</>

	return x
}

export function RA() {
	return [
		<Text>RA1!</Text>,
		<Text>RA2!</Text>
	]
}


export function RA2() {
	const x = [
		<Text>RA1!</Text>,
		<Text>RA2!</Text>
	]

	return x
}
