import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';

export default class RepositoryCell extends Component{

    render(){
        return<TouchableOpacity
            style={styles.container}
        >
        <View style={styles.cell_container}>
            <Text style={styles.title}>{this.props.data.full_name}</Text>
            <Text style={styles.description}>{this.props.data.description}</Text>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text>作者:</Text>
                    <Image style={{height:22,width:22}} source={{uri:this.props.data.owner.avatar_url}}/>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text>Stars:</Text>
                    <Text>{this.props.data.stargazers_count}</Text>
                </View>
                <Image stye={{width:22,height:22}} source={require('../../res/img/favi.png')}/>
            </View>
        </View>
        </TouchableOpacity>
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1
    },
    title:{
        fontSize:16,
        marginBottom:2,
        color:'#333'
    },
    description:{
        fontSize:14,
        marginBottom:2,
        color:'#666',
        borderRadius:2
    },
    cell_container:{
        backgroundColor:'#fff',
        padding:10,
        marginLeft:5,
        marginRight:5,
        marginVertical:3,
        borderWidth:.5,
    }
});