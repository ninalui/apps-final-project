import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    Text, StyleSheet,
    RefreshControl,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { auth } from '../Firebase/firebaseSetup';
import PostCard from '../ReusableComponent/PostCard';
import { deletePost, fetchUserPosts } from '../Firebase/firestoreHelper';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation, route }) => {
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const user = auth.currentUser;
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        const filtered = posts.filter(post => {
            const searchLower = searchQuery.toLowerCase();
            return (
                (post.breed && post.breed.toLowerCase().includes(searchLower)) ||
                post.description.toLowerCase().includes(searchLower)
            );
        });

        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'newest'
                ? dateB - dateA
                : dateA - dateB;
        });

        setFilteredPosts(sorted);
    }, [searchQuery, posts, sortOrder]);

    const toggleSortOrder = () => {
        setSortOrder(current => current === 'newest' ? 'oldest' : 'newest');
    };

    const handlePostPress = (post) => {
        const postToEdit = {
            ...post,
            id: post.id,
            breed: post.breed,
            confidence: post.confidence,
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
            // Use the deletePost helper function that handles both post and breed count
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
            const fetchedPosts = await fetchUserPosts(user.uid);
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

            {/* Search and Sort Section */}
            <View style={styles.filterContainer}>
                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={24} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by breed or description..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={toggleSortOrder}
                >
                    <MaterialIcons
                        name={sortOrder === 'newest' ? 'arrow-downward' : 'arrow-upward'}
                        size={24}
                        color="#666"
                    />
                    <Text style={styles.sortButtonText}>
                        {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onPress={() => handlePostPress(post)}
                            onDelete={handleDeletePost}
                        />
                    ))
                ) : (
                    <Text style={styles.noPostsText}>
                        {searchQuery ? 'No matching posts found' : 'No posts yet'}
                    </Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCFFE0',
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
    filterContainer: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 8,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    sortButtonText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
});

export default HomeScreen;