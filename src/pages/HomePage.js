/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import TabNavigator from 'react-native-tab-navigator';
import {Navigator} from 'react-native-deprecated-custom-components';
import {
    StyleSheet,
    Image,
    View,
    DeviceEventEmitter //事件發射器
} from 'react-native';

import PopularPage from './PopularPage'
import AsyncStorageTest from './AsyncStorageTest'
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

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_popular'}
                        selectedTitleStyle={{color: '#2196f3'}}
                        title="最热"
                        renderIcon={() => <Image style={styles.imgae} source={require('./../../res/img/cart.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.imgae, {tintColor: '#2196f3'}]}
                                                         source={require('./../../res/img/cart.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_popular'})}>
                        <PopularPage {...this.props}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_trending'}
                        selectedTitleStyle={{color: '#2196f3'}}
                        title="趋势"
                        renderIcon={() => <Image style={styles.imgae} source={require('./../../res/img/store.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.imgae, {tintColor: '#2196f3'}]}
                                                         source={require('./../../res/img/store.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_trending'})}>
                        <TrendingPage/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_favor'}
                        selectedTitleStyle={{color: '#2196f3'}}
                        title="收藏"
                        renderIcon={() => <Image style={styles.imgae} source={require('./../../res/img/sale.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.imgae, {tintColor: '#2196f3'}]}
                                                         source={require('./../../res/img/sale.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_favor'})}>
                       <WebViewTest/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_my'}
                        selectedTitleStyle={{color: '#2196f3'}}
                        title="我的"
                        renderIcon={() => <Image style={styles.imgae} source={require('./../../res/img/person.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.imgae, {tintColor: '#2196f3'}]}
                                                         source={require('./../../res/img/person.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_my'})}>
                        <MyPage {...this.props}/>
                    </TabNavigator.Item>
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

