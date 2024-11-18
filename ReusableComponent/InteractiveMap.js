import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const InteractiveMap = ({
    location,
    onLocationSelect,
    style,
    showsUserLocation = false,
    zoomEnabled = true,
    scrollEnabled = true
}) => {
    return (
        <View style={[styles.container, style]}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location?.latitude || 0,
                    longitude: location?.longitude || 0,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onPress={onLocationSelect}
                showsUserLocation={showsUserLocation}
                zoomEnabled={zoomEnabled}
                scrollEnabled={scrollEnabled}
            >
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude
                        }}
                    />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    }
});

export default InteractiveMap;