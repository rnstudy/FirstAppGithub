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

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'tb_popular',
        }
    }

    componentDidMount(){
        this.listener = DeviceEventEmitter.addListener('showToast',(text)=>{
            this.toast.show(text,DURATION.LENGTH_SHORT);
        })
    }

    componentWillUnmount(){
        this.listener && this.listener.remove();
    }

    _renderTab(Component,selectTab,title,icon){
        return    <TabNavigator.Item
            selected={this.state.selectedTab === selectTab}
            selectedTitleStyle={{color: '#2196f3'}}
            title={title}
            renderIcon={() => <Image style={styles.imgae} source={icon}/>}
            renderSelectedIcon={() => <Image style={[styles.imgae, {tintColor: '#2196f3'}]}
                                             source={icon}/>}
            onPress={() => this.setState({selectedTab: selectTab})}>
            <Component {...this.props}/>
        </TabNavigator.Item>
    }
    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    {this._renderTab(PopularPage,'tb_popular','最热',require('./../../res/img/cart.png'))}
                    {this._renderTab(TrendingPage,'tb_trending','趋势',require('./../../res/img/store.png'))}
                    {this._renderTab(WebViewTest,'tb_favor','收藏',require('./../../res/img/sale.png'))}
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

