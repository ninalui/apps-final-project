import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const GOOGLE_MAP_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const StaticMap = ({ location, style, showPin = true }) => {
    const getStaticMapUrl = () => {
        if (!location?.latitude || !location?.longitude) return null;
        return `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=14&size=400x200&key=${GOOGLE_MAP_API_KEY}`;
    };

    if (!location) return null;

    return (
        <View style={[styles.container, style]}>
            <Image
                source={{ uri: getStaticMapUrl() }}
                style={styles.map}
                resizeMode="cover"
            />
            {showPin && (
                <View style={styles.pinOverlay}>
                    <MaterialIcons name="location-on" size={24} color="#FF4444" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 150,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    pinOverlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -12 }, { translateY: -24 }],
    }
});

export default StaticMap;