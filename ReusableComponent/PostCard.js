import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import StaticMap from './StaticMap';

const PostCard = ({ post, onPress, onDelete, isMapView = false }) => {
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

                {/* Image */}
                <Image
                    source={{ uri: post.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
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
    date: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    breed: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    descriptionContainer: {
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
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
    mapViewCard: {
        marginVertical: 0,
        marginHorizontal: 0,
        width: '100%',
    },
});

export default PostCard;