import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableHighlight, Image } from 'react-native';
import styles from './styles';

export class LoginBottomView extends Component {
    static propTypes = {
        data: PropTypes.object,
        onPressLogout: PropTypes.func,
    }

    render() {
        const { data, onPressLogout } = this.props;
        return (
            <View style={styles.userInfo}>
                <View style={styles.userMsg}>
                    <Image resizeMode='contain' style={styles.userIcon} source={data.icon}/>
                    <View style={styles.msgContent}>
                        <Text style={styles.name}>{data.name}</Text>
                        <Text style={styles.career}>{data.career}</Text>
                    </View>
                </View>
                <TouchableHighlight underlayColor={'#F0F0F0'} style={styles.logoutButton} onPress={() => {onPressLogout()}}>
                    <View style={styles.logoutButton}>
                        <Text style={styles.logout}>LOGOUT</Text>
                        <Image resizeMode='contain' style={styles.logoutIcon} source={require('../ShopCell/images/arrow.png')}/>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
};

export default LoginBottomView;