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
            <FavoriteTab  tabLabel='最热' flag={FLAG_STORAGE.flag_popular} {...this.props}/>
            <FavoriteTab tabLabel='趋势' flag={FLAG_STORAGE.flag_trending} {...this.props}/>
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



    loadData() {
        this.setState({
            isLoading: true
        })
        this.favoriteDao.getAllItems()
            .then(items=>{
                var resultData=[];
                for(let i = 0; i<items.length;i++){
                    resultData.push(new ProjectModel(items[i],true));
                }
                this.updateState({
                    isLoading:false,
                    dataSource:this.getDataSource(resultData)
                })
            })
            .catch(e=>{
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
        if(isFavorite){
            favoriteDao.saveFavoriteItem(item.id.toString(),JSON.stringify(item));
        }else{
            favoriteDao.removeFavoriteItem(item.id.toString())
        }
    }

    renderRow(projectModel) {
        let CellComponent = this.props.flag===FLAG_STORAGE.flag_popular?RepositoryCell:TrendingCell
        return <CellComponent
            key={this.props.flag===FLAG_STORAGE.flag_popular?ProjectModel.item.id:ProjectModel.item.fullName}
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