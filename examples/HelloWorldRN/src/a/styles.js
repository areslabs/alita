import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    itemText: {
        color: '#444',
        fontSize: 14
    },
    button: {
        height: 48, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#89abcd',
        borderColor: '#E6F7FF',
        borderWidth: 1
    },
    item: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 38,
        borderBottomColor: "#f0f0f0",
        borderBottomWidth: 1,
    },
    title: {
        color: '#FFF',
        fontSize: 18
    },

    activityIndicatorContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        alignItems: 'center'
    }
});


export default styles;