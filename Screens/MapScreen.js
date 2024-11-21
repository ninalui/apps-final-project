import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Dimensions, TouchableOpacity, Text } from 'react-native';
import ClusteredMapView from 'react-native-maps-clustering';
import { Marker } from 'react-native-maps';
import { getAllUsersPosts } from '../Firebase/firestoreHelper';
import Loading from '../ReusableComponent/Loading';
import PostCard from '../ReusableComponent/PostCard';
import { MaterialIcons } from '@expo/vector-icons';

const MapScreen = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [region, setRegion] = useState({
        latitude: 49.2827,  // Vancouver coordinates
        longitude: -123.1207,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        fetchAllPosts();
    }, []);

    const fetchAllPosts = async () => {
        try {
            setIsLoading(true);
            const allPosts = await getAllUsersPosts();
            setPosts(allPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkerPress = (post) => {
        setSelectedPost(post);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <View style={styles.container}>
            <ClusteredMapView
                style={styles.map}
                data={posts}
                initialRegion={region}
                onRegionChangeComplete={setRegion}
                clusterColor="#ff4444"
                clusterTextColor="#ffffff"
                clusterBorderColor="#ff4444"
                clusterBorderWidth={4}
                extent={512}
                nodeSize={64}
                spiralEnabled={true}
                showsUserLocation={true}
            >
                {posts.map(post => (
                    <Marker
                        key={post.id}
                        coordinate={post.location}
                        onPress={() => handleMarkerPress(post)}
                    >
                        <View style={styles.markerContainer}>
                            <MaterialIcons name="pets" size={24} color="#ff4444" />
                        </View>
                    </Marker>
                ))}
            </ClusteredMapView>

            {/* Post Modal */}
            <Modal
                visible={selectedPost !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedPost(null)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        onPress={() => setSelectedPost(null)}
                        activeOpacity={0.8}
                    />
                    <View style={styles.centeredModalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setSelectedPost(null)}
                            >
                                <MaterialIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        {selectedPost && (
                            <PostCard
                                post={selectedPost}
                                isMapView={true}
                                onPress={() => setSelectedPost(null)}
                            />
                        )}
                    </View>
                </View>
            </Modal>
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
    },
    markerContainer: {
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#ff4444',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: Dimensions.get('window').height * 0.8,
    },
    modalHeader: {
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#ccc',
        borderRadius: 2,
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 20,
    },
});

export default MapScreen;