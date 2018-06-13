import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    View
} from 'react-native';

import NavigationBar from './../component/NavigationBar'
import DataRepository,{FLAG_STORAGE} from './../expand/dao/DataRepository'
const URL='https://github.com/trending/'

export default class TrendingPage extends Component{

    constructor(props){
        super(props);
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
        this.state = {
            result:'',
        }

    }

    onClick(){
        this.loadData(URL+this.text);
    }

    loadData(url){
        this.dataRepository.fetchRepository(url)
            .then(result=>{
                this.setState({
                    result:JSON.stringify(result),
                })
            })
            .catch(error=>{
                this.setState({
                    result:JSON.stringify(error),
                })
            })
    }


    render(){
        return <View>
            <NavigationBar
                title={'TrendingPage'}
            />
            <TextInput
                style={{height:30,borderWidth:1}}
                onChangeText={(text)=>{
                    this.text = text;
                }}
            />
            <View style={{flexDirection:'row'}}>
                <Text style={styles.tips}
                      onPress={()=>this.onClick()}
                >加载数据</Text>
                <Text style={{flex:1}}>{this.state.result}</Text>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
  tips:{
      fontSize:20
  }
});