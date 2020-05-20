import React from 'react'
import { StyleSheet, Text, View, Platform, FlatList, SectionList } from "react-native"


const A = function () {
	return <Text>ADefault</Text>
}

const B = function () {
	return <Text>BDefault</Text>
}

function f(x) {
	return x
}


export default f(B)