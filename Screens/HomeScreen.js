import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, RefreshControl } from 'react-native';
import { auth } from '../Firebase/firebaseSetup';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { database } from '../Firebase/firebaseSetup';
import PostCard from '../ReusableComponent/PostCard';

const HomeScreen = ({ route }) => {
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const user = auth.currentUser;

    // Handle new post from navigation params
    useEffect(() => {
        if (route.params?.newPost) {
            setPosts(currentPosts => [route.params.newPost, ...currentPosts]);
            // Clear the params to prevent duplicate additions
            route.params.newPost = undefined;
        }
    }, [route.params?.newPost]);

    const fetchPosts = async () => {
        if (!user) return;

        try {
            const postsRef = collection(database, 'users', user.uid, 'posts');
            const q = query(postsRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            const fetchedPosts = [];
            querySnapshot.forEach((doc) => {
                fetchedPosts.push({
                    id: doc.id,
                    ...doc.data(),
                    // Convert Firestore Timestamp to Date
                    date: doc.data().date.toDate(),
                    createdAt: doc.data().createdAt.toDate(),
                });
            });

            setPosts(fetchedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPosts();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Posts</Text>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <Text style={styles.noPostsText}>No posts yet</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 20,
        textAlign: 'center',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    noPostsText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    },
});

export default HomeScreen;