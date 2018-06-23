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
} from 'react-native';

import NavigationBar from './../component/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import GlobalStyles from '../../res/styles/GlobalStyles'
import FavoriteDao from '../expand/dao/FavoriteDao'
import {FLAG_STORAGE} from '../expand/dao/DataRepository'
import Utils from "../util/Utils";
import RepositoryCell from './../component/RepositoryCell'
import ProjectModel from "../model/ProjectModel";
import ActionUtil from "../util/ActionUtil";
const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'

export default class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.favoriteDao= new FavoriteDao(FLAG_STORAGE.flag_popular)
        this.favoriteKeys=[];
        this.state = {
            rightButtonText: '搜索',
            isLoading: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
            })

        }
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
        fetch(this.genFetchUrl(this.inputKey))
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
                console.log(' this.items ')
                console.log( this.items )
                this.getFavoriteKeys();
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
        let listView = <ListView
            dataSource={this.state.dataSource}
            renderRow={(e)=>this.renderRow(e)}
        />
        return <View style={GlobalStyles.root_contianer}>
            {statusBar}
            {this.renderNavBar()}
            {listView}
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
    }

})