import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Alert
} from 'react-native';
import NavigationBar from './../component/NavigationBar'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import ArrayUtil from '../util/ArrayUtil'
import SortableListView from 'react-native-sortable-listview'
import ViewUtil from'../util/ViewUtil'
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

class SortCell extends Component {
    render() {
        return (
            <TouchableHighlight
                underlayColor={'#eee'}
                delayLongPress={500}
                style={styles.items}
                {...this.props.sortHandlers}
            >
                <View style={styles.row}>
                    <Image style={styles.image} source={require('../../res/img/list.png')} />
                    <Text>{this.props.data.name}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

export default class SortKeyPage extends Component {
    constructor(props) {
        super(props);
        this.dataArray = []; //数据库读取所有数组
        this.sortResult = []; //订阅排序数组
        this.orignalCheckedArray = []; //已订阅原始数组
        this.state = {
            checkedArray: [],
        };
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(this.props.flag)
        this.loadData();
    }


    loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.getCheckedItems(result);
            })
            .catch(error => {

            })
    }

    getCheckedItems(result) {
        this.dataArray = result;
        let checkedArray = [];
        for (let i = 0, len = result.length; i < len; i++) {
            let data = result[i];
            if (data.checked) checkedArray.push(data)
        }
        this.setState({
            checkedArray: checkedArray
        })
        this.orignalCheckedArray = ArrayUtil.clone(checkedArray);
    }

    onBack(){
        if(ArrayUtil.isEqual(this.orignalCheckedArray,this.state.checkedArray)){
            this.props.navigator.pop();
            return;
        }else{
            Alert.alert(
                '提示',
                '是否保存修改？',
                [
                    {text: '否', onPress: () => this.props.navigator.pop(), style: 'cancel'},
                    {text: '是', onPress: () => this.onSave()},
                ],
            )
        }
    }

    onSave() {
        if(ArrayUtil.isEqual(this.orignalCheckedArray,this.state.checkedArray)){
            this.props.navigator.pop();
            return;
        }
        this.getSortResult();
        this.languageDao.save(this.sortResultArray);
        this.props.navigator.pop();
    }

    getSortResult(){
        this.sortResultArray = ArrayUtil.clone(this.dataArray);
        for(let  i=0,l=this.orignalCheckedArray.length;i<l;i++){
            let item = this.orignalCheckedArray[i];
            let index = this.dataArray.indexOf(item);
            this.sortResultArray.splice(index,1,this.state.checkedArray[i]);
        }
    }


    render() {
        let title = this.props.flag === FLAG_LANGUAGE.flag_language ? '语言排序':'标签排序';
        let rightButton = <TouchableOpacity
            onPress={() => this.onSave()}
        >
            <View style={{margin: 10}}>
                <Text style={styles.title}>保存</Text>
            </View>
        </TouchableOpacity>
        let navigationBar =  <NavigationBar
            title={title}
            style={{backgroundColor: '#2196f3'}}
            leftButton={ViewUtil.getLeftButton(()=>this.onBack())}
            rightButton={rightButton}
        />
        let order = Object.keys(this.state.checkedArray)
        let data = this.state.checkedArray;
        let content = data.length > 0 ?     <SortableListView
            style={{ flex: 1 }}
            data={ data}
            order={order}
            onRowMoved={e => {
                data.splice(e.to, 0, data.splice(e.from, 1)[0])
                this.forceUpdate()
            }}
            renderRow={row => <SortCell data={row}/>}
        />:null

        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ededed',
        height:500
    },
    tips: {
        fontSize: 20,
    },
    items:{
        padding: 25,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    row:{
        flexDirection:'row',
        alignItems:'center'
    },
    image:{
        tintColor:'#2196F3',
        width:20,
        height:20,
        marginRight:10
    },
    title: {
        fontSize: 16,
        color: '#fff'
    },
})