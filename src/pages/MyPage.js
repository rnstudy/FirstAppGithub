import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    ListView
} from 'react-native';
import NavigationBar from './../component/NavigationBar'
import CustomKeyPage from './CustomKeyPage'
import SortKeyPage from './SortKeyPage'
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import TrendingCell from "../component/TrendingCell";
import {MORE_MENU} from '../component/MoreMenu'
import GlobalStyles from '../../res/styles/GlobalStyles'
import ViewUtil from'../util/ViewUtil'
import AboutPage from'./AboutPage'
import AboutMePage  from'./AboutMePage'
import CustomTheme from './CustomTheme'
import BaseComponent from "./BaseComponent";


export default class MyPage extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            customThemeViewVisible:false,
            theme:this.props.theme
        };
    }

    renderCustomThemeView(){
        return(
            <CustomTheme
                visible={this.state.customThemeViewVisible}
                {...this.props}
                onClose={()=>this.setState({ customThemeViewVisible:false})}
            >

            </CustomTheme>
        )
    }

    onClick(tab){
        let TargetComponet,params={...this.props,menuType:tab}
        switch (tab) {
            case MORE_MENU.Custom_Language:
                TargetComponet = CustomKeyPage;
                    params.flag=FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Custom_Key:
                TargetComponet = CustomKeyPage;
                    params.flag=FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Remove_Key:
                TargetComponet = CustomKeyPage;
                    params.flag=FLAG_LANGUAGE.flag_key;
                    params.isRemoveKey=true;
                break;
            case MORE_MENU.Sort_Key:
                TargetComponet = SortKeyPage;
                    params.flag=FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Sort_Language:
                TargetComponet = SortKeyPage;
                    params.flag=FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Custom_Theme:
                this.setState({
                    customThemeViewVisible:true
                })
                break;
            case MORE_MENU.About_Author:
                TargetComponet = AboutMePage;
                break;
            case MORE_MENU.About:
                TargetComponet=AboutPage;
                break;
        }
        if(TargetComponet){
            this.props.navigator.push({
                component:TargetComponet,
                params:params
            })
        }
    }

    getItem(tag,icon,text){

        return ViewUtil.getSettingItem(()=>{this.onClick(tag)},icon,text,this.state.theme.styles.tabBarSelectedIcon,null)
    }

    render(){
        var navigationBar = <NavigationBar
            title={'我的'}
            style={this.state.theme.styles.navBar}
        />


        return (
            <View style={GlobalStyles.root_contianer}>
                {navigationBar}
                <ScrollView>
                    <TouchableHighlight
                        onPress={()=>this.onClick(MORE_MENU.About)}
                    >
                        <View style={[styles.item,{height:90}]}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Image
                                    source={require('../../res/img/github.png')}
                                    style={[{width:40,height:40,marginRight:10},this.state.theme.styles.tabBarSelectedIcon]}
                                />
                                <Text>GitHub Popular</Text>
                            </View>
                            <Image
                                source={require('../../res/img/enter.png')}
                                style={[{width:22,height:22,marginRight:10},this.state.theme.styles.tabBarSelectedIcon]}
                            />
                        </View>
                    </TouchableHighlight>
                    <View style={GlobalStyles.line}/>
                    {/*趋势管理*/}
                    <Text style={styles.gropTitle}>趋势管理</Text>
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Custom_Language,require('../../res/img/language.png'),'自定义语言')}
                    <View style={GlobalStyles.line}/>
                    {/*语言排序*/}
                    {this.getItem(MORE_MENU.Sort_Language,require('../../res/img/sort2.png'),'语言排序')}
                    <View style={GlobalStyles.line}/>

                    {/*标签管理*/}
                    <Text style={styles.gropTitle}>标签管理</Text>
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Custom_Key,require('../../res/img/tag.png'),'自定义标签')}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Sort_Key,require('../../res/img/sort2.png'),'标签排序')}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Remove_Key,require('../../res/img/trash.png'),'标签移除')}
                    <View style={GlobalStyles.line}/>


                    {/*设置*/}
                    <Text style={styles.gropTitle}>设置</Text>
                    {/*自定义主题*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Custom_Theme,require('../../res/img/theme.png'),'自定义主题')}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.About_Author,require('../../res/img/author.png'),'关于作者')}
                    <View style={GlobalStyles.line}/>
                </ScrollView>
                {this.renderCustomThemeView()}
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
    },
    item:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:10,
        height:60,
        backgroundColor:'white'
    },
    gropTitle:{
        marginLeft:10,
        marginTop:10,
        marginBottom:5,
        fontSize:12,
        color:'gray'

    }
})