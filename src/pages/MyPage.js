import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View
} from 'react-native';
import NavigationBar from './../component/NavigationBar'
import CustomKeyPage from './CustomKeyPage'
import SortKeyPage from './SortKeyPage'
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao'


export default class MyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render(){
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'我的'}
                    style={{backgroundColor:'#2196f3'}}
                />
                <Text
                    style={styles.tips}
                    onPress={()=>{
                        this.props.navigator.push({
                            component:CustomKeyPage,
                            params:{
                                ...this.props,
                                isRemoveKey:false,
                                flag:FLAG_LANGUAGE.flag_key
                            },

                        })
                    }}
                >自定义标签</Text>
                <Text
                    style={styles.tips}
                    onPress={()=>{
                        this.props.navigator.push({
                            component:CustomKeyPage,
                            params:{
                                ...this.props,
                                isRemoveKey:false,
                                flag:FLAG_LANGUAGE.flag_language
                            },

                        })
                    }}
                >自定义语言</Text>
                <Text
                    style={styles.tips}
                    onPress={()=>{
                        this.props.navigator.push({
                            component:SortKeyPage,
                            params:{
                                ...this.props,
                                flag:FLAG_LANGUAGE.flag_key
                            },

                        })
                    }}
                >标签排序</Text>
                <Text
                    style={styles.tips}
                    onPress={()=>{
                        this.props.navigator.push({
                            component:SortKeyPage,
                            params:{
                                ...this.props,
                                flag:FLAG_LANGUAGE.flag_language
                            },

                        })
                    }}
                >语言排序</Text>
                <Text
                    style={styles.tips}
                    onPress={()=>{
                        this.props.navigator.push({
                            component:CustomKeyPage,
                            params:{
                                ...this.props,
                                isRemoveKey:true,
                                flag:FLAG_LANGUAGE.flag_key
                            }
                        })
                    }}
                >标签移除</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    tips:{
        fontSize:20,
    }
})