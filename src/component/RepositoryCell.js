import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import BaseComponent from "../pages/BaseComponent";

export default class RepositoryCell extends BaseComponent {
    constructor(props) {
        super(props);
        //console.log('projectModel')
        //console.log(this.props.projectModel)
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../../res/img/favi_select.png') : require('../../res/img/favi.png')
        }
    }

    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/img/favi_select.png') : require('../../res/img/favi.png')
        })
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextProps isFavorite')
        console.log(nextProps.projectModel.isFavorite)
        this.setFavoriteState(nextProps.projectModel.isFavorite)
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite)
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
    }

    render() {
        // console.log(this.state.favoriteIcon)
        let item = this.props.projectModel.item ? this.props.projectModel.item : this.props.projectModel;
        let favoriteButton = <TouchableOpacity
            onPress={() => this.onPressFavorite()}
        >
            <Image style={[{width: 22, height: 22}, this.props.theme.styles.tabBarSelectedIcon]}
                   source={this.state.favoriteIcon}/>
        </TouchableOpacity>
        return <TouchableOpacity
            onPress={this.props.onSelect}
            style={styles.container}
        >
            <View style={styles.cell_container}>
                <Text style={styles.title}>{item.full_name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text>作者:</Text>
                        <Image style={{height: 22, width: 22}} source={{uri: item.owner.avatar_url}}/>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text>Stars:</Text>
                        <Text>{item.stargazers_count}</Text>
                    </View>
                    {favoriteButton}
                </View>
            </View>
        </TouchableOpacity>
    }
}


const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#333'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#666',
        borderRadius: 2
    },
    cell_container: {
        backgroundColor: '#fff',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderWidth: .5,
        borderColor: '#999',
        shadowColor: 'gray',
        shadowOffset: {
            width: 0.5,
            height: 0.5
        },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
    }
});