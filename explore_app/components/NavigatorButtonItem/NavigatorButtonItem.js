import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import { Image, TouchableHighlight, View } from 'react-native';
import { connectBDrawer } from '../BottomDrawer';

class NavigatorButtonItem extends Component {

    static propTypes = {
        left: PropTypes.bool,
        right: PropTypes.bool,
        source: PropTypes.number,
        popDrawer: PropTypes.func,
        tintColor: PropTypes.string
    }

    leftHandelr = () => {
      console.log('left handler');
      this.props.popDrawer();
    }

    rightHandler = () => {

    }

    render() {
      const { source, left, right, onPress, tintColor } = this.props;
      let handler;
      if (left == true) {
          handler = this.leftHandelr
      }
      if (onPress) {
         handler = onPress
      }

      return (
        <View style={styles.container}>
          <TouchableHighlight underlayColor={styles.$darkenGray} onPress={handler} style={styles.button}>
              <Image resizeMode='contain' source={source} style={[styles.icon, {tintColor, width:15, height:15}]} />
          </TouchableHighlight>
        </View>
      )
    }
};

export default connectBDrawer(NavigatorButtonItem);
