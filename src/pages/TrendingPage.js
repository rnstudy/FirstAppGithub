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
    TouchableOpacity,
    TouchableHighlight,
    DeviceEventEmitter
} from 'react-native';

import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import NavigationBar from './../component/NavigationBar'
import DataRepository, {FLAG_STORAGE} from './../expand/dao/DataRepository'
import TrendingCell from './../component/TrendingCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import RepositoryDetail from './RepositoryDetail'
import FavoriteDao from '../expand/dao/FavoriteDao'
import Utils from '../util/Utils'
import ActionUtil from '../util/ActionUtil'

var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
var dataRepository = new DataRepository(FLAG_STORAGE.flag_trending)
import ProjectModel from '../model/ProjectModel'

const API_URL = 'https://github.com/trending/'

import TimeSpan from '../model/TimeSpan'
import Popover from '../component/Popover'
import ModalDropdown from 'react-native-modal-dropdown';


var timeSpanTextArray = [
    new TimeSpan('今天', 'since=daily'),
    new TimeSpan('本周', 'since=weekly'),
    new TimeSpan('本月', 'since=monthly')
];

export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.state = {
            languages: [],
            isVisible: false,
            buttonRect: {},
            timeSpan: timeSpanTextArray[0],
        }
    }

    componentDidMount() {
        this.load()
    }

    onSelectTitle(index, value) {
        //DeviceEventEmitter.emit('showToast', '选择是：'+value.showText +'值是:'+value.searchText);
        this.setState({
            timeSpan: value
        })
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

    //加载按钮
    _dropdown_2_renderButtonText(rowData) {
        const {showText, searchText} = rowData;
        return `${showText}`;
    }

    //加载下拉框内容
    _dropdown_2_renderRow(rowData, rowID, highlighted) {
        let evenRow = rowID % 2;
        return (
            <TouchableHighlight underlayColor='#rgba(0,0,0,.5)'>
                <View style={[styles.dropdown_2_row, {backgroundColor: evenRow ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,.5)'}]}>
                    <Text style={[styles.dropdown_2_row_text, highlighted && {color: '#fff'}]}>
                        {`${rowData.showText}`}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    renderModelTitleView() {
        return <View style={{backgroundColor: '#2196f3'}}>
            <ModalDropdown ref="dropdown_2"
                           style={styles.dropdown_2}
                           textStyle={styles.dropdown_2_text}
                           dropdownStyle={styles.dropdown_2_dropdown}
                           options={timeSpanTextArray}
                           renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                           defaultValue="趋势"
                           renderRow={this._dropdown_2_renderRow.bind(this)}
                           onSelect={(index, value) => this.onSelectTitle(index, value)}
            />
            <TouchableOpacity onPress={() => {
                this.refs.dropdown_2.select(0);
            }}>
                <Text style={styles.textButton}>
                    select Rex
                </Text>
            </TouchableOpacity>
        </View>
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
                return lan.checked ?
                    <TrendingTab key={i} tabLabel={lan.name}
                                 timeSpan={this.state.timeSpan} {...this.props}>{lan.name}</TrendingTab> : null
            })}
        </ScrollableTabView> : null;

        return <View style={styles.container}>
            <NavigationBar
                titleView={this.renderModelTitleView()}
                style={{backgroundColor: '#2196f3'}}
                statusBar={{
                    backgroundColor: '#2196f3',
                }}
            />
            {content}
        </View>
    }
}

class TrendingTab extends Component {
    constructor(props) {
        super(props)
        this.isFavoriteChange = false;
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: [],

        }
    }

    componentDidMount() {
        this.loadData(this.props.timeSpan, true)
        this.listener = DeviceEventEmitter.addListener('favoriteChange_trending', () => {
            this.isFavoriteChange = true;
        })
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.timeSpan !== this.props.timeSpan) {
           // console.log(nextProps.timeSpan);
            this.loadData(nextProps.timeSpan)
        } else if (this.isFavoriteChange) {
            this.isFavoriteChange = false;
            this.loadData(this.props.timeSpan, true);
          //  this.getFavoriteKeys();
        }
    }

    onRefresh() {
        this.loadData(this.props.timeSpan, true);
    }


    /**
     * 更新project Item 收藏状态
     */
    flushFavoriteState(items) {
        console.log('items length' + items.length);
        let projectModels = [];
        for (let i = 0; i < items.length; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)));
        }
        console.log('projectModels')
        console.log(projectModels)
        this.updateState({
            isLoading: false,
            dataSource: this.getDataSource(projectModels),
        })
    }

    getDataSource(data) {
        return this.state.dataSource.cloneWithRows(data);
    }

    getFavoriteKeys() {
        console.log('trending items');
        let items = this.items ? this.items : []
        console.log(items);
        favoriteDao.getFavoriteKeys()
            .then(keys => {
                if (keys) {
                    this.updateState({
                        favoriteKeys: keys
                    })
                }
                this.flushFavoriteState(items);
            })
            .catch(e => {
                console.log('error');
                console.log(e);
                this.flushFavoriteState(items);
            })
    }

    loadData(timeSpan, isRefresh) {
        this.updateState({
            isLoading: true
        })
        let url = this.getFetchUrl(timeSpan, this.props.tabLabel)
        //console.log(url);
        dataRepository.fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();
                if (!this.items || isRefresh && result && result.update_date && !Utils.checkData(result.update_date)) {
                    DeviceEventEmitter.emit('showToast', '数据过时')
                    return dataRepository.fetchNetRepository(url);
                } else {
                    DeviceEventEmitter.emit('showToast', '显示缓存数据')
                }
            })
            .then(items => {
                this.items = items;
                if (!items || items.length === 0) return;
                this.getFavoriteKeys();
                DeviceEventEmitter.emit('showToast', '显示网络数据')
            })
            .catch(error => {
                this.updateState({
                    result: JSON.stringify(result)
                })
            })
    }

    updateState(dic) {
        if (!this) return;
        this.setState(dic)
    }

    getFetchUrl(timeSpan, category) {
        return API_URL + category + timeSpan.searchText;
    }

    renderRow(projectModel) {
        console.log('trending page projectModel')
        console.log(projectModel)
        return <TrendingCell
            key={projectModel.item.fullName}
            onSelect={()=>ActionUtil.onSelectRepository({
                favoriteDao: favoriteDao,
                projectModel: projectModel,
                title: projectModel.item.full_name ? projectModel.item.full_name : projectModel.item.fullName,
                flag: FLAG_STORAGE.flag_trending,
                ...this.props
            })}
            projectModel={projectModel}
            onFavorite={(item, isFavorite) => ActionUtil.onFavorite(favoriteDao,item, isFavorite,FLAG_STORAGE.flag_trending)}
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
                        onRefresh={() => this.onRefresh()}
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
    dropdown_2: {
        alignSelf: 'flex-end',
        width: 150,
        marginTop: 10,
        right: 8,
        borderWidth: 0,
        borderRadius: 3,
        backgroundColor: '#2196f3',
    },
    dropdown_2_text: {
        marginVertical: 10,
        marginHorizontal: 6,
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    dropdown_2_dropdown: {
        width: 150,
        height: 140,
        borderRadius: 3,
        backgroundColor: 'rgba(0,0,0,.5)'
    },
    dropdown_2_row: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
    },
    dropdown_2_image: {
        marginLeft: 4,
        width: 30,
        height: 30,
    },
    dropdown_2_row_text: {
        marginHorizontal: 4,
        fontSize: 16,
        color: '#fff',
        textAlignVertical: 'center',
    },
    dropdown_2_separator: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,.5)',
    },
    textButton: {
        fontSize: 16,
        color: 'white'
    }

})