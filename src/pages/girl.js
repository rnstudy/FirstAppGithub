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

export default class Girl extends Component {
	constructor(props) {
	  super(props);
	  this.state = {};
	}
  renderButton(image){
    return    <TouchableOpacity
                onPress ={()=>{
                  this.props.navigator.pop();
                }}
              >
              <Image style={styles.btn} source={image}></Image>
            </TouchableOpacity>
  }
	 render(){
   		return (
   			<View style={styles.container}>
          <NavigationBar 
          title={'Girl'}
          style={{
              backgroundColor:'#FFC1C1'
            }}
          leftButton={
            this.renderButton(require('./../../res/img/back.png'))
          }
          rightButton={
            this.renderButton(require('./../../res/img/favi.png'))
          }
          ></NavigationBar>
          <Text style={styles.text}>I am Girl</Text>
          <Text style={styles.text}>我收到了男孩送的:{this.props.word}</Text>
          <Text style={styles.text} 
            onPress={()=>{
              this.props.onCallBack('一盒巧克力')
              this.props.navigator.pop()
            }}
          >回赠巧克力</Text> 
        </View>
   		)
   }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white',
  },
  text:{
    fontSize:22,
  },
  btn:{
    width:22,
    height:22,
    margin:10,
  }
})