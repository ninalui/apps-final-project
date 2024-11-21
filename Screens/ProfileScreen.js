import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, database } from '../Firebase/firebaseSetup';
import { getDocument } from '../Firebase/firestoreHelper';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { globalStyles } from '../styles';

import NotificationModal from '../ReusableComponent/NotificationModal';
import CustomModal from '../ReusableComponent/CustomModal';
import ImageModal from '../ReusableComponent/ImageModal';
import BreedIcon from '../ReusableComponent/BreedIcon';
import BreedCounter from '../ReusableComponent/BreedCounter';
import UserImageIcon from '../ReusableComponent/UserImageIcon';

const ProfileScreen = ({ navigation }) => {
    const [userImageUri, setUserImageUri] = useState('');
    const [username, setUsername] = useState('');
    const [topBreeds, setTopBreeds] = useState([]);
    const [breedCollection, setBreedCollection] = useState([]);
    const currentUser = auth.currentUser.uid;

    const [showNotifModal, setShowNotifModal] = useState(false);
    function toggleNotifModal() {
        setShowNotifModal(!showNotifModal);
    };
    const [notificationOn, setNotificationOn] = useState(false);
    const [notificationTime, setNotificationTime] = useState(new Date());

    const [showEditImageModal, setShowEditImageModal] = useState(false);
    function toggleEditImageModal() {
        setShowEditImageModal(!showEditImageModal);
    };

    const createDateFromTimeString = (timeString) => {
        if (!timeString) {
            return new Date();
        }
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    };

    // Fetch user data from database
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get current user's UID from auth
                const currentUser = auth.currentUser;
                if (currentUser) {
                    // Get user document from Firestore
                    const userData = await getDocument(currentUser.uid, 'users');
                    if (userData) {
                        setUserImageUri(userData.photoURL);
                        setUsername(userData.username);
                        setNotificationOn(userData.notificationOn);
                        setNotificationTime(userData.notificationTime ? createDateFromTimeString(userData.notificationTime) : new Date());
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    // Fetch user's top breeds from database
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(database, `users/${currentUser}/breeds`),
            (snapshot) => {
                const breeds = snapshot.docs.map(doc => doc.data());

                // Save all breeds to state to show collection
                const allBreeds = breeds.map(breed => ({ breedName: breed.breedName }));
                setBreedCollection(allBreeds);

                const sortedBreeds = breeds.sort((a, b) => b.count - a.count).slice(0, 3);
                const usersTopBreeds = sortedBreeds.map(breed => ({ breedName: breed.breedName }));

                const fetchBreedImages = async () => {
                    const postsSubcollectionPath = `users/${currentUser}/posts`;
                    for (const breed of usersTopBreeds) {
                        const postsQuery = query(
                            collection(database, postsSubcollectionPath),
                            where('breed', '==', breed.breedName), // Only get posts of top breeds
                        );
                        const post = await getDocs(postsQuery);
                        if (post.docs.length > 0) {
                            // Get image url from the first post
                            const postImage = post.docs[0].data().imageUrl;
                            breed.breedImage = postImage;
                        }
                    }
                    setTopBreeds(usersTopBreeds);
                }
                fetchBreedImages();
            },
            (error) => {
                console.error('Error fetching top breeds:', error);
            }
        );
        return () => unsubscribe();
    }, []);

    // Logout header button
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    style={({ pressed }) => [
                        pressed && globalStyles.buttonPressed
                    ]}
                    onPress={() => auth.signOut()}
                >
                    <MaterialCommunityIcons name="logout" size={24} color="black" />
                </Pressable>
            ),
        });
    }, []);

    return (
        <View style={styles.container}>
            {/* Button for notification settings */}
            <View style={styles.notificationContainer}>
                <Pressable
                    style={({ pressed }) => [
                        globalStyles.button,
                        pressed && globalStyles.buttonPressed
                    ]}
                    onPress={() => setShowNotifModal(true)}
                >
                    <MaterialCommunityIcons name="bell" size={24} color="white" />
                </Pressable>
            </View>
            {/* Display notification settings modal on press */}
            <CustomModal showModal={showNotifModal} toggleModal={toggleNotifModal}>
                <NotificationModal
                    showModal={showNotifModal}
                    toggleModal={toggleNotifModal}
                    notificationOn={notificationOn}
                    setNotificationOn={setNotificationOn}
                    notificationTime={notificationTime}
                    setNotificationTime={setNotificationTime}
                />
            </CustomModal>

            {/* User image */}
            <View>
                <Pressable
                    style={({ pressed }) => [
                        pressed && globalStyles.buttonPressed
                    ]}
                    onPress={() => setShowEditImageModal(true)}>
                    {/* Display if user has photo, otherwise show icon */}
                    <UserImageIcon userImageUri={userImageUri} />
                    <View style={styles.pencilIcon}>
                        <MaterialCommunityIcons name="pencil" size={24} color="white" />
                    </View>
                </Pressable>
            </View>
            {/* Pressing picture displays modal for uploading new picture */}
            <CustomModal showModal={showEditImageModal} toggleModal={toggleEditImageModal}>
                <ImageModal
                    userImage={userImageUri}
                    setUserImage={setUserImageUri}
                    toggleEditImageModal={toggleEditImageModal}
                />
            </CustomModal>

            {/* User name */}
            <Text style={globalStyles.boldText}>
                Welcome, {username}
            </Text>
            {/* User email */}
            <Text style={globalStyles.normalText}>
                Email: {auth.currentUser.email}
            </Text>

            {/* Breed collection progress */}
            <BreedCounter breedCount={breedCollection.length} />

            {/* Navigate to breed collection */}
            <Pressable
                style={({ pressed }) => [
                    globalStyles.button,
                    pressed && globalStyles.buttonPressed,
                    styles.spacer,
                ]}
                onPress={() => navigation.navigate('MyBreed', { breeds: breedCollection, breedCount: breedCollection.length })}
            >
                <Text style={globalStyles.buttonText}>Go to My Breed Collection</Text>
            </Pressable>

            {/* Top 3 breeds */}
            <Text style={globalStyles.boldText}>
                Top Breeds
            </Text>
            <View style={styles.topBreedIconsContainer}>
                {topBreeds.map((breed, index) => (
                    <BreedIcon key={index} breedName={breed.breedName} breedImage={breed.breedImage} />
                ))}
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
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 8,
        margin: 10,
    },
    topBreedIconsContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    spacer: {
        marginBottom: 15,
    },
    pencilIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'gray',
        opacity: 0.9,
        borderRadius: 100,
        padding: 5,
    },
}); 