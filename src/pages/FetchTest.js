
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View
} from 'react-native';
import NavigationBar from './../component/NavigationBar'

export default class FetchTest extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
	  	result:''
	  };
	}

	onLoad(url){
		fetch(url)
		.then(response=>response.json())
		.then(result=>{	
			this.setState({
				result:JSON.stringify(result)
			})
		})
		.catch(error=>{
			this.setState({
				result:JSON.stringify(error)
			})
		})
	}

	onSubmit(url,data){
		fetch(url,{
			method:'POST',
			header:{
				'Accept':'application/json',
				'Content-Type':'application/json',
			},
			body:JSON.stringify(data)
		})
		.then(response=>response.json())
		.then(result=>{	
			this.setState({
				result:JSON.stringify(result)
			})
		})
		.catch(error=>{
			this.setState({
				result:JSON.stringify(error)
			})
		})
	}

	 render(){
   		return (
   		<View style={styles.container}>
	          <NavigationBar 
	          title={'Fetch的使用'}
	          ></NavigationBar>	
	          <Text
	          	onPress={()=> this.onLoad('http://rap2api.taobao.org/app/mock/16670//api/getUserData')}
	          >获取数据</Text>
	          <Text>获取返回结果：{this.state.result}</Text>
	          <Text
	          	onPress={()=> this.onSubmit('http://rap2api.taobao.org/app/mock/16670//api/login',{
	          		userName:'小明',password:'123456'
	          	})}
	          >提交数据</Text>
	          <Text>提交返回结果：{this.state.result}</Text>
        </View>
   		)
   }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white',
  }
})