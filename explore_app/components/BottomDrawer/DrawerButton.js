import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableWithoutFeedback, Image } from 'react-native';
import styles from './styles';

export class DrawerButton extends Component {
    static propTypes = {
        data: PropTypes.object,
        selected: PropTypes.bool,
        onPress: PropTypes.func,
    }

    render() {
        const { data, selected, onPress } = this.props;
        return (
            <TouchableWithoutFeedback key={data.name} onPress={() => {onPress()}}>
                <View style={[styles.button, selected ? styles.selectButtonBG : null]}>
                    <Image resizeMode='contain' style={styles.icon} source={data.icon}/>
                    <Text style={styles.title}>{data.name}</Text>
                    <View style={styles.lineBottom}/>
                    <View style={styles.lineRight}/>
                </View>
            </TouchableWithoutFeedback>
        )
    }
};

export default DrawerButton;
