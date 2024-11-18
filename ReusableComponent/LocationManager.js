import { View, Text, StyleSheet, Alert, Pressable, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import Loading from './Loading'
import { MaterialIcons } from '@expo/vector-icons';
import StaticMap from './StaticMap';
import InteractiveMap from './InteractiveMap';

export default function LocationManager({ onLocationSelect, initialLocation, shouldReset, location: parentLocation }) {
    const [response, requestPermission] = Location.useForegroundPermissions();
    const [location, setLocation] = useState(initialLocation || null);
    const [isLoading, setIsLoading] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [hasCurrentLocation, setHasCurrentLocation] = useState(!!initialLocation);

    // sync with parent's location
    useEffect(() => {
        setLocation(parentLocation);
    }, [parentLocation]);

    // Handle reset
    useEffect(() => {
        if (shouldReset) {
            setLocation(null);
            setHasCurrentLocation(false);
        }
    }, [shouldReset]);

    // Verify location permissions
    const verifyPermission = async () => {
        if (response?.granted) {
            return true;
        }
        const permissionResponse = await requestPermission();
        return permissionResponse.granted;
    }

    // Handle initial location press
    const handlePress = async () => {
        if (!hasCurrentLocation) {
            try {
                setIsLoading(true);
                const hasPermission = await verifyPermission();
                if (!hasPermission) {
                    Alert.alert('Permission Denied', 'Please allow location access to use this feature.');
                    return;
                }
                const currentLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                const newLocation = {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude
                };

                setLocation(newLocation);
                setHasCurrentLocation(true);
                if (onLocationSelect) {
                    onLocationSelect(newLocation);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to get location: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        } else {
            setShowMap(true);
        }
    };

    // Handle map press in interactive mode
    const handleMapPress = (event) => {
        const newLocation = {
            latitude: event.nativeEvent.coordinate.latitude,
            longitude: event.nativeEvent.coordinate.longitude
        }
        setLocation(newLocation);
        if (onLocationSelect) {
            onLocationSelect(newLocation);
        }
    }

    return (
        <>
            {/* Static Map Container */}
            <View>
                <Pressable
                    style={styles.container}
                    onPress={handlePress}>
                    {isLoading ? (
                        <Loading />
                    ) : location && location.latitude && location.longitude ? (
                        <StaticMap location={location} />
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <MaterialIcons name="location-on" size={32} color="#666" />
                            <Text style={styles.placeholderText}>Tap to get current location</Text>
                        </View>
                    )}
                </Pressable>

                {/* Helper Text - shown only after first location selection */}
                {hasCurrentLocation && (
                    <View style={styles.helperTextContainer}>
                        <MaterialIcons name="edit-location" size={16} color="#666" />
                        <Text style={styles.helperText}>
                            Inaccurate location? Tap to adjust
                        </Text>
                    </View>
                )}
            </View>

            {/* Interactive Map Modal */}
            <Modal
                visible={showMap}
                animationType="slide"
                onRequestClose={() => setShowMap(false)}
            >
                <View style={styles.modalContainer}>
                    <InteractiveMap
                        location={location}
                        onLocationSelect={handleMapPress}
                        showsUserLocation={true}
                    />
                    <Pressable
                        style={styles.doneButton}
                        onPress={() => setShowMap(false)}
                    >
                        <Text style={styles.doneButtonText}>Confirm</Text>
                    </Pressable>
                </View>
            </Modal>
        </>
    );

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 150,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    placeholderText: {
        color: '#666',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
    },
    doneButton: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    doneButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});