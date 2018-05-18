import EStyleSheet from 'react-native-extended-stylesheet';
import Color from 'color';

export default EStyleSheet.create({
    $darkenGray:Color('#F0F0F0').darken(0.2),
    label: {
        fontFamily: "Roboto-BoldCondensedItalic",
        fontSize: 18,
        color: "#262628",
        marginBottom: 33,
        marginRight: 10,
    },

    buttonIcon: {
        width: 6,
        height: 10,
    }, 

    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 30,
        marginBottom: 28,
    }, 

    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        height:400,
        marginBottom: 10,
    },

    scrollView: {
        width:'$screenWidth',
        height:400,
        backgroundColor:'#F0F0F0',
        flexDirection: 'row',
        position:'absolute',
    },

    image: {
        width: '$screenWidth',
        height:400,
    }
});