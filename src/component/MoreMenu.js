import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Platform,
    StyleSheet,
    Image,
    StatusBar,
    Text,
    View
} from 'react-native';
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";

export const MORE_MENU={
    Custom_Language:'Custom Language',
    Sort_Language:'Sort Language',
    Custom_Key:'Custom_Key',
    Sort_Key:'Sort Key',
    Remove_Key:'Remove Key',
    About_Author:'About Author',
    About:'About',
    Custom_Theme:'Custom Theme',
    WebSite:'WebSite',
    Feedback:'Feedback',

}

export default class MoreMenu extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }
}