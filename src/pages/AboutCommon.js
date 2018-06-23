import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
    Platform,

} from 'react-native';

import ViewUtil from '../util/ViewUtil'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import FavoriteDao from '../expand/dao/FavoriteDao'
import {FLAG_STORAGE} from "../expand/dao/DataRepository";
import ProjectModel from "../model/ProjectModel";
import Utils from "../util/Utils";
import RepositoryCell from "../component/RepositoryCell";
import RepositoryDetail from "./RepositoryDetail";
import RepositoryUtils from "../expand/dao/RepositoryUtils";


export var FLAG_ABOUT = {flag_about: 'about', flag_about_me: 'about_me'}

export default class AboutCommon {
    constructor(props, updateState, flag_about,config) {
        this.props = props;
        this.updateState = updateState;
        this.flag_about = flag_about;
        this.config = config;
        this.repositories = [];
        this.favoriteKeys = null;
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_my)
        this.repositoryUtils = new RepositoryUtils(this);
    }
    componentDidMount(){
        if(this.flag_about === FLAG_ABOUT.flag_about){
            this.repositoryUtils.fetchRepository(this.config.info.currentRepoUrl);
        }else{
            var urls = [];
            var items = this.config.items;
            for(var i = 0; i<items.length;i++){
                urls.push(this.config.info.url+items[i]);
            }
            this.repositoryUtils.fetchRepositorys(urls);
        }
    }


    /**
     * 更新项目的用户收藏状态
     * @param repositories
     */
    async updateFavorite(repositories) {
        console.log('1----------1');
        console.log(repositories);
        if (repositories) {
            this.repositories = repositories
        }
        if (!this.repositories) return;
        if (!this.favoriteKeys) {
            this.favoriteKeys = await this.favoriteDao.getFavoriteKeys();
        }
        let projectModels = [];
        let items = this.repositories;
        for (let i = 0; i < this.repositories.length; i++) {
            var data = this.repositories[i];
            data = data.item ? data.item:data;
            projectModels.push({
                isFavorite:Utils.checkFavorite(data,this.favoriteKeys?this.favoriteKeys:[]),
                item:data
            })
        }

        this.updateState({
            projectModels:projectModels
        })
    }

    /**
     * 通知数据发生改变
     * @param items 改变时候的数据
     */
    onNotifyDataChanged(items) {
        this.updateFavorite(items)
    }


    onSelect(projectModel) {
        let title = projectModel.item.full_name ? projectModel.item.full_name : projectModel.item.fullName
        this.props.navigator.push({
            component: RepositoryDetail,
            params: {
                favoriteDao: this.favoriteDao,
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
        if (isFavorite) {
            this.favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
        } else {
            this.favoriteDao.removeFavoriteItem(item.id.toString())
        }
    }

    /**
     * 渲染内容
     * @param projectModels
     */
    renderRepository(projectModels){
        if(!projectModels || projectModels.length ===0) return null;
        let views = [];
        for(let i = 0, l=projectModels.length;i<l;i++){
            let projectModel = projectModels[i];
            let keyId = projectModel.item.id?projectModel.item.id:i;
            views.push(
                <RepositoryCell
                    key={keyId}
                    onSelect={() => this.onSelect(projectModel)}
                    projectModel={projectModel}
                    onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
                />
            )
        }
        return views
    }

    getParallaxRenderConfig(params) {
        let config = {}
        config.renderBackground = () => (
            <View key="background">
                <Image source={{
                    uri: params.backgroundImg,
                    width: window.width,
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.4)',
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
            </View>
        );

        config.renderForeground = () => (
            <View key="parallax-header" style={styles.parallaxHeader}>
                <Image style={styles.avatar} source={{
                    uri: params.avatar,
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE
                }}/>
                <Text style={styles.sectionSpeakerText}>
                    {params.name}
                </Text>
                <Text style={styles.sectionTitleText}>
                    {params.description}
                </Text>
            </View>
        );

        config.renderStickyHeader = () => (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
        );

        config.renderFixedHeader = () => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtil.getLeftButton(() => {
                    this.props.navigator.pop()
                })}
            </View>
        )
        return config;
    }

    render(contentView, params) {
        let renderConfig = this.getParallaxRenderConfig(params);
        const {
            onScroll = () => {
            }
        } = this.props;
        return (
            <ParallaxScrollView
                onScroll={onScroll}
                headerBackgroundColor="#333"
                backgroundColor="#2196f3"
                stickyHeaderHeight={STICKY_HEADER_HEIGHT}
                parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
                backgroundSpeed={10}
                {...renderConfig}
            >
                {contentView}
            </ParallaxScrollView>
        );
    }

}

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },
    fixedSection: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        top: 0,
        paddingRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        justifyContent: "space-between"

    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 100
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 18,
        paddingVertical: 5
    },
    row: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        height: ROW_HEIGHT,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    rowText: {
        fontSize: 20
    }
});

