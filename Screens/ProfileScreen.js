import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { auth } from '../Firebase/firebaseSetup';
import { getDocument } from '../Firebase/firestoreHelper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BreedIcon from '../ReusableComponent/BreedIcon';
import BreedCounter from '../ReusableComponent/BreedCounter';

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
        <View style={styles.container}>
            {/* Button for notification settings */}
            <View style={styles.notificationContainer}>
                <Pressable>
                    <MaterialCommunityIcons name="bell" size={24} color="blue" />
                </Pressable>
            </View>


            {/* User image */}
            {/* Placeholder, need to fetch from database */}
            <View style={styles.userImageIcon}>
            </View>

            {/* User name */}
            <Text style={styles.boldText}>
                Welcome, {username}
            </Text>

            {/* Breed collection progress */}
            {/* Placeholder - making reusable component */}
            <BreedCounter />

            {/* Navigate to breed collection */}
            <Pressable
                onPress={() => navigation.navigate('MyBreed')}
            >
                <Text style={{ color: 'blue' }}>Go to My Breed Collection</Text>
            </Pressable>

            {/* Top 3 breeds */}
            {/* Placeholder - making reusable component */}
            <Text style={styles.boldText}>
                Top Breeds
            </Text>
            <View style={styles.topBreedIconsContainer}>
                <BreedIcon />
                <BreedIcon />
                <BreedIcon />
            </View>
        </View>

    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationContainer: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    userImageIcon: {
        width: 100,
        height: 100,
        borderRadius: 100,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topBreedIconsContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    boldText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
}); 