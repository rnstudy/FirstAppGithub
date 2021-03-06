import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

import HtmlView from 'react-native-htmlview';
import BaseComponent from "../pages/BaseComponent";

export default class TrendingCell extends BaseComponent {
    constructor(props) {
        super(props);
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

    componentWillReceiveProps(nextProps){
        this.setFavoriteState(nextProps.projectModel.isFavorite)
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite)
        this.props.onFavorite(this.props.projectModel.item,!this.state.isFavorite);
    }

    render() {
        let item = this.props.projectModel.item ? this.props.projectModel.item : this.props.projectModel;
        let description = '<p>' + item.description + '</p>'
        let favoriteButton = <TouchableOpacity
            onPress={() => this.onPressFavorite()}
        >
            <Image style={[{width: 22, height: 22}, this.props.theme.styles.tabBarSelectedIcon]} source={this.state.favoriteIcon}/>
        </TouchableOpacity>

        return <TouchableOpacity
            onPress={this.props.onSelect}
            style={styles.container}
        >
            <View style={styles.cell_container}>
                <Text style={styles.title}>{item.fullName}</Text>
                <HtmlView
                    value={description}
                    onLinkPress={(url) => {
                    }}
                    stylesheet={
                        {
                            p: styles.description,
                            a: styles.description
                        }
                    }
                />
                <Text style={styles.description}>{item.meta}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.description}>贡献者们:</Text>
                        {item.contributors.map((result, i, arr) => {
                            return <Image key={i} style={{height: 22, width: 22}} source={{uri: arr[i]}}/>
                        })}
                    </View>
                    {favoriteButton}
                </View>
            </View>
        </TouchableOpacity>
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
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