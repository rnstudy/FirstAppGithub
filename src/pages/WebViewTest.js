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
import {ACTION_HOME} from "./HomePage";
const URL = 'http://www.imooc.com'

export default class WebViewTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url:URL,
            title:'',
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

    go(){
        this.setState({
            url:this.text
        })
    }

    goBack(){
        if(this.state.canGoBack){
                this.webView.goBack()
        }else{
            DeviceEventEmitter.emit('ACTION_HOME',ACTION_HOME.A_SHOW_TOAST,{text:'到顶了'});
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
                    title={'WebView使用'}
                    style={{
                        backgroundColor:'#2196f3'
                    }}
                />
                <View style={styles.row}>
                    <Text style={styles.tips}
                        onPress={()=>{
                            this.goBack();
                        }}
                    >返回</Text>
                    <TextInput
                        style={styles.input}
                        defaultValue={URL}
                        onChangeText={text=>this.text=text}

                    />
                    <Text style={styles.tips}
                          onPress={()=>{
                              this.go();
                          }}
                    >前往</Text>
                </View>
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
        borderWidth:1,
        margin:2
    }
})