import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, RefreshControl } from 'react-native';
import { auth } from '../Firebase/firebaseSetup';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { database } from '../Firebase/firebaseSetup';
import PostCard from '../ReusableComponent/PostCard';
import { deletePost } from '../Firebase/firestoreHelper';

const HomeScreen = ({ navigation, route }) => {
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const user = auth.currentUser;

    const handlePostPress = (post) => {
        const postToEdit = {
            ...post,
            date: post.date instanceof Date ? post.date.toISOString() : post.date,
            createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt
        };

        navigation.navigate('CreatePost', {
            isEditing: true,
            existingPost: postToEdit
        });
    };

    const handleDeletePost = async (postId) => {
        try {
            await deletePost(user.uid, postId);
            // Update local state to remove the deleted post
            setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            Alert.alert('Error', 'Failed to delete post. Please try again.');
        }
    };

    useEffect(() => {
        if (route.params?.newPost) {
            setPosts(currentPosts => [route.params.newPost, ...currentPosts]);
            route.params.newPost = undefined;
        } else if (route.params?.updatedPost) {
            setPosts(currentPosts =>
                currentPosts.map(post =>
                    post.id === route.params.updatedPost.id
                        ? route.params.updatedPost
                        : post
                )
            );
            route.params.updatedPost = undefined;
        }
    }, [route.params?.newPost, route.params?.updatedPost]);


    const fetchPosts = async () => {
        if (!user) return;

        try {
            const postsRef = collection(database, 'users', user.uid, 'posts');
            const q = query(postsRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q).catch(error => {
                // Ignore BloomFilter errors as they don't affect functionality
                if (error.name !== 'BloomFilterError') {
                    console.error('Error fetching posts:', error);
                }
            });

            if (!querySnapshot) return;

            const fetchedPosts = [];
            querySnapshot.forEach((doc) => {
                fetchedPosts.push({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date.toDate(),
                    createdAt: doc.data().createdAt.toDate(),
                });
            });

            setPosts(fetchedPosts);
        } catch (error) {
            // Only log non-BloomFilter errors
            if (error.name !== 'BloomFilterError') {
                console.error('Error fetching posts:', error);
            }
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
                        <PostCard
                            key={post.id}
                            post={post}
                            onPress={() => handlePostPress(post)}
                            onDelete={handleDeletePost} />
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