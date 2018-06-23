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
    TouchableOpacity
} from 'react-native';

import NavigationBar from './../component/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import GlobalStyles from '../../res/styles/GlobalStyles'

export default class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rightButtonText: '搜索',
        }
    }
    onBackPress(){
        this.refs.input.blur();
        this.props.navigator.pop();
    }

    onRightButtonClick() {
        if (this.state.rightButtonText === '搜索') {
            this.updateState({
                rightButtonText: '取消'
            })
        }else{
            this.updateState({
                rightButtonText: '搜索'
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

    render() {
        let statusBar = null;
        if (Platform.OS === 'ios') {
            statusBar = <View style={[styles.statusBar, {backgroundColor: '#2196f3'}]}/>
        }
        return <View style={GlobalStyles.root_contianer}>
            {statusBar}
            {this.renderNavBar()}
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
        borderWidth:  (Platform.OS === 'ios') ? 1 : 0,
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