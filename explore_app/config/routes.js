import { StackNavigator } from 'react-navigation';
import { StatusBar, View, Button, Platform } from 'react-native';
import React from 'react';
import Explore from '../screens/Explore';
import HotUpdate from '../screens/HotUpdate';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default StackNavigator(
    {
        Explore: {
        screen: Explore,
        },
        HotUpdate: {
            screen: HotUpdate,
            navigationOptions: ({ navigation }) => ({
                headerTitle: 'HotUpdate',
            })
        }
    },
    {
      mode: 'float',
      cardStyle: Platform.OS == 'ios' ? { paddingTop: StatusBar.currentHeight } : { paddingTop: 0 },
    },
);
