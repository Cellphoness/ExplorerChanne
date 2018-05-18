import React from 'react';
import { ImageBackground, Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const ShopBigCell = ({
    bigTitle, 
    title, 
    imgUrl, 
    button, 
    tag, 
    onPress}) => {
    return (
        <ImageBackground style={styles.container} source={imgUrl} >
            <View style={styles.verticalContainer}>
                <Text style={styles.bigTitle}>{bigTitle}</Text>
                <TouchableHighlight underlayColor={styles.$darkenGray} onPress={onPress} style={styles.button}>
                    <Text style={styles.buttonText}>{button}</Text>
                </TouchableHighlight>
            </View>
            <Text style={styles.tag}>{tag}</Text>
        </ImageBackground>
    )
};

ShopBigCell.propTypes = {
    bigTitle: PropTypes.string,
    title: PropTypes.string,
    imgUrl: PropTypes.number,
    button: PropTypes.string,
    tag: PropTypes.string,
    onPress: PropTypes.func,
};

export default ShopBigCell;
