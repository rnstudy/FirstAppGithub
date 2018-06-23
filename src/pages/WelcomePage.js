import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Image,
  Text,
  View
} from 'react-native';

import NavigationBar from './../component/NavigationBar'
import HomePage from './HomePage'
import ThemeDao from '../expand/dao/ThemeDao'
export default class WelcomePage extends Component{
	constructor(props){
		super(props)
	}

	componentDidMount(){
		new ThemeDao().getTheme().then((data)=>{
			this.theme = data;
		})
		this.timer = setTimeout(()=>{
			this.props.navigator.resetTo({
				component:HomePage,
				params:{
					theme:this.theme
				}
			})
		},500)
	}
	componentWillUnmount(){
		this.timer && clearTimeout(this.timer )
	}
	render(){
		return <View>
			<NavigationBar
				title={'欢迎'}
			/>
			<Text>欢迎</Text>
		</View>
	}
}