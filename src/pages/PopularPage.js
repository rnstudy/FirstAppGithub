import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View,
    TextInput,
    ListView
} from 'react-native';

import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import NavigationBar from './../component/NavigationBar'
import DataRepository from './../expand/dao/DataRepository'
import RepositoryCell from './../component/RepositoryCell'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
export default class PopularPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            result: ''
        }
    }

    render() {
        return <View style={styles.container}>
            <NavigationBar
                title={'最热'}
                style={{backgroundColor: '#6495ED'}}
            />
            <ScrollableTabView
                renderTabBar={() => <ScrollableTabBar/>}>
                <PopularTab tabLabel="Java">Java</PopularTab>
                <PopularTab tabLabel="IOS">IOS</PopularTab>
                <PopularTab tabLabel="Android">Android</PopularTab>
                <PopularTab tabLabel="Javascript">Javascript</PopularTab>
            </ScrollableTabView>
        </View>
    }
}

class PopularTab extends Component {
    constructor(props) {
        super(props)
        this.dataRepository = new DataRepository()
        this.state = {
            result: '',
            dataSource:new ListView.DataSource({rowHasChanged:(r1,r2)=>r1 !== r2})
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let url = URL + this.props.tabLabel + QUERY_STR;
        this.dataRepository.fetchNetRepository(url)
            .then(result => {
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(result.items)
                })
            })
            .catch(error => {
                this.setState({
                    result: JSON.stringify(result)
                })
            })
    }

    renderRow(data){
        return <RepositoryCell data={data} />
    }
    render() {
        return <View>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data)=>this.renderRow(data)}
            />
            <Text style={{height: 600}}>{this.state.result}</Text>
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