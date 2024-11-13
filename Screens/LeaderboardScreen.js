import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { globalStyles } from '../styles';
import { database } from '../Firebase/firebaseSetup';
import { collection, onSnapshot } from 'firebase/firestore';
import { getCollectionCount } from '../Firebase/firestoreHelper';
import UserImageIcon from '../ReusableComponent/UserImageIcon';

const LeaderboardScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);

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
        const unsubscribe = onSnapshot(collection(database, 'users'), async (snapshot) => {
            try {
                const userData = await fetchUserData(snapshot);
                if (userData.length) {
                    // Sort users by score and get top 3
                    const topUsers = userData.sort((a, b) => b.score - a.score).slice(0, 3);
                    setUsers(topUsers);
                }
            } catch (error) {
                console.error('Error fetching user data: ', error);
            }
        });
        return unsubscribe;
    }, []);

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
                            <Text style={globalStyles.boldText}>{index + 1}.</Text>
                            <View style={styles.userContainer}>
                                {/* Display user's image, post count, and breed count */}
                                <UserImageIcon userImageUri={item.userImageUri} />
                                <View style={styles.textContainer}>
                                    <Text style={globalStyles.boldText}>{item.username}</Text>
                                    <Text style={globalStyles.normalText}>Breeds Collected: {item.breedsCount}</Text>
                                    <Text style={globalStyles.normalText}>Posts: {item.postsCount}</Text>
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
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        padding: 10,
        margin: 10,
        backgroundColor: '#fff',
    },
    textContainer: {
        marginLeft: 10,
        justifyContent: 'center',
    }
});
