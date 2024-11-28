import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, database } from '../Firebase/firebaseSetup';
import { getDocument } from '../Firebase/firestoreHelper';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { globalStyles, colors } from '../styles';

import NotificationModal from '../ReusableComponent/NotificationModal';
import CustomModal from '../ReusableComponent/CustomModal';
import ImageModal from '../ReusableComponent/ImageModal';
import BreedIcon from '../ReusableComponent/BreedIcon';
import BreedCounter from '../ReusableComponent/BreedCounter';
import UserImageIcon from '../ReusableComponent/UserImageIcon';
import Loading from '../ReusableComponent/Loading';
import LoadingAnimation from '../ReusableComponent/LoadingAnimation';

const ProfileScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
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
                    setLoading(false);
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

    if (loading) {
        return <LoadingAnimation />;
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Notification Button */}
                <Pressable
                    style={styles.notificationButton}
                    onPress={() => setShowNotifModal(true)}
                >
                    <MaterialCommunityIcons name="bell" size={24} color="white" />
                </Pressable>

                {/* User Info Section */}
                <View style={styles.userInfoContainer}>
                    <View style={styles.imageContainer}>
                        <Pressable onPress={() => setShowEditImageModal(true)}>
                            <UserImageIcon userImageUri={userImageUri} size={100} />
                            <View style={styles.pencilIcon}>
                                <MaterialCommunityIcons name="pencil" size={20} color="white" />
                            </View>
                        </Pressable>
                    </View>
                    <Text style={styles.username}>Welcome, {username}</Text>
                    <Text style={styles.email}>{auth.currentUser.email}</Text>
                </View>

                {/* Breed Counter Component */}
                <BreedCounter breedCount={breedCollection.length} />

                {/* Collection Button */}
                <Pressable
                    style={({ pressed }) => [
                        styles.collectionButton,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={() => navigation.navigate('MyBreed', {
                        breeds: breedCollection,
                        breedCount: breedCollection.length
                    })}
                >
                    <Text style={styles.buttonText}>View Collection</Text>
                </Pressable>

                {/* Top Breeds Section */}
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>Top Breeds</Text>
                </View>
                <View style={[
                    styles.topBreedIconsContainer,
                    topBreeds.length === 1 && styles.singleBreedContainer
                ]}>
                    {topBreeds.map((breed, index) => (
                        <BreedIcon
                            key={index}
                            breedName={breed.breedName}
                            breedImage={breed.breedImage}
                        />
                    ))}
                </View>

                {/* Modals remain the same */}
                <CustomModal showModal={showNotifModal} toggleModal={toggleNotifModal}>
                    <NotificationModal {...{ showNotifModal, toggleNotifModal, notificationOn, setNotificationOn, notificationTime, setNotificationTime }} />
                </CustomModal>
                <CustomModal showModal={showEditImageModal} toggleModal={toggleEditImageModal}>
                    <ImageModal
                        userImage={userImageUri}
                        setUserImage={setUserImageUri}
                        toggleEditImageModal={toggleEditImageModal}
                    />
                </CustomModal>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.cream,
    },
    content: {
        padding: 20,
        paddingTop: 40,
        alignItems: 'center',
    },
    notificationButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: colors.forest,
        borderRadius: 30,
        padding: 12,
        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    userInfoContainer: {
        alignItems: 'center',
        marginBottom: 25,
        width: '100%',
    },
    imageContainer: {
        marginBottom: 15,
        position: 'relative',
    },
    pencilIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: colors.sage,
        opacity: 0.9,
        borderRadius: 20,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.forest,
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    collectionButton: {
        backgroundColor: colors.forest,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        width: '90%',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitleContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        color: colors.forest,

    },
    topBreedIconsContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    singleBreedContainer: {
        justifyContent: 'center',
    },
});

export default ProfileScreen;
