import React, {Component} from 'react';
import {
    View,
    Linking,
} from 'react-native';

import GlobalStyles from '../../res/styles/GlobalStyles'
import ViewUtil from '../util/ViewUtil'
import {MORE_MENU} from "../component/MoreMenu";
import AboutCommon,{FLAG_ABOUT} from'./AboutCommon'
import WebPage from "./WebPage";
import AboutMePage from "./AboutMePage"
import config from '../../res/data/config'
import BaseComponent from "./BaseComponent";


export default class AboutPage extends BaseComponent {
    constructor(props) {
        super(props);
        this.aboutCommon = new AboutCommon(props,(dic)=>this.updateState(dic),FLAG_ABOUT.flag_about,config)
        this.state={
            projectModels:[],
            theme:this.props.theme,
        }
    }

    updateState(dic){
        this.setState(dic)
    }

    componentDidMount(){
        super.componentDidMount()
        this.aboutCommon.componentDidMount();
    }

    onClick(tab){
        let TargetComponet,params={...this.props,menuType:tab}
        switch (tab) {
            case MORE_MENU.About_Author:
                TargetComponet=AboutMePage;
                break;
            case MORE_MENU.WebSite:
                TargetComponet=WebPage;
                params.url='https://wurh.github.io/'
                params.title='rahul.wu 博客'
                break;
            case MORE_MENU.Feedback:
                //Linking
                var url = 'mailto://ro87630872@gmail.com';
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => console.error('An error occurred', err));
                break;
        }
        if(TargetComponet){
            this.props.navigator.push({
                component:TargetComponet,
                params:params
            })
        }
    }

    render(){
        let content = <View>
            {this.aboutCommon.renderRepository(this.state.projectModels)}
            {ViewUtil.getSettingItem(()=>{this.onClick(MORE_MENU.WebSite)},require('../../res/img/website.png'),MORE_MENU.WebSite,this.state.theme.styles.tabBarSelectedIcon,null)}
            <View style={GlobalStyles.line}/>
            {ViewUtil.getSettingItem(()=>{this.onClick(MORE_MENU.About_Author)},require('../../res/img/author1.png'),MORE_MENU.About_Author,this.state.theme.styles.tabBarSelectedIcon,null)}
            <View style={GlobalStyles.line}/>
            {ViewUtil.getSettingItem(()=>{this.onClick(MORE_MENU.Feedback)},require('../../res/img/feedback.png'),MORE_MENU.Feedback,this.state.theme.styles.tabBarSelectedIcon,null)}
            <View style={GlobalStyles.line}/>
        </View>
        return this.aboutCommon.render(content,{
             'name':'Github Hub',
            'description':'hellow world!',
            'avatar':'https://avatars0.githubusercontent.com/u/5243522?s=400&u=f7793d71d3a34c94c702b82ea111224872379d17&v=4',
            'backgroundImg':'https://a.vimage1.com/upload/merchandise/pdcvop/00107361/10010265/1522197661-460569664617893888-460569664617893902-1_720x909_70.jpg'
        })
    }
}


