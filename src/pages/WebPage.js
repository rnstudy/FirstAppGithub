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
import NavigationBar from './../component/NavigationBar'
const URL = 'https://wurh.github.io/'
import GlobalStyles from '../../res/styles/GlobalStyles'
import ViewUtil from '../util/ViewUtil'
import {ACTION_HOME} from "./HomePage";

export default class WebPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url:this.props.url,
            title:this.props.title,
            canGoBack:false
        };
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

    onBackPress(){
        if(this.state.canGoBack){
            this.webView.goBack()
        }else{
            DeviceEventEmitter.emit('ACTION_HOME',ACTION_HOME.A_SHOW_TOAST,{text:'到顶了'});
            this.props.navigator.pop();
        }
    }

    onNavigationStateChange(e){
        this.setState({
            canGoBack:e.canGoBack,
            title:this.state.title
        })
    }

    render(){
        return (
            <View style={GlobalStyles.root_contianer}>
                <NavigationBar
                    title={'WebView使用'}
                    style={{
                        backgroundColor:'#2196f3'
                    }}
                    leftButton={ViewUtil.getLeftButton(()=>this.onBackPress())}
                />
                <WebView
                    ref={webView=>this.webView = webView }
                    source={{uri:this.state.url}}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    nativeConfig={{props:{
                            backgroundColor:'#fff',
                            flex:1
                        }}}
                />
            </View>
        )
    }
}
