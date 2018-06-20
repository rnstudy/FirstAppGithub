import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Text
} from 'react-native';

export default class ViewUtil {

    /**
     * 获取设置页的Item
     * @param callBack 单击item的回调
     * @param icon  左侧图标
     * @param text  显示的文本
     * @param tintStyle 图标着色
     * @param expandableIco 右侧图标
     */
    static getSettingItem(callBack,icon,text,tintStyle,expandableIco){
        return(
            <TouchableOpacity
                onPress={callBack}
            >
                <View style={styles.setting_item_container}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image
                            resizeMode='stretch'
                            source={icon}
                            style={[{width:16,height:16,marginRight:10},tintStyle]}
                        />
                        <Text>{text}</Text>
                    </View>
                    <Image
                        source={expandableIco?expandableIco:require('../../res/img/enter.png')}
                        style={[{width:22,height:22,marginRight:10},{tintColor:'#2196f3'}]}
                    />
                </View>
            </TouchableOpacity>
        )
    }

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
    },
    setting_item_container:{
      backgroundColor:'white',
        padding:10,
        height:60,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row'
    }
})