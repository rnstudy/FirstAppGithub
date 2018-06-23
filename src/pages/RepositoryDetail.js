import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    View,
    TextInput,
    WebView,
    DeviceEventEmitter
} from 'react-native';
import ViewUtil from '../util/ViewUtil'
import NavigationBar from './../component/NavigationBar'
import FavoriteDao from'../expand/dao/FavoriteDao'

const TRENDING_URL = 'http://github.com/'
export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        this.url= this.props.projectModel.item.html_url ? this.props.projectModel.item.html_url : TRENDING_URL+this.props.projectModel.item.fullName;
        let title = this.props.title;
        this.favoriteDao = this.props.favoriteDao
        this.state = {
            url:this.url,
            title:title,
            canGoBack:false,
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../../res/img/favi_select.png') : require('../../res/img/favi.png')
        };
        console.log(this.state)
    }
    go(){
        this.setState({
            url:this.text
        })
    }

    onBack(){
        if(this.state.canGoBack){
            this.webView.goBack()
        }else{
            this.props.navigator.pop();
        }
    }

    onNavigationStateChange(e){
        this.setState({
            canGoBack:e.canGoBack
        })
    }

    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/img/favi_select.png') : require('../../res/img/favi.png')
        })
    }

    onRightButtonClick(){
        var projectModel = this.props.projectModel;
        this.setFavoriteState(projectModel.isFavorite =! projectModel.isFavorite)
        let key=projectModel.item.fullName?projectModel.item.fullName:projectModel.item.id.toString()
        if(projectModel.isFavorite){
            this.favoriteDao.saveFavoriteItem(key,JSON.stringify(projectModel.item));
        }else{
            this.favoriteDao.removeFavoriteItem(key)
        }
    }

    renderRightButton(){
        return <TouchableOpacity
                onPress={()=>this.onRightButtonClick()}
            >
            <Image
                style={[{
                    width:20,
                    height:20,
                    marginRight:5,
                },{
                    tintColor:'#fff'
                }]}
                source={this.state.favoriteIcon}
            />
        </TouchableOpacity>
    }

    render(){
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.state.title}
                    style={{
                        backgroundColor:'#2196f3'
                    }}
                    leftButton={ViewUtil.getLeftButton(()=>this.onBack())}
                    rightButton={this.renderRightButton()}
                />
                <WebView
                    ref={webView=>this.webView = webView }
                    source={{uri:this.state.url}}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    startInLoadingState={true}

                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    text:{
        fontSize:22,
    },

    row:{
        flexDirection:'row',
        alignItems:'center',
        margin:10
    },
    tips:{
        fontSize:20
    },
    input:{
        height:40,
        flex:1,
        margin:2
    }
})