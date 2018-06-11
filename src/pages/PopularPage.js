import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Image,
  Text,
  View,
  TextInput
} from 'react-native';

import NavigationBar from './../component/NavigationBar'
import DataRepository from './../expand/dao/DataRepository'
const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
export default class PopularPage extends Component{
	constructor(props) {
	  super(props)
	  this.dataRepository = new DataRepository()
	  this.state = {
	  	result:''
	  }
	}

	onLoad(){
		let url = this.getUrl(this.text);
		this.dataRepository.fetchNetRepository(url)
		.then(result=>{
			this.setState({
				result:JSON.stringify(result)
			})
		})
		.catch(error=>{
			this.setState({
				result:JSON.stringify(result)
			})
		})
	}

	getUrl(key){
		return URL+key+QUERY_STR;
	}
	
	render(){
		return <View style={styles.container}>
			<NavigationBar
				title={'最热'}
				style={{backgroundColor:'#6495ED'}}
			/>
			<Text
			 style={styles.tips}
			 onPress={()=>{
			 	this.onLoad()
			 }}
			 >获取数据</Text>
			<TextInput 
			style={styles.input} 
			onChangeText={text=>this.text=text}
			/>
			<Text style={{height:500}}>{this.state.result}</Text>
		</View>
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1,
	},
	tips:{
		fontSize:29
	},
	input:{
		height:20,
		borderWidth:1
	},

})