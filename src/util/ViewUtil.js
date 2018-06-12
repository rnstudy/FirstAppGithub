import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';

export default class ViewUtil {
    static getLeftButton(callBack) {
        return <TouchableOpacity
            onPress={callBack}
        >
            <Image style={styles.btn} source={require('./../../res/img/back.png')}/>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    btn: {
        width: 16,
        height: 16,
        margin: 10,
        tintColor: '#fff'
    }
})