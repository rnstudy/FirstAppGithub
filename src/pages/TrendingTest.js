import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    TextInput,
    Text,
    View
} from 'react-native';

import NavigationBar from './../component/NavigationBar'
import GitHubTrending from 'GitHubTrending'
const URL='https://github.com/trending/'

export default class TrendingTest extends Component{

    constructor(props){
        super(props);
        this.trending = new GitHubTrending();
        this.state = {
            result:'',
        }

    }

    onLoad(){
        let url = URL+this.text;
        this.trending.fetchTrending(url)
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
                title={'GithubTrending的使用'}
            />
            <TextInput
                style={{height:30,borderWidth:1}}
                onChangeText={(text)=>{
                    this.text = text;
                }}
            />
            <View style={{flexDirection:'row'}}>
                <Text style={styles.tips}
                      onPress={()=>this.onLoad()}
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