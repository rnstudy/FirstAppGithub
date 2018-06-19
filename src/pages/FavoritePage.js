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
import RepositoryDetail from'./RepositoryDetail'
import TrendingCell from '../component/TrendingCell'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from'../expand/dao/FavoriteDao'
import Utils from'../util/Utils'
import ArrayUtil from "../util/ArrayUtil";

export default class FavoritePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }


    render() {
        let content = <ScrollableTabView
            tabBarBackgroundColor="#2196f3"
            tabBarInactiveTextColor="mintcream"
            tabBarActiveTextColor="#fff"
            tabBarUnderlineStyle={{backgroundColor: '#efefef', height: 2}}
            renderTabBar={() => <ScrollableTabBar/>}>
            <FavoriteTab key='0'  tabLabel='最热' flag={FLAG_STORAGE.flag_popular} {...this.props}/>
            <FavoriteTab key='1'  tabLabel='趋势' flag={FLAG_STORAGE.flag_trending} {...this.props}/>
        </ScrollableTabView>;
        return <View style={styles.container}>
            <NavigationBar
                title={'收藏'}
                style={{backgroundColor: '#2196f3'}}
                statusBar={{
                    backgroundColor: '#2196f3'
                }}
            />
            {content}
        </View>
    }
}

class FavoriteTab extends Component {

    constructor(props) {
        super(props)
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.unFavoirteItems=[];
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys:[]
        }
    }

    componentDidMount() {
        this.loadData(true)
    }

    componentWillReceiveProps(nextProps){
        this.loadData(false)
    }

    updateState(dic){
        if(!this)return;
        this.setState(dic);
    }

    getDataSource(data){
        return this.state.dataSource.cloneWithRows(data);
    }

    loadData(isShowLoading) {
        if(isShowLoading){
            this.setState({
                isLoading: true
            })
        }
        this.favoriteDao.getAllItems()
            .then(items=>{
                console.log('favi items')
                console.log(items)
                var resultData=[];
                for(let i = 0; i<items.length;i++){
                    resultData.push(new ProjectModel(items[i],true));
                }
                console.log('resultData')
                console.log(resultData)
                this.updateState({
                    isLoading:false,
                    dataSource:this.getDataSource(resultData)
                })
            })
            .catch(e=>{
                console.log('favi error!!!')
                console.log(e);
                this.updateState({
                    isLoading:false
                })
            })

    }

    onSelect(projectModel){
        let favoriteDao = this.favoriteDao;
        let title = projectModel.item.full_name ? projectModel.item.full_name : projectModel.item.fullName
        this.props.navigator.push({
            component:RepositoryDetail,
            params:{
                favoriteDao:favoriteDao,
                projectModel:projectModel,
                title:title,
                flag:FLAG_STORAGE.flag_popular,
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
        console.log('favi onFavi!')
        console.log(item)
        let key = this.props.flag===FLAG_STORAGE.flag_popular?item.id.toString():item.fullName;
        if(isFavorite){
            this.favoriteDao.saveFavoriteItem(key,JSON.stringify(item));
        }else{
            this.favoriteDao.removeFavoriteItem(key)
        }
        ArrayUtil.updateArray(this.unFavoirteItems,item);
        if(this.unFavoirteItems.length>0){
            if(this.props.flag === FLAG_STORAGE.flag_popular){
                DeviceEventEmitter.emit('favoriteChange_popular');
            }
            if(this.props.flag === FLAG_STORAGE.flag_trending){
                DeviceEventEmitter.emit('favoriteChange_trending');
            }
        }
    }

    renderRow(projectModel) {
        console.log('favi projectModel')
        console.log(projectModel)
        let CellComponent = this.props.flag===FLAG_STORAGE.flag_popular?RepositoryCell:TrendingCell
        return <CellComponent
            key={this.props.flag===FLAG_STORAGE.flag_popular?projectModel.item.id:projectModel.item.fullName}
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
                enableEmptySections={true}
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