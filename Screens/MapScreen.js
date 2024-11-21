import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import ClusteredMapView from 'react-native-maps-clustering';
import { Marker } from 'react-native-maps';
import { getAllUsersPosts } from '../Firebase/firestoreHelper';
import Loading from '../ReusableComponent/Loading';
import PostCard from '../ReusableComponent/PostCard';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

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
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        fetchAllPosts();
        getCurrentLocation();
    }, []);

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const currentLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };
            setRegion(currentLocation);  // Update map region
            setUserLocation(location.coords);  // Store user location
        } catch (error) {
            console.error('Error getting location:', error);
        }
    };

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

            {/* callout container */}
            {selectedPost && (
                <>
                    <TouchableOpacity
                        style={styles.overlay}
                        activeOpacity={1}
                        onPress={() => setSelectedPost(null)}
                    />
                    <View style={styles.calloutContainer}>
                        <PostCard
                            post={selectedPost}
                            isMapView={true}
                            userLocation={userLocation}
                            onPress={() => setSelectedPost(null)}
                        />
                    </View>
                </>
            )}
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
        justifyContent: 'center',
        alignItems: 'center',
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
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    calloutContainer: {
        position: 'absolute',
        top: '35%',
        left: '30%',
        width: '40%',
        maxHeight: '40%',
    },
});

export default MapScreen;