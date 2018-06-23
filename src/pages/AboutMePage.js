import React, {Component} from 'react';
import {
    View,
    Clipboard,
    StyleSheet,
    Linking,
    DeviceEventEmitter //事件發射器
} from 'react-native';

import GlobalStyles from '../../res/styles/GlobalStyles'
import ViewUtil from '../util/ViewUtil'
import AboutCommon, {FLAG_ABOUT} from './AboutCommon'
import config from '../../res/data/config'
import FLLAG from '../../res/data/merepo'
import Toast, {DURATION} from 'react-native-easy-toast'
import WebPage from "./WebPage";


export default class AboutMePage extends Component {
    constructor(props) {
        super(props);
        this.aboutCommon = new AboutCommon(props, (dic) => this.updateState(dic), FLAG_ABOUT.flag_about_me, config)
        this.state = {
            projectModels: [],
            author: config.author,
            showRepository: false,
            showBlog: false,
            showQQ: false,
            showContact: false
        }
    }

    updateState(dic) {
        this.setState(dic)
    }

    componentDidMount() {
        this.aboutCommon.componentDidMount();
    }


    /**
     * 获取点击图标
     * @param isShow
     */
    getClickIcon(isShow) {
        return isShow ? require('../../res/img/author1.png') : require('../../res/img/person.png')
    }

    onClick(tab) {
        let TargetComponet, params = {...this.props, menuType: tab}
        switch (tab) {
            case FLLAG.REPOSITORY:
                this.updateState({
                    showRepository: !this.state.showRepository
                })
                break;
            case FLLAG.BLOG:
                this.updateState({
                    showBlog: !this.state.showBlog
                })
                break;
            case FLLAG.QQ:
                this.updateState({
                    showQQ: !this.state.showQQ
                })
                break;
            case FLLAG.CONTACT:
                this.updateState({
                    showContact: !this.state.showContact
                })
                break;
            case FLLAG.CONTACT.items.QQ:
                Clipboard.setString(tab.account);
                this.toast.show('QQ号：' + tab.account + '已剪切到复制板');
                break;
            case FLLAG.CONTACT.items.Email:
                let url = 'mailto://' + tag.account
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => console.error('An error occurred', err));
                break;

            case FLLAG.QQ.items.MD:
                Clipboard.setString(tab.account);
                this.toast.show('群号：' + tab.account + '已剪切到复制板');
                break;

            case FLLAG.QQ.items.RN:
                Clipboard.setString(tab.account);
                this.toast.show('群号：' + tab.account + '已剪切到复制板');
                break;

            case FLLAG.BLOG.items.CSDN:
            case FLLAG.BLOG.items.PERSONAL_BLOG:
            case FLLAG.BLOG.items.JIANSHU:
            case FLLAG.BLOG.items.GITHUB:
                TargetComponet=WebPage;
                params.url=tab.url
                params.title=tab.title
                break;


        }
        if (TargetComponet) {
            this.props.navigator.push({
                component: TargetComponet,
                params: params
            })
        }
    }

    /**
     * 显示列表数据
     * @param dic
     * @param isShowAccount
     */
    renderItems(dic, isShowAccount) {
        if (!dic) return null;
        let views = [];
        for (let i in dic) {
            let title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title;
            views.push(
                <View key={i}>
                    {ViewUtil.getSettingItem(() => this.onClick(dic[i]), '', title, {tintColor: '#2196f3'})}
                    <View style={GlobalStyles.line}/>
                </View>
            )
        }
        return views;
    }


    render() {
        let content = <View>
            {/*{this.aboutCommon.renderRepository(this.state.projectModels)}*/}
            {ViewUtil.getSettingItem(() => {
                this.onClick(FLLAG.BLOG)
            }, require('../../res/img/website.png'), FLLAG.BLOG.name, {tintColor: '#2196f3'}, this.getClickIcon(this.state.showBlog))}
            <View style={GlobalStyles.line}/>
            {this.state.showBlog ? this.renderItems(FLLAG.BLOG.items) : null}

            {ViewUtil.getSettingItem(() => {
                this.onClick(FLLAG.REPOSITORY)
            }, require('../../res/img/website.png'), FLLAG.REPOSITORY, {tintColor: '#2196f3'}, this.getClickIcon(this.state.showRepository))}
            <View style={GlobalStyles.line}/>
            {this.state.showRepository ? this.aboutCommon.renderRepository(this.state.projectModels) : null}

            {ViewUtil.getSettingItem(() => {
                this.onClick(FLLAG.QQ)
            }, require('../../res/img/website.png'), FLLAG.QQ.name, {tintColor: '#2196f3'}, this.getClickIcon(this.state.showQQ))}
            <View style={GlobalStyles.line}/>
            {this.state.showQQ ? this.renderItems(FLLAG.QQ.items, true) : null}

            {ViewUtil.getSettingItem(() => {
                this.onClick(FLLAG.CONTACT)
            }, require('../../res/img/website.png'), FLLAG.CONTACT.name, {tintColor: '#2196f3'}, this.getClickIcon(this.state.showContact))}
            <View style={GlobalStyles.line}/>
            {this.state.showContact ? this.renderItems(FLLAG.CONTACT.items, true) : null}

        </View>
        return (<View style={styles.container}>
            {this.aboutCommon.render(content, this.state.author)}
            <Toast ref={e => this.toast = e}/>
        </View>)
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});


