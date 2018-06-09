/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import TabNavigator from 'react-native-tab-navigator';
import {Navigator} from 'react-native-deprecated-custom-components';
import Boy from './src/boy'
import {
  Platform,
  StyleSheet,
  Image,
  Text,
  View
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      selectedTab:'home',
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <Navigator 
        initialRoute={{
          component:Boy
        }}
        renderScene={(route,navigator)=>{
            let Component = route.component;
            return <Component navigator={navigator} {...route.params} />
        }}
        ></Navigator>
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
