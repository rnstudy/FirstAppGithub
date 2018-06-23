import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View,
    TextInput,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import NavigationBar from './../component/NavigationBar'
import {ACTION_HOME} from "./HomePage";
import ViewUtil from "../util/ViewUtil";
import GlobalStyles from '../../res/styles/GlobalStyles'
import FavoriteDao from '../expand/dao/FavoriteDao'
import {FLAG_STORAGE} from '../expand/dao/DataRepository'
import Utils from "../util/Utils";
import RepositoryCell from './../component/RepositoryCell'
import ProjectModel from "../model/ProjectModel";
import ActionUtil from "../util/ActionUtil";
import makeCancelable from "../util/Cancelable"
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao'

const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'


export default class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.favoriteDao= new FavoriteDao(FLAG_STORAGE.flag_popular)
        this.favoriteKeys=[];
        this.LanguageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.isKeyChange = false;
        this.state = {
            rightButtonText: '搜索',
            isLoading: false,
            showBottomButton:false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            })

        }
    }

    saveKey(){
        let key = this.inputKey;
        if(this.checkKeyIsExist(this.keys,key)){
            DeviceEventEmitter.emit('ACTION_HOME',ACTION_HOME.A_SHOW_TOAST,{text:key+'已经存在'});

        }else{
            key={
                "path":key,
                "name":key,
                "checked":true
            }
            this.keys.unshift(key);
            this.LanguageDao.save(this.keys);
            DeviceEventEmitter.emit('ACTION_HOME',ACTION_HOME.A_SHOW_TOAST,{text:key.name+'保存成功'});
            this.isKeyChange = true;
            this.updateState({
                showBottomButton:false
            })
        }
    }

    /**
     * 获取所有标签
     * @returns {Promise<void>}
     */
   async initKeys(){
        this.keys = await this.LanguageDao.fetch();
    }

    /**
     * j检查Key是否存在与Keys中
     * @param keys
     * @param key
     */
    checkKeyIsExist(keys,key){
       for(let i=0; i<keys.length;i++){
           if(key.toLowerCase()===keys[i].name.toLowerCase()){
               return true
           }
       }
       return false;
    }

    componentDidMount(){
        this.initKeys()
    }

    componentWillUnmount(){
        if(this.isKeyChange){
            DeviceEventEmitter.emit('ACTION_HOME',ACTION_HOME.A_RESTART);
        }
        this.cancelable &&  this.cancelable.cancel();
    }

    getDataSource(data) {
        return this.state.dataSource.cloneWithRows(data);
    }

    genFetchUrl(key) {
        return API_URL + key + QUERY_STR;
    }

    /**
     * 更新project Item 收藏状态
     */
    flushFavoriteState() {
        let projectModels = [];
        let items = this.items;
        console.log('search result');
        console.log(items);
        for (let i = 0; i < items.length; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.favoriteKeys)));
        }
        this.updateState({
            isLoading: false,
            dataSource: this.getDataSource(projectModels),
            rightButtonText:'搜索'
        })
    }

    /**
     * huouq
     */
    getFavoriteKeys() {
        console.log('search getFavoriteKeys')
        this.favoriteDao.getFavoriteKeys()
            .then(keys => {
                console.log(keys);
                this.favoriteKeys = keys || [];
                this.flushFavoriteState();
            })
            .catch(e => {
                this.flushFavoriteState();
            })
    }

    loadData() {
        this.updateState({
            isLoading: true,
        })
        this.cancelable = makeCancelable(fetch(this.genFetchUrl(this.inputKey)))
        console.log(this.cancelable)
        this.cancelable.promise
            .then(response => response.json())
            .then(responseData => {
                if (!this || !responseData || responseData.items && responseData.items.length === 0) {
                    console.log(' 什么都没找到！！！！ ')
                    this.updateState({
                        isLoading: false,
                        rightButtonText: '搜索'
                    })
                    return;
                }
                this.items = responseData.items;
                this.getFavoriteKeys();
                console.log(this.checkKeyIsExist(this.keys,this.inputKey))
                if(!this.checkKeyIsExist(this.keys,this.inputKey)){
                    this.updateState({
                        showBottomButton:true,
                    })
                }else{
                    this.updateState({
                        showBottomButton:false,
                    })
                }
            }).catch(e=>{
                this.updateState({
                    isLoading:false,
                    rightButtonText:'搜索',
                })
            console.log(e);
        })
    }

    onBackPress() {
        this.refs.input.blur();
        this.props.navigator.pop();
    }

    onRightButtonClick() {
        if (this.state.rightButtonText === '搜索') {
            this.updateState({
                rightButtonText: '取消'
            })
            this.loadData();
        } else {
            this.updateState({
                rightButtonText: '搜索',
                isLoading:false
            })
            this.cancelable.cancel();
        }
    }

    updateState(dic) {
        this.setState(dic);
    }

    renderNavBar() {
        let backButton = ViewUtil.getLeftButton(() => this.onBackPress());
        let inputView = <TextInput
            style={styles.textInput}
            ref="input"
            onChangeText={text => this.inputKey = text}
        ></TextInput>

        let rightButton = <TouchableOpacity
            onPress={() => {
                this.refs.input.blur()
                this.onRightButtonClick()
            }}
        >
            <View style={{marginRight: 10}}>
                <Text style={styles.title}>
                    {this.state.rightButtonText}
                </Text>
            </View>
        </TouchableOpacity>
        return <View style={{
            backgroundColor: '#2196f3',
            flexDirection: 'row',
            alignItems: 'center',
            height: (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android,

        }}>
            {backButton}
            {inputView}
            {rightButton}
        </View>
    }

    renderRow(projectModel) {
        return <RepositoryCell
            key={projectModel.item.id.toString()}
            onSelect={()=> ActionUtil.onSelectRepository({
                favoriteDao: this.favoriteDao,
                projectModel: projectModel,
                title: projectModel.item.full_name ? projectModel.item.full_name : projectModel.item.fullName,
                flag: FLAG_STORAGE.flag_popular,
                ...this.props
            })}
            projectModel={projectModel}
            onFavorite={(item, isFavorite) => ActionUtil.onFavorite(this.favoriteDao,item, isFavorite,FLAG_STORAGE.flag_popular)}

        />
    }

    render() {
        let statusBar = null;
        if (Platform.OS === 'ios') {
            statusBar = <View style={[styles.statusBar, {backgroundColor: '#2196f3'}]}/>
        }
        let listView = !this.state.isLoading? <ListView
            dataSource={this.state.dataSource}
            renderRow={(e)=>this.renderRow(e)}
        />:null
        let indicatorView = this.state.isLoading ? <ActivityIndicator
            style={styles.centering}
            size='large'
            animating = {this.state.isLoading}
        />:null

        let resultView =<View style={{flex:1}}>
            {indicatorView}
            {listView}
        </View>

        let bottomButton = this.state.showBottomButton ?
            <TouchableOpacity
                style={[styles.bottomButton,{backgroundColor: '#2196f3'}]}
                onPress={()=>{
                    this.saveKey();
                }}
            >
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.title}>添加标签</Text>
                </View>
            </TouchableOpacity>:null;
        return <View style={GlobalStyles.root_contianer}>
            {statusBar}
            {this.renderNavBar()}
            {resultView}
            {bottomButton}
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tips: {
        fontSize: 29
    },
    input: {
        height: 20,
        borderWidth: 1
    },
    statusBar: {
        height: 20,
    },
    textInput: {
        flex: 1,
        height: (Platform.OS === 'ios') ? 30 : 40,
        borderWidth: (Platform.OS === 'ios') ? 1 : 0,
        borderColor: "white",
        alignSelf: 'center',
        paddingLeft: 5,
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 5,
        opacity: 0.7,
        color: 'white'
    },
    title: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500'
    },
    centering:{
        alignItems:'center',
        justifyContent:'center',
        flex:1,
    },
    bottomButton:{
        alignItems:'center',
        justifyContent:'center',
        opacity:0.9,
        height:40,
        position:'absolute',
        left:10,
        top:GlobalStyles.window_height-45,
        right:10,
        borderRadius:5

    }

})