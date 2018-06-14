import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import NavigationBar from './../component/NavigationBar'
import ViewUtil from '../util/ViewUtil'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import Checkbox from 'react-native-check-box'
import ArrayUtil from '../util/ArrayUtil'

export default class CustomKeyPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(this.props.flag)
        this.changeValues = []
        this.isRemoveKey = this.props.isRemoveKey ? true:false;
        this.state = {
            dataArray: []
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.setState({
                    dataArray: result
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    onBack(){
        if(this.changeValues.length===0){
            this.props.navigator.pop();
            return;
        }else{
            Alert.alert(
                '提示',
                '要保存修改吗？',
                [
                    {text: '不保存', onPress: () => this.props.navigator.pop(), style: 'cancel'},
                    {text: '保存', onPress: () => this.onSave()},
                ],
            )
        }
    }

    onSave() {
        if (this.changeValues.length === 0) {
            this.props.navigator.pop();
            return;
        }
        this.languageDao.save(this.state.dataArray);
        this.props.navigator.pop();
    }

    onRemove() {
        if (this.changeValues.length === 0) {
            this.props.navigator.pop();
            return;
        }
        for(let i=0,l=this.changeValues.length;i<l;i++){
            ArrayUtil.remove(this.state.dataArray,this.changeValues[i]);
        }
        this.languageDao.save(this.state.dataArray);
        this.props.navigator.pop();
    }

    onClick(data) {
        data.checked = !data.checked;
        ArrayUtil.updateArray(this.changeValues, data)
    }

    renderCheckBox(data) {
        let leftText = data.name
        return (<Checkbox
            style={{flex: 1, padding: 10}}
            onClick={() => this.onClick(data)}
            leftText={leftText}
            isChecked={data.checked}
            checkedImage={
                <Image style={{tintColor: '#2196f3'}} source={require('../../res/img/check_box.png')}/>}
            unCheckedImage={
                <Image style={{tintColor: '#2196f3'}} source={require('../../res/img/check-box-blank.png')}/>}

        />)
    }

    renderView() {
        if (!this.state.dataArray || this.state.dataArray.length === 0) return null;

        let len = this.state.dataArray.length;
        let views = [];
        for (let i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i + 1])}
                    </View>
                    <View style={styles.line}></View>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
                    {this.renderCheckBox(this.state.dataArray[len - 1])}
                </View>
                <View style={styles.line}></View>
            </View>)
        return views;
    }

    render() {
        let title = this.isRemoveKey ? '标签移除':'自定义标签';
        title = this.props.flag === FLAG_LANGUAGE.flag_language ? '自定义语言':title;
        let ringhtButtonTitle = this.isRemoveKey ? '移除':'保存';

        let rightButton = this.isRemoveKey? <TouchableOpacity
            onPress={() => this.onRemove()}
        >
            <View style={{margin: 10}}>
                <Text style={styles.title}>{ringhtButtonTitle}</Text>
            </View>
        </TouchableOpacity>:<TouchableOpacity
            onPress={() => this.onSave()}
        >
            <View style={{margin: 10}}>
                <Text style={styles.title}>{ringhtButtonTitle}</Text>
            </View>
        </TouchableOpacity>
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={title}
                    style={{backgroundColor: '#2196f3'}}
                    leftButton={ViewUtil.getLeftButton(() => this.onBack())}
                    rightButton={rightButton}
                />
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    tips: {
        fontSize: 20,
    },
    title: {
        fontSize: 16,
        color: '#fff'
    },
    line: {
        height: 0.3,
        backgroundColor: '#999'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})