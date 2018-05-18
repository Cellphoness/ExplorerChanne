import EStyleSheet from 'react-native-extended-stylesheet';
import Color from 'color';

const ICON_WIDTH = 40;
export default EStyleSheet.create({
    $darkenGray:Color('#F0F0F0').darken(0.2),
    icon: {
        width: ICON_WIDTH,
    },

    button: {
        flex: 1,
        justifyContent: 'center',
    }, 

    container: {
        paddingHorizontal: 10,
        alignItems: 'center'
    },
});