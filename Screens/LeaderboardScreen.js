import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { globalStyles } from '../styles';
import { database } from '../Firebase/firebaseSetup';
import { collection, onSnapshot } from 'firebase/firestore';
import { getCollectionCount } from '../Firebase/firestoreHelper';
import UserImageIcon from '../ReusableComponent/UserImageIcon';

const LeaderboardScreen = ({ navigation }) => {

    // sample data
    const users = [
        {
            id: '1',
            userImageUri: '',
            username: 'User1',
            breedsCount: 10,
            postsCount: 5,
        },
        {
            id: '2',
            userImageUri: '',
            username: 'User2',
            breedsCount: 8,
            postsCount: 3,
        },
        {
            id: '3',
            userImageUri: '',
            username: 'User3',
            breedsCount: 7,
            postsCount: 2,
        },
    ];

return (
    <View style={styles.container}>
        <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
                // Press to navigate to (other) user's profile screen
                <Pressable>
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
