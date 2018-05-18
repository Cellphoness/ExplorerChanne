import { StackNavigator } from 'react-navigation';
import { StatusBar, View, Button, Platform } from 'react-native';
import React from 'react';
import Explore from '../screens/Explore';
import HotUpdate from '../screens/HotUpdate';
import { NavigatorButtonItem as ButtonItems } from '../components/NavigatorButtonItem';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const headerTitleStyle = {
    fontFamily: "Roboto-Bold",
	fontSize: 14,
	color: "#262628"
};

export default StackNavigator(
    {
        Explore: {
        screen: Explore,
        navigationOptions: ({ navigation }) => ({
            headerTitle: 'Explore',
            headerTitleStyle: headerTitleStyle,
            headerLeft: (
                <ButtonItems
                    left 
                    source={require('../components/NavigatorButtonItem/images/icon-category.png')} 
                />),
                headerRight: (
                <ButtonItems
                    right
                    source={require('../components/NavigatorButtonItem/images/icon-search.png')} 
                />)
            })
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