import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { colors } from '../styles';
import { database } from '../Firebase/firebaseSetup';
import { collection, onSnapshot, collectionGroup, getDocs } from 'firebase/firestore';
import { getCollectionCount } from '../Firebase/firestoreHelper';
import UserImageIcon from '../ReusableComponent/UserImageIcon';
import LoadingAnimation from '../ReusableComponent/LoadingAnimation';

const LeaderboardScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data for users (posts and breeds)
    // Snapshot is of users collection
    const fetchUserData = async (snapshot) => {
        const allUsers = [];
        const promises = snapshot.docs.map(async (doc) => {
            try {
                const data = doc.data();
                const userId = doc.id;
                // Get posts and breeds count from subcollections
                const postsCount = await getCollectionCount(`users/${userId}/posts`);
                const breedsCount = await getCollectionCount(`users/${userId}/breeds`);
                // Calculate score - 60% breeds count and 40% posts count
                const score = (breedsCount * 0.6) + (postsCount * 0.4);
                allUsers.push({
                    id: userId,
                    username: data.username,
                    userImageUri: data.photoURL,
                    breedsCount,
                    postsCount,
                    score
                });
            } catch (error) {
                console.error('Error fetching users: ', error);
            }
        });
        await Promise.all(promises);
        return allUsers;
    };

    // Fetch user data from database
    useEffect(() => {
        const handleUpdate = async (snapshot, source) => {
            try {
                let userData;
                if (source === 'users') {
                    userData = await fetchUserData(snapshot);
                    // fetchUserData needs to be called with the snapshot of users collection
                } else {
                    userData = await fetchUserData(await getDocs(collection(database, 'users')));
                }
                if (userData.length) {
                    // Get top 3 users based on score
                    const topUsers = userData.sort((a, b) => b.score - a.score).slice(0, 3);
                    setUsers(topUsers);
                }
            } catch (error) {
                console.error('Error fetching user data: ', error);
            } finally {
                setLoading(false);
            }
        };

        // Listen for updates in users collection and posts and breeds subcollections
        const unsubscribeUsers = onSnapshot(collection(database, 'users'), (snapshot) => handleUpdate(snapshot, 'users'));
        const unsubscribePosts = onSnapshot(collectionGroup(database, 'posts'), () => handleUpdate(null, 'posts'));
        const unsubscribeBreeds = onSnapshot(collectionGroup(database, 'breeds'), () => handleUpdate(null, 'breeds'));

        return () => {
            unsubscribeUsers();
            unsubscribePosts();
            unsubscribeBreeds();
        };
    }, []);

    if (loading) {
        return <LoadingAnimation />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    // Press to navigate to (other) user's profile screen
                    <Pressable
                        onPress={() => navigation.navigate('OtherProfile', {
                            userId: item.id,
                            userImage: item.userImageUri,
                            username: item.username,
                            breedsCount: item.breedsCount,
                        })}
                    >
                        <View style={styles.rankingContainer}>
                            <Text style={styles.rankingNumber}>{index + 1}</Text>
                            <View style={styles.userContainer}>
                                {/* Display user's image, post count, and breed count */}
                                <UserImageIcon userImageUri={item.userImageUri} />
                                <View style={styles.textContainer}>
                                    <Text style={styles.usernameText}>{item.username}</Text>
                                    <Text style={styles.statsText}>Breeds Collected: {item.breedsCount}</Text>
                                    <Text style={styles.statsText}>Posts: {item.postsCount}</Text>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                )}
            />
        </View>
    );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FCFFE0',
    },
    rankingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        paddingHorizontal: 10,
        width: '100%',
    },
    userContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginLeft: 10,
        width: '85%',
        // Enhanced 3D effect
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    textContainer: {
        marginLeft: 15,
        flex: 1,
    },
    rankingNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        width: 40,
        height: 40,
        textAlign: 'center',
        lineHeight: 40,
        backgroundColor: colors.sage,
        color: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    textContainer: {
        marginLeft: 15,
        flex: 1,
        justifyContent: 'center',
    },
    usernameText: {
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    statsText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
});