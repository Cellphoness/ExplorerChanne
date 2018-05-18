import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import { Image, ImageBackground, Text, View, TouchableWithoutFeedback, Animated } from 'react-native';
import { captureScreen, releaseCapture } from 'react-native-view-shot';
import DrawerButton from './DrawerButton';
import LoginBottomView from './LoginBottomView';

const ANIMATION_DURATION = 250;

class BottomDrawer extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        changing:false,
        hidden:true,
        uri:'',
        seletedIndex:2,
        drawerList:[
            {icon:require('./images/icon-1.png'), name:'Messages'},
            {icon:require('./images/icon-2.png'), name:'Favourites'},
            {icon:require('./images/icon-3.png'), name:'Shops'},
            {icon:require('./images/icon-4.png'), name:'Photos'},
            {icon:require('../NavigatorButtonItem/images/icon-search.png'), name:'Search'},
            {icon:require('./images/icon-6.png'), name:'Location'},
            {icon:require('./images/icon-7.png'), name:'Notification'},
            {icon:require('./images/icon-8.png'), name:'Home'},
            {name:'Cellphoness', career:'iOS Engineer', icon:require('./images/user_icon.jpg'), key:'logout'}
        ],
        bgImageWidth : new Animated.Value(styles.$largeWidth),
        bgImageHeight : new Animated.Value(styles.$largeHight),
        paddingBottom: new Animated.Value(styles.$hiddenPaddingBottom)
    }

    show = () => {
        captureScreen({quality:0.8})
        .then(uri => {
            this.setState({hidden:false, uri});
        }, error => {

        });
    }
        
    dismiss = (data) => {
        this.rollBackAnimation(data);
    }

    onPress = (data, index) => {
        this.setState({seletedIndex:index, changing:true}, () => {
            this.dismiss(data);
        });
    }

    renderItem = (data, index) => {
        if (data.key === 'logout') {
            return(
                <LoginBottomView key={'logout'} data={data} onPressLogout={() => {console.log('onPressLogout')}} />
            )
        }
        return (
            <DrawerButton key={index} data={data} selected={this.state.seletedIndex == index} onPress={() => {this.onPress(data, index)}} />
        )
    }

    startScaleAnimation() {
        Animated.parallel([
            Animated.timing(this.state.bgImageWidth, {
              toValue: styles.$scaleWidth,
              duration: ANIMATION_DURATION,
            }),
            Animated.timing(this.state.bgImageHeight, {
              toValue: styles.$scaleHight,
              duration: ANIMATION_DURATION,
            }),
            Animated.timing(this.state.paddingBottom, {
                toValue: styles.$normalPaddingBottom,
                duration: ANIMATION_DURATION,
            }),
          ]).start();
    }

    rollBackAnimation(data) {
        Animated.parallel([
            Animated.timing(this.state.bgImageWidth, {
              toValue: styles.$largeWidth,
              duration: ANIMATION_DURATION,
            }),
            Animated.timing(this.state.bgImageHeight, {
              toValue: styles.$largeHight,
              duration: ANIMATION_DURATION,
            }),
            Animated.timing(this.state.paddingBottom, {
                toValue: styles.$hiddenPaddingBottom,
                duration: ANIMATION_DURATION,
            }),
        ]).start(() => {
            releaseCapture(this.state.uri);
            this.setState({
                hidden:true,
                changing:false,
            });
            if (data) {
                const {onPress} = this.props;
                if (onPress) {
                    onPress(data);
                }
            }
        });
    }

    componentDidUpdate() {
        if (this.state.hidden == false && this.state.changing == false) {
            this.startScaleAnimation();
        }
    }

    render() {
        if (this.state.hidden) {
            return null;
        } else {
            return (
                <View style={styles.DBstyle}>
                    <Animated.Image resizeMode='contain' style={{width:this.state.bgImageWidth, height:this.state.bgImageHeight}} source={{uri:this.state.uri}} />
                    <TouchableWithoutFeedback onPress={this.dismiss}>
                        <View style={styles.bgLayer}>
                        </View>
                    </TouchableWithoutFeedback>
                    <Animated.View style={[styles.container, {bottom: this.state.paddingBottom}]}>
                        {this.state.drawerList.map(this.renderItem)}
                    </Animated.View> 
                </View>
            )
        }
    }
};

export default BottomDrawer;
