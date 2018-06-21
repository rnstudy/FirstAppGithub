import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    ListView,
    PixelRatio,
    StyleSheet,
    Text,
    View,
    Platform,
} from 'react-native';

import GlobalStyles from '../../res/styles/GlobalStyles'
import ViewUtil from '../util/ViewUtil'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import {MORE_MENU} from "../component/MoreMenu";
import CustomKeyPage from "./CustomKeyPage";
import SortKeyPage from "./SortKeyPage";


export default class AboutPage extends Component {
    constructor(props) {
        super(props);
    }

    onClick(tab){
        let TargetComponet,params={...this.props,menuType:tab}
        switch (tab) {
            case MORE_MENU.About_Author:
                break;
            case MORE_MENU.WebSite:
                break;
            case MORE_MENU.Feedback:
                break;

        }
        if(TargetComponet){
            this.props.navigator.push({
                component:TargetComponet,
                params:params
            })
        }
    }

    getParallaxRenderConfig(params) {
        let config = {}
        config.renderBackground = () => (
            <View key="background">
                <Image source={{
                    uri: params.backgroundImg,
                    width: window.width,
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.4)',
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
            </View>
        );

        config.renderForeground = () => (
            <View key="parallax-header" style={styles.parallaxHeader}>
                <Image style={styles.avatar} source={{
                    uri: params.avatar,
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE
                }}/>
                <Text style={styles.sectionSpeakerText}>
                    {params.name}
                </Text>
                <Text style={styles.sectionTitleText}>
                    {params.description}
                </Text>
            </View>
        );

        config.renderStickyHeader = () => (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
        );

        config.renderFixedHeader = () => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtil.getLeftButton(()=>{
                    this.props.navigator.pop()
                })}
            </View>
        )
        return config;
    }

    renderView(contentView,params) {
        let renderConfig = this.getParallaxRenderConfig(params);
        const {
            onScroll = () => {
            }
        } = this.props;
        return (
            <ParallaxScrollView
                onScroll={onScroll}
                headerBackgroundColor="#333"
                backgroundColor="#2196f3"
                stickyHeaderHeight={STICKY_HEADER_HEIGHT}
                parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
                backgroundSpeed={10}
                {...renderConfig}
            >
                {contentView}
            </ParallaxScrollView>
        );
    }

    render(){
        let content = <View>
            {ViewUtil.getSettingItem(()=>{this.onClick(MORE_MENU.WebSite)},require('../../res/img/website.png'),MORE_MENU.WebSite,{tintColor:'#2196f3'},null)}
            <View style={GlobalStyles.line}/>
            {ViewUtil.getSettingItem(()=>{this.onClick(MORE_MENU.About_Author)},require('../../res/img/author1.png'),MORE_MENU.About_Author,{tintColor:'#2196f3'},null)}
            <View style={GlobalStyles.line}/>
            {ViewUtil.getSettingItem(()=>{this.onClick(MORE_MENU.Feedback)},require('../../res/img/feedback.png'),MORE_MENU.Feedback,{tintColor:'#2196f3'},null)}
            <View style={GlobalStyles.line}/>
        </View>
        return this.renderView(content,{
             'name':'Github Hub',
            'description':'hellow world!',
            'avatar':'https://avatars0.githubusercontent.com/u/5243522?s=400&u=f7793d71d3a34c94c702b82ea111224872379d17&v=4',
            'backgroundImg':'https://a.vimage1.com/upload/merchandise/pdcvop/00107361/10010265/1522197661-460569664617893888-460569664617893902-1_720x909_70.jpg'
        })
    }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems:'center',
        paddingTop:(Platform.OS==='ios')?20:0,
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },
    fixedSection: {
        position: 'absolute',
        bottom: 0,
        left:0,
        top:0,
        paddingRight:8,
        flexDirection:'row',
        alignItems:'center',
        paddingTop:(Platform.OS==='ios')?20:0,
        justifyContent:"space-between"

    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 100
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 18,
        paddingVertical: 5
    },
    row: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        height: ROW_HEIGHT,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    rowText: {
        fontSize: 20
    }
});

