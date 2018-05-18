import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import BottomDrawer from './BottomDrawer';
import data from '../../data/data';

export default class BDrawerProvider extends Component {
  static childContextTypes = {
    popDrawer: PropTypes.func,
    addTargetFunc: PropTypes.func,
    removeTarget: PropTypes.func,
  };

  targetMap = new Map();

  static propTypes = {
    children: PropTypes.any,
  };

  getChildContext() {
    return {
        popDrawer: () => { if (this.bd) {this.bd.show()} },
        addTargetFunc: (target, func) => { this.addTargetMap(target, func) },
        removeTarget: (target) => { this.targetMap.delete(target) }
    };
  }

  addTargetMap = (target, func) => {
    this.targetMap.set(target, func);
  }
  
  callTargetFunc(data) {
    var length = this.targetMap.size;
    var index = 0;
    for (const [key, value] of this.targetMap) {
      if (index == length-1) {
        value.call(key, data);
      }
      index++;
    }
  }

  render() {
    return (
        <View style={{ flex: 1 }}>
            {React.Children.only(this.props.children)}
            <BottomDrawer
              ref={(ref) => {
                this.bd = ref;
              }}
              onPress={(data) => {
                this.callTargetFunc(data);
              }}
            />
        </View>
    );
  }
}