import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity
} from 'react-native';

import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import NavigationBar from './../component/NavigationBar'
import DataRepository, {FLAG_STORAGE} from './../expand/dao/DataRepository'
import RepositoryCell from './../component/RepositoryCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import ProjectModel from '../model/ProjectModel'
import FavoriteDao from '../expand/dao/FavoriteDao'
import Utils from '../util/Utils'
import ActionUtil from "../util/ActionUtil";
import SearchPage from './SearchPage'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
            languages: [],
            theme:this.props.theme
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

    renderRightButton() {
        return <View>
            <TouchableOpacity

                onPress={() => {
                    this.props.navigator.push({
                        component: SearchPage,
                        params: {
                            ...this.props
                        }
                    })
                }
                }
            >
                <View style={{padding: 5, marginRight: 8, right: 0, marginLeft: 8, top: 8}}>
                    <Image
                        style={[{width: 24, height: 24}, {tintColor: 'white'}]}
                        source={require('../../res/img/Search.png')}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }

    render() {
        var statusBar={
            backgroundColor: this.state.theme.styles.navBar.backgroundColor
        }
        let content = this.state.languages.length > 0 ? <ScrollableTabView
            tabBarBackgroundColor={this.state.theme.themeColor}
            tabBarInactiveTextColor="mintcream"
            tabBarActiveTextColor="#fff"
            tabBarUnderlineStyle={{backgroundColor: '#efefef', height: 2}}
            renderTabBar={() => <ScrollableTabBar/>}>
            {this.state.languages.map((result, i, arr) => {
                let lan = arr[i];
                return lan.checked ?
                    <PopularTab key={i} tabLabel={lan.name} {...this.props}>{lan.name}</PopularTab> : null
            })}
        </ScrollableTabView> : null;
        return <View style={styles.container}>
            <NavigationBar
                title={'最热'}
                style={this.state.theme.styles.navBar}
                statusBar={statusBar}
                rightButton={this.renderRightButton()}
            />
            {content}
        </View>
    }
}

class PopularTab extends Component {
    constructor(props) {
        super(props)
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular)
        this.isFavoriteChange = false;
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: [],
            theme:this.props.theme
        }
    }

    componentDidMount() {
        this.loadData()
        this.listener = DeviceEventEmitter.addListener('favoriteChange_popular', () => {
            this.isFavoriteChange = true;
        })
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.isFavoriteChange) {
            this.isFavoriteChange = false;
            this.getFavoriteKeys();
        }
    }

    updateState(dic) {
        if (!this) return;
        this.setState(dic);
    }

    /**
     * 更新project Item 收藏状态
     */
    flushFavoriteState() {
        let projectModels = [];
        let items = this.items;
        for (let i = 0; i < items.length; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)));
        }
        this.updateState({
            isLoading: false,
            dataSource: this.getDataSource(projectModels),
        })
    }

    getDataSource(data) {
        return this.state.dataSource.cloneWithRows(data);
    }

    getFavoriteKeys() {
        favoriteDao.getFavoriteKeys()
            .then(keys => {
                if (keys) {
                    this.updateState({
                        favoriteKeys: keys
                    })
                }
                this.flushFavoriteState();
            })
            .catch(e => {
                this.flushFavoriteState();
            })
    }

    loadData(isRefresh) {
        this.setState({
            isLoading: true
        })
        let url = URL + this.props.tabLabel + QUERY_STR;
        this.dataRepository.fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();
                if (!this.items || isRefresh && result && result.update_date && !Utils.checkData(result.update_date)) {
                    // DeviceEventEmitter.emit('showToast','数据过时')
                    return this.dataRepository.fetchNetRepository(url);
                } else {
                    //  DeviceEventEmitter.emit('showToast','显示缓存数据')
                }
            })
            .then(items => {
                if (!items || items.length === 0) return;
                this.items = items;
                this.getFavoriteKeys();
                // DeviceEventEmitter.emit('showToast','显示网络数据')
            })
            .catch(error => {
                console.log(error);
                this.updateState({
                    isLoading: false
                })
            })
    }

    renderRow(projectModel) {
        return <RepositoryCell
            key={projectModel.item.id.toString()}
            onSelect={() => ActionUtil.onSelectRepository({
                favoriteDao: favoriteDao,
                projectModel: projectModel,
                title: projectModel.item.full_name ? projectModel.item.full_name : projectModel.item.fullName,
                flag: FLAG_STORAGE.flag_popular,
                ...this.props
            })}
            projectModel={projectModel}
            theme={this.props.theme}
            onFavorite={(item, isFavorite) => ActionUtil.onFavorite(favoriteDao, item, isFavorite,FLAG_STORAGE.flag_popular)}

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