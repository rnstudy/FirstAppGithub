/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import TabNavigator from 'react-native-tab-navigator';
import {Navigator} from 'react-native-deprecated-custom-components';
import {
  Platform,
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
} from 'react-native';
export default class HomePage extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      selectedTab:'tb_popular',
    }
  }


  render() {
    return (
      <View style={styles.container}>
       <TabNavigator>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'tb_popular'}
              selectedTitleStyle={{color:'red'}}
              title="最热"
              renderIcon={() => <Image style={styles.imgae} source={require('./../../res/img/cart.png')} />}
              renderSelectedIcon={() => <Image style={[styles.imgae,{tintColor:'red'}]} source={require('./../../res/img/cart.png')} />}
              onPress={() => this.setState({ selectedTab: 'tb_popular' })}>
              <View style={styles.page1}></View>
            </TabNavigator.Item>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'tb_trending'}
               selectedTitleStyle={{color:'red'}}
              title="趋势"
              renderIcon={() => <Image style={styles.imgae} source={require('./../../res/img/store.png')} />}
              renderSelectedIcon={() => <Image style={[styles.imgae,{tintColor:'red'}]}  source={require('./../../res/img/store.png')} />}
              onPress={() => this.setState({ selectedTab: 'tb_trending' })}>
             <View style={styles.page2}></View>
              </TabNavigator.Item>
              <TabNavigator.Item
                  selected={this.state.selectedTab === 'tb_favor'}
                  selectedTitleStyle={{color:'red'}}
                  title="收藏"
                  renderIcon={() => <Image style={styles.imgae} source={require('./../../res/img/sale.png')} />}
                  renderSelectedIcon={() => <Image style={[styles.imgae,{tintColor:'red'}]} source={require('./../../res/img/sale.png')} />}
                  onPress={() => this.setState({ selectedTab: 'tb_favor' })}>
                  <View style={styles.page1}></View>
            </TabNavigator.Item>
            <TabNavigator.Item
                  selected={this.state.selectedTab === 'tb_my'}
                   selectedTitleStyle={{color:'red'}}
                  title="我的"
                  renderIcon={() => <Image style={styles.imgae} source={require('./../../res/img/person.png')} />}
                  renderSelectedIcon={() => <Image style={[styles.imgae,{tintColor:'red'}]}  source={require('./../../res/img/person.png')} />}
                  onPress={() => this.setState({ selectedTab: 'tb_my' })}>
                 <View style={styles.page2}></View>
              </TabNavigator.Item>
        </TabNavigator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  page1:{
    flex:1,
    backgroundColor: 'red'
  },
  page2:{
    flex:1,
    backgroundColor: 'yellow'
  },
  image:{
    width:22,
    height:22,
  }
});

