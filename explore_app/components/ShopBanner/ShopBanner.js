import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableHighlight, ScrollView, Image } from 'react-native';
import styles from './styles';
import { Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

//用0补齐
const pad = (num, n) => {  
    var len = num.toString().length;  
    while(len < n) {  
        num = "0" + num;  
        len++;  
    }  
    return num;  
}  

export class ShopBanner extends Component {
    static propTypes = {
        // height:PropTypes.number,
        list:PropTypes.array,
        tintColor:PropTypes.string,
        animate:PropTypes.bool,
        duration:PropTypes.number
    }

    state = {
        list : [],
        currentIndex : 0
    }

    nextHandler = () => {
        var list = this.state.list.length ? this.state.list : this.props.list;
        if (list.length) {
            let currentIndex;
            if (this.state.currentIndex == list.length - 1) {
                currentIndex = 0;
            } else {
                currentIndex = this.state.currentIndex+1;
            }
            this._scrollView.scrollTo({x:SCREEN_WIDTH * currentIndex, y:0, animated: true});
            this.setState({currentIndex});
        }
    }

    preHandler = () => {
        var list = this.state.list.length ? this.state.list : this.props.list;
        if (list.length) {
            let currentIndex;
            if (this.state.currentIndex < 1) {
                currentIndex = list.length-1;
            } else {
                currentIndex = this.state.currentIndex-1;
            }
            this.setState({currentIndex});
            this._scrollView.scrollTo({x:SCREEN_WIDTH * currentIndex, y:0, animated: true});
        }
    }

    setUrlList = (list) => {
        this.setState({list});
    }

    renderItem = (data, index) => {
        let imgUrl, imgSource;
        if (data instanceof String && data.indexOf("http") == 0) {
            imgUrl = data;
            return (<Image key={index} style={styles.image} source={{url:imgUrl}}/>);
        } else {
            imgSource = data;
            return (<Image key={index} resizeMode='contain' style={styles.image} source={imgSource}/>);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);  
    }

    componentDidMount() {
        const {animate, duration=1000} = this.props;
        if (animate == true) {
            this.interval = setInterval(() => this.nextHandler(), duration);  
        }
    }

    render() {
        const {height, list, tintColor} = this.props;
        let color = '#262628';
        if (tintColor) {
            color = tintColor;
        }
        return (
            <View style={styles.container}>
                <ScrollView ref={(scrollView) => {this._scrollView = scrollView}} scrollEnabled={false} style={styles.scrollView} horizontal={true}>{this.state.list.length ? this.state.list.map(this.renderItem) : list.map(this.renderItem)}</ScrollView>
                <Text style={[styles.label, {color:color}]}>{pad(this.state.currentIndex+1, 2)}</Text>
                <TouchableHighlight underlayColor={styles.$darkenGray} style={styles.button} onPress={this.preHandler}><Image style={[styles.buttonIcon, {tintColor:color}]} resizeMode='contain' source={require('./images/arrow_left.png')} /></TouchableHighlight>
                <TouchableHighlight underlayColor={styles.$darkenGray} style={styles.button} onPress={this.nextHandler}><Image style={[styles.buttonIcon, {tintColor:color}]} resizeMode='contain' source={require('./images/arrow_right.png')} /></TouchableHighlight>
            </View>
        )
    }
};

export default ShopBanner;
