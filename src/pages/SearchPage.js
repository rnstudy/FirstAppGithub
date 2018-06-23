import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View,
    TextInput,
    ListView,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native';

import NavigationBar from './../component/NavigationBar'

export default class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return <View style={{flex: 1}}>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tips: {
        fontSize: 29
    },
    input: {
        height: 20,
        borderWidth: 1
    },

})