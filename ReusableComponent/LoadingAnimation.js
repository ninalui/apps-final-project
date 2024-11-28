import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function LoadingAnimation() {
    return (
        <View style={styles.container}>
            <LottieView
                source={require('../assets/animations/Animation - 1732747647919.json')}
                autoPlay
                loop
                style={styles.animation}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FCFFE0',
    },
    animation: {
        width: 200,
        height: 200,
    },
});