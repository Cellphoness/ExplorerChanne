import EStyleSheet from 'react-native-extended-stylesheet';
import Color from 'color';
import { Dimensions } from 'react-native';

const FontSize = size => {
    return size * Dimensions.get('window').width / 375;
}

export default EStyleSheet.create({
    $darkenGray:Color('#F0F0F0').darken(0.2),
    container: {
        width: '100%',
        height: 300,
        flexDirection: 'row',
    },
    bigTitle: {
        fontSize: FontSize(96),
        fontFamily: "Roboto-BoldCondensedItalic",
        color: "#262628",
        marginTop: 0,
        marginLeft: 20,
    },
    button: {
        width: 90,
        height: 42,
        borderRadius: 21,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "#262628",
        marginLeft: 20,
        marginBottom: 29,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 12,
        color: "#262628",
        fontFamily: "Roboto-Bold",
    },
    verticalContainer: {
        justifyContent: 'space-between',
        flex:1,
    },
    tag: {
        width: 98,
        height: 15,
        right: -20,
        bottom: 100,
        position: 'absolute',
        fontSize: 12,
        fontFamily: "Roboto-Bold",
        color: "#262628",
        transform: [{rotate:'90deg'}],
    },

    //card
    cardContainer: {
        width: '100%',
    },
    bgCard: {
        margin: 10,
        height: 161,
    },
    productContainer: {
        marginTop: 34,
        marginLeft: 31,
        marginRight: 30,
    },
    productInnerContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleCard: {
        fontFamily: "Roboto-Bold",
        fontSize: 20,
        color: "#262628",
    },
    arrow: {
        width: 6,
    },
    priceCard: {
        fontFamily: "Roboto-Medium",
        fontSize: 12,
        color: "#262628",
        marginTop: 8,
        marginLeft: 31,
    },
    midPic: {
        width: '100%',
        height: 144,
        marginTop: 19,
        marginBottom: 22,
    },

    // bottom
    bgProduct: {
        width: '100%',
        height: 203,
        justifyContent:'flex-end',
        marginBottom: 30,
    },
    bottomProductContainer: {
        marginBottom: 4,
        marginLeft: 31,
        marginRight: 30,
    },
    priceBottom: {
        fontFamily: "Roboto-Medium",
        fontSize: 12,
        color: "#262628",
        marginBottom: 55,
        marginLeft: 31,
    },

    //long
    longBgCard: {
        margin: 10,
        height: 454,
        justifyContent:'flex-end',
        '@media ios': {
            marginBottom: -30,
            zIndex: 2,
        },
        '@media android': {
            marginBottom: 30,
        },
    },
    buttonMargin: {
        marginBottom: 20,
        marginLeft: 20
    },
    bigTitleMargin: {
        marginLeft: 20,
        marginBottom: 20,
    }
});