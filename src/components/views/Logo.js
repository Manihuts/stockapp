import { StyleSheet, View } from "react-native";
import { SvgUri } from "react-native-svg";

export const Logo = ({ uri, width, height}) => {
    return (
        <View style={styles.image_container}>
            <SvgUri
                width={width}
                height={height}
                uri={uri}
                preserveAspectRatio="xMinYMin meet"
                style={styles.image}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    image_container: {
        overflow: 'hidden',
        borderRadius: 5,
    },
    image: {
        resizeMode: "contain"
    }
});