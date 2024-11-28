import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import StaticMap from './StaticMap';


const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};


const PostCard = ({ post, onPress, onDelete, isMapView = false, userLocation = null }) => {
    const [expanded, setExpanded] = useState(false);
    const maxLength = 100; // Maximum number of characters to show initially

    // Check if text needs to be truncated
    const needsTruncation = post.description.length > maxLength;

    // Get display text based on expanded state
    const displayText = expanded
        ? post.description
        : needsTruncation
            ? post.description.substring(0, maxLength) + '...'
            : post.description;


    const openMapsNavigation = () => {
        const scheme = Platform.select({
            ios: 'maps:',
            android: 'google.navigation:q='
        });
        const latLng = `${post.location.latitude},${post.location.longitude}`;
        const label = 'Dog Spotted Here';
        const url = Platform.select({
            ios: `${scheme}?q=${label}&ll=${latLng}`,
            android: `${scheme}${latLng}`
        });

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert(
                    "Error",
                    "Maps application is not installed"
                );
            }
        });
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => onDelete(post.id),
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={[styles.card, isMapView && styles.mapViewCard]}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                {/* Delete button - only show if not in map view */}
                {!isMapView && onDelete && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <MaterialIcons name="delete" size={24} color="#FF4444" />
                    </TouchableOpacity>
                )}

                {/* Date */}
                <Text style={styles.date}>
                    {new Date(post.date).toLocaleDateString()}
                </Text>

                {/* Distance - Only show in map view and if userLocation exists */}
                {isMapView && userLocation && post.location && (
                    <Text style={styles.distance}>
                        {calculateDistance(
                            userLocation.latitude,
                            userLocation.longitude,
                            post.location.latitude,
                            post.location.longitude
                        )} km away
                    </Text>
                )}

                {/* Image */}
                <Image
                    source={{ uri: post.imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                />

                {/* Breed Info */}
                {post.breed && (
                    <Text style={styles.breed}>
                        Breed: {post.breed}
                    </Text>
                )}

                {/* Description with Show More/Less */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>
                        {displayText}
                    </Text>
                    {needsTruncation && (
                        <TouchableOpacity
                            onPress={() => setExpanded(!expanded)}
                            style={styles.showMoreButton}
                        >
                            <Text style={styles.showMoreText}>
                                {expanded ? 'Show Less' : 'Show More'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Map - only show if not in map view */}
                {!isMapView && post.location && (
                    <StaticMap
                        location={post.location}
                        style={styles.mapContainer}
                    />
                )}

                {/*Go Find It button - only show in map view */}
                {isMapView && (
                    <TouchableOpacity
                        style={styles.findButton}
                        onPress={openMapsNavigation}
                    >
                        <MaterialIcons name="directions" size={16} color="white" />
                        <Text style={styles.findButtonText}>Go Find It</Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    deleteButton: {
        position: 'absolute',
        top: -5,
        right: -8,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    card: {
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    mapViewCard: {
        marginVertical: 0,
        marginHorizontal: 0,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 6,
    },
    date: {
        fontSize: 10,
        color: '#666',
        marginBottom: 4,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 6,
        marginBottom: 2,
        backgroundColor: '#f5f5f5',
    },
    breed: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    descriptionContainer: {
        marginBottom: 10,
    },
    description: {
        fontSize: 10,
        lineHeight: 14,
    },
    showMoreButton: {
        marginTop: 5,
    },
    showMoreText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '500',
    },
    mapPlaceholder: {
        height: 100,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    distance: {
        fontSize: 10,
        color: '#666',
        marginBottom: 4,
        fontStyle: 'italic',
    },
    findButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff4444',
        padding: 8,
        borderRadius: 20,
        marginTop: 8,
    },
    findButtonText: {
        color: 'white',
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '600',
    },
});

export default PostCard;