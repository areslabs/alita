const RNCOMPSET = new Set([
    'ActivityIndicator',
    'Button',
    'DatePickerIOS',
    'DrawerLayoutAndroid',
    'FlatList',
    'Image',
    'KeyboardAvoidingView',
    'MaskedViewIOS',
    'Modal',
    'NavigatorIOS',
    'Picker',
    'PickerIOS',
    'ProgressBarAndroid',
    'ProgressViewIOS',
    'RefreshControl',
    'ScrollView',
    'SectionList',
    'SegmentedControlIOS',
    'Slider',
    'SnapshotViewIOS',
    'StatusBar',
    'Switch',
    'TabBarIOS',
    'TabBarIOS.Item',
    'Text',
    'TextInner',
    'TextInput',
    'ToolbarAndroid',
    'TouchableHighlight',
    'TouchableNativeFeedback',
    'TouchableOpacity',
    'TouchableWithoutFeedback',
    'View',
    'ViewPagerAndroid',
    'VirtualizedList',
    'WebView',
    'DatePickerAndroid',
    'DrawerAndroid',
    'Animated',
    'MaskedView',
    'TimePickerAndroid',
    'ToastAndroid',
    'ViewPager',
    'ImageBackground'
])


function isReactComp(superClass) {
    if (!superClass) return false

    let suName = ""
    if (superClass.type === 'MemberExpression') {
        suName = superClass.property.name
    }

    if (superClass.type === 'Identifier')  {
        suName = superClass.name
    }

    if (suName === 'Component'
        || suName === 'PureComponent'
        || suName === 'StaticComponent'
    ) {
        return true
    }

    return false
}

function isHocComponent(superClass) {
    if (!superClass) return false

    let suName = ""
    if (superClass.type === 'MemberExpression') {
        suName = superClass.property.name
    }

    if (superClass.type === 'Identifier')  {
        suName = superClass.name
    }

    if (suName === 'HocComponent') {
        return true
    }

    return false
}


module.exports = {
    RNCOMPSET,
    isReactComp,
    isHocComponent
}
