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
const URL = 'http://www.imooc.com'

export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        this.url= this.props.item.html_url;
        let title = this.props.item.full_name;
        this.state = {
            url:this.url,
            title:title,
            canGoBack:false
        };
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
            canGoBack:e.canGoBack,
            title:e.title
        })
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