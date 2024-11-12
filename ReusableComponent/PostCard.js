import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PostCard = ({ post }) => {
    return (
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

            {/* Description */}
            <Text style={styles.description}>{post.description}</Text>

            {/* Map Placeholder */}
            <View style={styles.mapPlaceholder}>
                <Text>Map Location</Text>
            </View>
        </View>
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
    description: {
        fontSize: 14,
        marginBottom: 10,
        lineHeight: 20,
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