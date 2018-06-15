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
    DeviceEventEmitter
} from 'react-native';

import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import NavigationBar from './../component/NavigationBar'
import DataRepository,{FLAG_STORAGE} from './../expand/dao/DataRepository'
import RepositoryCell from './../component/RepositoryCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import RepositoryDetail from'./RepositoryDetail'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from'../expand/dao/FavoriteDao'
import Utils from'../util/Utils'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
            languages: []
        }
    }

    componentDidMount() {
        this.load()
    }

    load() {
        this.languageDao.fetch()
            .then(result => {
                this.setState({
                    languages: result
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        let content = this.state.languages.length > 0 ? <ScrollableTabView
            tabBarBackgroundColor="#2196f3"
            tabBarInactiveTextColor="mintcream"
            tabBarActiveTextColor="#fff"
            tabBarUnderlineStyle={{backgroundColor: '#efefef', height: 2}}
            renderTabBar={() => <ScrollableTabBar/>}>
            {this.state.languages.map((result, i, arr) => {
                let lan = arr[i];
                return lan.checked ? <PopularTab key={i} tabLabel={lan.name} {...this.props}>{lan.name}</PopularTab> : null
            })}
        </ScrollableTabView> : null;
        return <View style={styles.container}>
            <NavigationBar
                title={'最热'}
                style={{backgroundColor: '#2196f3'}}
                statusBar={{
                    backgroundColor: '#2196f3'
                }}
            />
            {content}
        </View>
    }
}

class PopularTab extends Component {
    constructor(props) {
        super(props)
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular)
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys:[]
        }
    }

    componentDidMount() {
        this.loadData()
    }

    updateState(dic){
        if(!this)return;
        this.setState(dic);
    }

    /**
     * 更新project Item 收藏状态
     */
    flushFavoriteState(){
        let projectModels = [];
        let items = this.items;
        for(let i = 0; i <items.length; i++){
            projectModels.push(new ProjectModel(items[i],Utils.checkFavorite(items[i],this.state.favoriteKeys)));
        }
       this.updateState({
           isLoading:false,
           dataSource:this.getDataSource(projectModels),
       })
    }

    getDataSource(data){
        return this.state.dataSource.cloneWithRows(data);
    }

    getFavoriteKeys(){
        favoriteDao.getFavoriteKeys()
            .then(keys=>{
                if(keys){
                    this.updateState({
                        favoriteKeys:keys
                    })
                }
                this.flushFavoriteState();
            })
            .catch(e=>{
                this.flushFavoriteState();
            })
    }

    loadData() {
        this.setState({
            isLoading: true
        })
        let url = URL + this.props.tabLabel + QUERY_STR;
        this.dataRepository.fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();
                if (result && result.update_date && !this.dataRepository.checkData(result.update_date)){
                   // DeviceEventEmitter.emit('showToast','数据过时')
                    return this.dataRepository.fetchNetRepository(url);
                }else{
                  //  DeviceEventEmitter.emit('showToast','显示缓存数据')
                }
                    })
            .then(items=>{
                if(!items || items.length ===0) return;
                this.items=items;
                this.getFavoriteKeys();
               // DeviceEventEmitter.emit('showToast','显示网络数据')
            })
            .catch(error => {
                console.log(error);
                this.updateState({
                    isLoading:false
                })
            })
    }

    onSelect(projectModel){
        let title = projectModel.item.full_name ? projectModel.item.full_name : projectModel.item.fullName
        this.props.navigator.push({
            component:RepositoryDetail,
            params:{
                projectModel:projectModel,
                title:title,
                ...this.props
            }
        })
    }

    /**
     * favoiteIcon的单击回调函数
     * @param item
     * @param isFavorite
     */
    onFavorite(item,isFavorite){
        if(isFavorite){
            favoriteDao.saveFavoriteItem(item.id.toString(),JSON.stringify(item));
        }else{
            favoriteDao.removeFavoriteItem(item.id.toString())
        }
    }

    renderRow(projectModel) {
        return <RepositoryCell
            key={projectModel.item.id}
            onSelect={()=>this.onSelect(projectModel)}
            projectModel={projectModel}
            onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}

        />
    }

    render() {
        return <View style={{flex: 1}}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data) => this.renderRow(data)}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={() => this.loadData()}
                        colors={['#2196f3']}
                        tintColor={'#2196f3'}
                        title={'Loading...'}
                        titleColor={'#2196f3'}
                    />
                }
            />
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

})