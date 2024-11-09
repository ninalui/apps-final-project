import { View, Text, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { auth } from '../Firebase/firebaseSetup';
import { getDocument } from '../Firebase/firestoreHelper';

const ProfileScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get current user's UID from auth
                const currentUser = auth.currentUser;
                if (currentUser) {
                    // Get user document from Firestore
                    const userData = await getDocument(currentUser.uid, 'users');
                    if (userData) {
                        setUsername(userData.username);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <View >
            <Text >
                Welcome, {username}
            </Text>
            <Pressable
                onPress={() => navigation.navigate('MyBreed')}
            >
                <Text style={{ color: 'blue' }}>Go to My Breed</Text>
            </Pressable>
        </View >
    );
};

export default ProfileScreen;