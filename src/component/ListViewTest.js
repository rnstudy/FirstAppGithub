import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ListView,
  View,
  RefreshControl,
} from 'react-native';
import NavigationBar from './../component/NavigationBar'
import data from './../datas/listData'
import Toast,{DURATION} from 'react-native-easy-toast'
export default class ListViewTest extends Component {
constructor(props){
    super(props);
    const ds =  new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2})
    this.state = {
      dataSource:ds.cloneWithRows(data.result),
      isLoading:true,
    }
    this.onLoad();
  }

  onLoad(){
    let _me = this;
    setTimeout(()=>{
      if(_me){
         _me.setState({
         isLoading:false
      });
      }
    },2000)
  }

   renderFooter(){
      return <Image source={{uri:'http://ougi244fy.bkt.clouddn.com//kr/demo/4.jpg'}}  style={{width: 400, height: 200}} />
   }

   renderSeparator(sectionID, rowID, adjacentRowHighlighted){
    return <View key={rowID} style={styles.line}></View>
   }
   renderRow(item){
      return <View style={styles.row}>
          <TouchableOpacity 
            onPress = {()=>{
              this.toast.show('你单击了:' + item.fullName,DURATION.LENGTH_LONG)
            }}
          >
            <Text style={styles.tips}>{item.fullName}</Text>
            <Text style={styles.tips}>{item.email}</Text>
          </TouchableOpacity>
      </View>
   }
	 render(){
   		return (
   			<View style={styles.container}>
          <NavigationBar title="ListViewTest" />
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(item)=>this.renderRow(item)}
            renderSeparator={(sectionID, rowID, adjacentRowHighlighted)=> this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
            renderFooter={()=> this.renderFooter()}
            refreshControl ={ 
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this.onLoad}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
          />}
           />
           <Toast ref={toast => {this.toast=toast}}/>
        </View>
   		)
   }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white',
  },
  tips:{
    fontSize: 20
  },
  row:{
    height:50
  },
  line:{
     height:1,
     backgroundColor:'black'
  }
})