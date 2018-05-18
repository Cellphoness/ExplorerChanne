// rfep : arrowfunction Component
// rcep : class Component
import React from 'react';
import { Image, Text, TouchableHighlight, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Color from 'color';
import styles from './styles';

const ShopCardCell = ({
    onPress,
    title, 
    imgUrl, 
    price, 
    tag, 
    bgColor
    }) => {
    const bgCardStyle = [styles.bgCard, {backgroundColor:bgColor}];
    return (
        <View style={styles.cardContainer}>
            <View style={[StyleSheet.absoluteFill, bgCardStyle]}/>
            <TouchableHighlight underlayColor={Color(bgColor).darken(0.5)} onPress={onPress} style={styles.productContainer}>
                <View style={styles.productInnerContainer}>
                    <Text style={styles.titleCard}>{title}</Text>
                    <Image style={styles.arrow} resizeMode='contain' source={require('./images/arrow.png')} />
                </View>
            </TouchableHighlight>
            <Text style={styles.priceCard}>{price}</Text>
            <Image resizeMode='contain' style={styles.midPic} source={imgUrl} />
            <Text style={styles.tag}>{tag}</Text>
        </View>
    )
};

ShopCardCell.propTypes = {
    title: PropTypes.string,
    imgUrl: PropTypes.number,
    bgColor: PropTypes.string,
    price: PropTypes.string,
    tag: PropTypes.string,
    onPress: PropTypes.func,
};

export default ShopCardCell;
