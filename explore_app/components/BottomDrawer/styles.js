import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions } from 'react-native';

export default EStyleSheet.create({
    $largeHight: Dimensions.get('window').height,
    $largeWidth: Dimensions.get('window').width,
    $scaleHight: Dimensions.get('window').height - 50,
    $scaleWidth: Dimensions.get('window').width - 50,
    $hiddenPaddingBottom: -(Dimensions.get('window').width / 2 + 94),
    $normalPaddingBottom: 0,
    DBstyle: {
        width:'100%',
        height:'100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
    },
    bgLayer: {
        backgroundColor: '#000000',
        opacity: 0.5,
        width:'100%',
        height:'100%',
        position:'absolute',
        top:0,
        left:0,
    },
    container: {
        flexDirection: 'row',
        backgroundColor:'#ffffff',
        flexWrap: 'wrap',
        position:'absolute',
        left:0,
    },
    button: {
        width: Dimensions.get('window').width/4,
        height: Dimensions.get('window').width/4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    lineBottom: {
        backgroundColor:"#f1f1f1",
        position:'absolute',
        bottom:0,
        left:20,
        width:54,
        height:1,
    },
    lineRight: {
        backgroundColor:"#f1f1f1",
        position:'absolute',
        height:54,
        width:1,
        right:0,
        bottom:20,
    },
    selectButtonBG: {
        backgroundColor: '#fce76c',
    },
    title: {
        fontFamily: "Roboto-Medium",
        fontSize: 12,
        color: "#262628",
        paddingTop: 14,
    },
    icon: {
        width: 18,
        height: 18,
    },

    //userinfo

    userInfo: {
        width: Dimensions.get('window').width,
        height: 94,
        backgroundColor: '#f9f9f9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    userMsg: {
        marginLeft: 30,
        flexDirection: 'row',
    },

    userIcon: {
        borderRadius: 20,
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: "#f1f1f1",
    }, 

    msgContent: {
        marginLeft: 20,
    },

    name: {
        fontFamily: "Roboto-Medium",
        fontSize: 14,
        color: "#262628",
    }, 
    
    career: {
        fontFamily: "Roboto-Light",
        fontSize: 13,
        color: "rgba(38, 38, 40, 0.7)",
        opacity: 0.7,
        marginTop: 7,
    },

    logoutButton: {
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },

    logout: {
        fontFamily: "Roboto-Medium",
        fontSize: 12,
        color: "#262628",
        marginRight: 10,
    },

    logoutIcon: {
        width: 5,
        height: 8,
    }
});