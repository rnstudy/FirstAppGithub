import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View,
    ScrollView,
    TouchableHighlight
} from 'react-native';
import NavigationBar from './../component/NavigationBar'
import CustomKeyPage from './CustomKeyPage'
import SortKeyPage from './SortKeyPage'
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import TrendingCell from "../component/TrendingCell";
import {MORE_MENU} from '../component/MoreMenu'
import GlobalStyles from '../../res/styles/GlobalStyles'


export default class MyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    onClick(tab){

    }

    render(){
        var navigationBar = <NavigationBar
            title={'我的'}
            style={{backgroundColor:'#2196f3'}}
        />


        return (
            <View style={styles.container}>
                {navigationBar}
                <ScrollView>
                    <TouchableHighlight
                        onPress={()=>this.onClick(MORE_MENU.About)}
                    >
                        <View style={styles.item}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Image
                                    source={require('../../res/img/person.png')}
                                    style={[{width:40,height:40,marginRight:10},{tintColor:'#2196f3'}]}
                                />
                                <Text>GitHub Popular</Text>
                            </View>
                            <Image
                                source={require('../../res/img/person.png')}
                                style={[{width:22,height:22,marginRight:10},{tintColor:'#2196f3'}]}
                            />
                        </View>
                    </TouchableHighlight>
                    <View style={GlobalStyles.line}/>
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    tips:{
        fontSize:20,
    },
    item:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:10,
        height:60

    }
})