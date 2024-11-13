import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const PostCard = ({ post, onPress }) => {
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

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.card}>
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

                {/* Map Placeholder */}
                <View style={styles.mapPlaceholder}>
                    <Text>Map Location</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
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
});

export default PostCard;