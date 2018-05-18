import React from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import styles from './styles';
import { Image, ImageBackground, Text, TouchableHighlight, View, StyleSheet } from 'react-native';

const ShopBottomCell = ({
    onPress,
    title, 
    imgUrl, 
    price
    }) => {
    return (
        <ImageBackground style={styles.bgProduct} source={imgUrl}>
            <TouchableHighlight underlayColor={Color('#ecedef').darken(0.2)} onPress={onPress} style={styles.bottomProductContainer}>
                <View style={styles.productInnerContainer}>
                    <Text style={styles.titleCard}>{title}</Text>
                    <Image style={styles.arrow} resizeMode='contain' source={require('./images/arrow.png')} />
                </View>
            </TouchableHighlight>
            <Text style={styles.priceBottom}>{price}</Text>
        </ImageBackground>
    )
};

ShopBottomCell.propTypes = {
    title: PropTypes.string,
    imgUrl: PropTypes.number,
    price: PropTypes.string,
    onPress: PropTypes.func,
};

export default ShopBottomCell;
