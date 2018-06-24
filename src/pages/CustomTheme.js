import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    ListView,
    Modal,
    DeviceEventEmitter
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
import ThemeFactory,{ThemeFlags} from '../../res/styles/ThemeFactory'
import ThemeDao from '../expand/dao/ThemeDao'
import {ACTION_HOME} from "./HomePage";
import BaseComponent from "./BaseComponent";

export default class CustomTheme extends BaseComponent {

    constructor(props) {
        super(props);
        this.themeDao = new ThemeDao();
        this.state = {
        };
    }

    /**
     * 选择主题
     * @param themeKey
     */
    onSelectTheme(themeKey){
        this.themeDao.save(ThemeFlags[themeKey])
        this.props.onClose();
        DeviceEventEmitter.emit('ACTION_BASE',ACTION_HOME.A_THEME,ThemeFactory.createTheme(
            ThemeFlags[themeKey]
        ))
    }

    /**
     * 创建主题列表
     * @param themeKey
     */
    getThemeItem(themeKey){
        return <TouchableHighlight
            style={{flex:1}}
            underlayColor='white'
            onPress={()=>this.onSelectTheme(themeKey)}
        >
            <View style={[{backgroundColor:ThemeFlags[themeKey]},styles.themeItem]}>
                <Text style={styles.themeTitle}>{themeKey}</Text>
            </View>
        </TouchableHighlight>
    }

    renderThemeItems(){
        let views = [];
        for(let i = 0,keys = Object.keys(ThemeFlags),l=keys.length; i<l; i+=3){
            let key1 = keys[i],key2=keys[i+1],key3=keys[i+2]
            views.push(<View key={i} style={{flexDirection:'row'}}>
                {this.getThemeItem(key1)}
                {this.getThemeItem(key2)}
                {this.getThemeItem(key3)}
            </View>)
        }
        return views;
    }

    renderContentView(){
        return(
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={()=>{this.props.onClose()}}
            >
                <View style={styles.modalContainer}>
                    <ScrollView>
                        {this.renderThemeItems()}
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    render(){
        let view = this.props.visible ?  <View style={GlobalStyles.root_contianer}>
            {this.renderContentView()}
        </View>:null
        return view;
    }
}


const styles = StyleSheet.create({
    themeItem:{
        flex:1,
        height:120,
        margin:3,
        padding:3,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
    },
    modalContainer:{
        flex:1,
        margin:10,
        marginTop:Platform.OS ==='ios' ? 20:10,
        backgroundColor:'white',
        borderRadius:3,
        shadowColor:'gray',
        shadowOffset:{width:2,height:2},
        shadowOpacity:0.5,
        shadowRadius:2,
        padding:3
    },
    themeTitle:{
        color:'white',
        fontWeight:'500',
        fontSize:16
    }
})