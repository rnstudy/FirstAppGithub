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
import DataRepository, {FLAG_STORAGE} from './../expand/dao/DataRepository'
import RepositoryCell from './../component/RepositoryCell'
import RepositoryDetail from './RepositoryDetail'
import TrendingCell from '../component/TrendingCell'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from '../expand/dao/FavoriteDao'
import Utils from '../util/Utils'
import ArrayUtil from "../util/ArrayUtil";
import ActionUtil from "../util/ActionUtil";
import BaseComponent from "./BaseComponent";

export default class FavoritePage extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme
        }
    }

    componentDidMount() {
        super.componentDidMount()
    }


    render() {
        var statusBar = {
            backgroundColor: this.state.theme.styles.navBar.backgroundColor
        }
        let content = <ScrollableTabView
            tabBarBackgroundColor={this.state.theme.themeColor}
            tabBarInactiveTextColor="mintcream"
            tabBarActiveTextColor="#fff"
            tabBarUnderlineStyle={{backgroundColor: '#efefef', height: 2}}
            renderTabBar={() => <ScrollableTabBar/>}>
            <FavoriteTab key='0' tabLabel='最热' flag={FLAG_STORAGE.flag_popular} {...this.props}/>
            <FavoriteTab key='1' tabLabel='趋势' flag={FLAG_STORAGE.flag_trending} {...this.props}/>
        </ScrollableTabView>;
        return <View style={styles.container}>
            <NavigationBar
                title={'收藏'}
                style={this.state.theme.styles.navBar}
                statusBar={statusBar}
            />
            {content}
        </View>
    }
}

class FavoriteTab extends BaseComponent {

    constructor(props) {
        super(props)
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.unFavoirteItems = [];
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: [],
            theme: this.props.theme
        }
    }

    componentDidMount() {
        super.componentDidMount()
        this.loadData(true)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.theme !== this.state.theme) {
            this.updateState({
                theme: nextProps.theme
            })
        }
        this.loadData(false)
    }

    updateState(dic) {
        if (!this) return;
        this.setState(dic);
    }

    getDataSource(data) {
        return this.state.dataSource.cloneWithRows(data);
    }

    loadData(isShowLoading) {
        if (isShowLoading) {
            this.setState({
                isLoading: true
            })
        }
        this.favoriteDao.getAllItems()
            .then(items => {
                var resultData = [];
                for (let i = 0; i < items.length; i++) {
                    resultData.push(new ProjectModel(items[i], true));
                }
                this.updateState({
                    isLoading: false,
                    dataSource: this.getDataSource(resultData)
                })
            })
            .catch(e => {
                console.log('favi error!!!')
                console.log(e);
                this.updateState({
                    isLoading: false
                })
            })

    }

    onSelect(projectModel) {
        let favoriteDao = this.favoriteDao;
        let title = projectModel.item.full_name ? projectModel.item.full_name : projectModel.item.fullName
        this.props.navigator.push({
            component: RepositoryDetail,
            params: {
                favoriteDao: favoriteDao,
                projectModel: projectModel,
                title: title,
                flag: FLAG_STORAGE.flag_popular,
                ...this.props
            }
        })
    }

    /**
     * favoiteIcon的单击回调函数
     * @param item
     * @param isFavorite
     */
    onFavorite(item, isFavorite) {
        ArrayUtil.updateArray(this.unFavoirteItems, item);
        if (this.unFavoirteItems.length > 0) {
            if (this.props.flag === FLAG_STORAGE.flag_popular) {
                DeviceEventEmitter.emit('favoriteChange_popular');
            }
            if (this.props.flag === FLAG_STORAGE.flag_trending) {
                DeviceEventEmitter.emit('favoriteChange_trending');
            }
        }
    }

    renderRow(projectModel) {
        let CellComponent = this.props.flag === FLAG_STORAGE.flag_popular ? RepositoryCell : TrendingCell
        return <CellComponent
            key={this.props.flag === FLAG_STORAGE.flag_popular ? projectModel.item.id : projectModel.item.fullName}
            onSelect={() => this.onSelect(projectModel)}
            projectModel={projectModel}
            onFavorite={(item, isFavorite) => ActionUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag)}
            theme={this.props.theme}
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
                        colors={[this.props.theme.themeColor]}
                        tintColor={this.props.theme.themeColor}
                        title={'Loading...'}
                        titleColor={this.props.theme.themeColor}
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