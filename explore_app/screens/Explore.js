import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListView } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import data from '../data/data';
import { ShopBigCell, ShopCardCell, ShopLongCell, ShopBottomCell } from '../components/ShopCell';
import { ShopBanner } from '../components/ShopBanner';
import { connectBDrawer } from '../components/BottomDrawer';

class Explore extends Component {

    state = {
        ds : new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }

    static propTypes = {
        navigation: PropTypes.object,
        addTargetFunc: PropTypes.func,
        removeTarget: PropTypes.func,
    }
    
    constructor(props) {
        super(props);
        // 延时三秒执行 添加banner
        setTimeout(()=> {
            let list = [...data.list];
            list.unshift({
                type:'bannerList', 
                list:[
                require('../data/images/banner/big_camera.png'),
                require('../data/images/banner/lamp_banner.png'), 
                require('../data/images/banner/quite_control.png')]});
            this.setState({ds: this.state.ds.cloneWithRows(list)});
        }, 3000);
    }

    componentWillMount() {
        this.props.addTargetFunc(this, (data) => {
            console.log('EXPLORE Screen data ', data);
            if (data.name === 'Location') {
                this.props.navigation.navigate('HotUpdate');
            }
        });
    }

    componentWillUnmount() {
        this.props.removeTarget(this);
    }

    componentDidMount() {
        this.setState({ds: this.state.ds.cloneWithRows(data.list)});
    }

    onCommitClickShopCell = (rowData) => {

    }

    renderRowData = (rowData, sectionID, rowID) => {
        switch (rowData.type) {
            case 'big':
                return (
                    <ShopBigCell {...rowData} onPress={() => {
                        this.onCommitClickShopCell(rowData);
                    }}/>
                );
            case 'card':
                return (
                    <ShopCardCell {...rowData} onPress={() => {
                        this.onCommitClickShopCell(rowData);
                    }}/>
                );
            case 'bottom':
                return (
                    <ShopBottomCell {...rowData} onPress={() => {
                        this.onCommitClickShopCell(rowData);
                    }}/>
                )
            case 'long': 
                return (
                    <ShopLongCell {...rowData} onPress={() => {
                        this.onCommitClickShopCell(rowData);
                    }}/>
                );
            case 'bannerList':
                return (
                    <ShopBanner  
                    animate 
                    list={rowData.list} 
                    tintColor={'#262628'}
                    duration={2000} />
                );
            default:
                return null;;
        }
    }

    render() {
        return (
            <ListView style={{backgroundColor:'#ffffff'}}
                dataSource={this.state.ds}
                renderRow={this.renderRowData}
            />
        );
    }
}

export default connectBDrawer(Explore);