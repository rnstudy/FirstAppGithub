/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import TabNavigator from 'react-native-tab-navigator';
import {
    StyleSheet,
    Image,
    View,
    DeviceEventEmitter //事件發射器
} from 'react-native';

import PopularPage from './PopularPage'
import MyPage from './MyPage'
import Toast,{DURATION} from 'react-native-easy-toast';
import WebViewTest from './WebViewTest'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'

export const ACTION_HOME={A_SHOW_TOAST:'showToast',A_RESTART:'restart'};
export const FLAG_TAB={
    flag_popularTab:'tb_popular',
    flag_trendingTab:'tb_trending',
    flag_favoriteTab:'tb_favorite',
    flag_my:'tb_my',
}
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        let selectedTab = this.props.selectedTab ? this.props.selectedTab: 'tb_popular'
        this.state = {
            selectedTab: selectedTab,
            theme:this.props.theme
        }
    }

    /**
     * 重启首页
     * @param jumpToTab 默认显示的页面
     */
    onRestart(jumpToTab){
        this.props.navigator.resetTo({
            component:HomePage,
            params:{
                ...this.props,
                selectedTab:jumpToTab
            }
        })
    }

    /**
     * 通知回调事件处理
     * @param action
     * @param params
     */
    onAction(action,params){
        if(ACTION_HOME.A_RESTART === action){ //
           this.onRestart();
        }else if(ACTION_HOME.A_SHOW_TOAST === action){
            this.toast.show(params.text,DURATION.LENGTH_SHORT);
        }
    }

    componentDidMount(){
        this.listener = DeviceEventEmitter.addListener('ACTION_HOME',(action,params)=>{
            this.onAction(action,params)
            //this.toast.show(text,DURATION.LENGTH_SHORT);
        });

    }

    componentWillUnmount(){
        this.listener && this.listener.remove();
    }

    _renderTab(Component,selectTab,title,icon){
        return    <TabNavigator.Item
            selected={this.state.selectedTab === selectTab}
            selectedTitleStyle={this.state.theme.styles.selectedTitleStyle}
            title={title}
            renderIcon={() => <Image style={styles.imgae} source={icon}/>}
            renderSelectedIcon={() => <Image style={[styles.imgae, this.state.theme.styles.tabBarSelectedIcon]}
                                             source={icon}/>}
            onPress={() => this.setState({selectedTab: selectTab})}>
            <Component {...this.props}/>
        </TabNavigator.Item>
    }
    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    {this._renderTab(PopularPage,'tb_popular','最热',require('./../../res/img/hot.png'))}
                    {this._renderTab(TrendingPage,'tb_trending','趋势',require('./../../res/img/trending.png'))}
                    {this._renderTab(FavoritePage,'tb_favor','收藏',require('./../../res/img/favi.png'))}
                    {this._renderTab(MyPage,'tb_my','我的',require('./../../res/img/person.png'))}
                </TabNavigator>
                <Toast ref={toast=>this.toast = toast}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    page1: {
        flex: 1,
        backgroundColor: 'red'
    },
    page2: {
        flex: 1,
        backgroundColor: 'yellow'
    },
    image: {
        width: 22,
        height: 22,
    }
});

