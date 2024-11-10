import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { auth, database } from '../Firebase/firebaseSetup';
import { getDocument } from '../Firebase/firestoreHelper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BreedIcon from '../ReusableComponent/BreedIcon';
import BreedCounter from '../ReusableComponent/BreedCounter';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import NotificationModal from '../ReusableComponent/NotificationModal';
import CustomModal from '../ReusableComponent/CustomModal';
import ImageDisplay from '../ReusableComponent/ImageDisplay';
import ImageModal from '../ReusableComponent/ImageModal';

const ProfileScreen = ({ navigation }) => {
    const [userImageUri, setUserImageUri] = useState('');
    const [username, setUsername] = useState('');
    const [topBreeds, setTopBreeds] = useState([]);
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
    }, [currentUser]);

    return (
        <View style={styles.container}>
            {/* Button for notification settings */}
            <View style={styles.notificationContainer}>
                <Pressable onPress={() => setShowNotifModal(true)}>
                    <MaterialCommunityIcons name="bell" size={24} color="blue" />
                </Pressable>
            </View>
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
            <View style={styles.userImageIcon}>
                <Pressable onPress={() => setShowEditImageModal(true)}>
                    {/* Display if user has photo */}
                    {userImageUri ? (
                        <ImageDisplay imageUri={userImageUri} displayStyle={styles.userImageIcon} />
                    ) : (
                        <MaterialCommunityIcons name="account" size={75} color="black" />
                    )}
                </Pressable>
            </View>

            <CustomModal showModal={showEditImageModal} toggleModal={toggleEditImageModal}>
                <ImageModal
                    userImage={userImageUri}
                    setUserImage={setUserImageUri}
                    toggleEditImageModal={toggleEditImageModal}
                />
            </CustomModal>

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