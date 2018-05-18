import React from 'react';
import { ImageBackground, Image, Text, TouchableHighlight, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Color from 'color';
import styles from './styles';

const ShopLongCell = ({
    bigTitle, 
    title, 
    imgUrl, 
    button, 
    onPress}) => {
    
    const bigTitleStyle = [styles.bigTitle];
    const buttonStyle = [styles.button];
    const buttonTextStyle = [styles.buttonText];

    bigTitleStyle.push({color:'#ffffff'});
    bigTitleStyle.push(styles.bigTitleMargin);
    buttonStyle.push({borderColor:'#ffffff'});
    buttonStyle.push(styles.buttonMargin);
    buttonTextStyle.push({color:'#ffffff'});

    return (
        <ImageBackground style={styles.longBgCard} source={imgUrl}>
            <Text style={bigTitleStyle}>{bigTitle}</Text>
            <TouchableHighlight underlayColor={styles.$darkenGray} onPress={onPress} style={buttonStyle}>
                <Text style={buttonTextStyle}>{button}</Text>
            </TouchableHighlight>
        </ImageBackground>
    )
};

ShopLongCell.propTypes = {

};

export default ShopLongCell;
