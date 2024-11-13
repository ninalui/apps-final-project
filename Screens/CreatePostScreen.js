import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import ImageManager from '../ReusableComponent/imageManager';
import DateOrTimePicker from '../ReusableComponent/DateOrTimePicker';
import { storage, auth } from '../Firebase/firebaseSetup';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { createPost, updateBreedCount, updatePost } from '../Firebase/firestoreHelper';
import { Alert } from 'react-native';

const CreatePostScreen = ({ navigation, route }) => {
    const isEditing = route.params?.isEditing || false;
    const existingPost = route.params?.existingPost;

    const user = auth.currentUser;
    const [shouldResetImage, setShouldResetImage] = useState(false);
    const [breedResult, setBreedResult] = useState(existingPost?.breed ? {
        labelName: existingPost.breed,
        confidence: existingPost.confidence
    } : null);
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState(existingPost?.description || '');
    const [date, setDate] = useState(
        existingPost?.date ? new Date(existingPost.date) : new Date()
    );
    const [imageUrl, setImageUrl] = useState(existingPost?.imageUrl || null);



    const handleCancel = () => {
        if (isEditing) {
            navigation.goBack();
        } else {
            Alert.alert(
                "Cancel Post",
                "Are you sure you want to cancel? All entered information will be lost.",
                [
                    {
                        text: "No",
                        style: "cancel"
                    },
                    {
                        text: "Yes",
                        onPress: () => {
                            // Reset all states to initial values
                            setBreedResult(null);
                            setIsLoading(false);
                            setDescription('');
                            setDate(new Date());
                            setImageUrl(null);
                            setShouldResetImage(true);

                            setTimeout(() => {
                                setShouldResetImage(false);
                            }, 100);
                        }
                    }
                ]
            );
        }
    };
    const handleSave = async () => {
        if (!user) {
            Alert.alert('Error', 'You must be logged in to create a post');
            return;
        }

        if (!imageUrl || !description || !date) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (breedResult?.labelName === "Not a Dog!") {
            Alert.alert('Error', 'Please upload a picture of a dog!');
            return;
        }

        try {
            const postData = {
                imageUrl,
                description,
                date: date,
                location: {
                    latitude: 0,
                    longitude: 0
                },
                ...(breedResult && {
                    breed: breedResult.labelName,
                    confidence: breedResult.confidence
                })
            };

            let postId;
            if (isEditing) {
                // Update existing post
                postId = existingPost.id;
                await updatePost(user.uid, postId, postData);
            } else {
                // Create new post
                postData.createdAt = new Date();
                postId = await createPost(user.uid, postData);

                // Update breed count only for new posts
                if (breedResult?.labelName) {
                    await updateBreedCount(user.uid, breedResult.labelName);
                }
            }

            // Reset all states to initial values
            setBreedResult(null);
            setIsLoading(false);
            setDescription('');
            setDate(new Date());
            setImageUrl(null);
            setShouldResetImage(true);  // Trigger image reset

            // Reset the shouldResetImage flag after a short delay
            setTimeout(() => {
                setShouldResetImage(false);
            }, 100);

            // Navigate to HomeScreen with the new post data
            navigation.navigate('MyPosts', {
                updatedPost: isEditing ? {
                    id: postId,
                    ...postData,
                    date: date,
                    createdAt: postData.createdAt?.toISOString(),
                } : undefined,
                newPost: !isEditing ? {
                    id: postId,
                    ...postData,
                    date: date,
                    createdAt: postData.createdAt?.toISOString(),
                } : undefined
            });

        } catch (error) {
            console.error('Error saving post:', error);
            Alert.alert('Error', 'Failed to save post. Please try again.');
        }
    };

    // Update the screen title based on mode
    useEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Post' : 'New Post'
        });
    }, [isEditing]);


    const handleImageTaken = async (uri) => {
        setIsLoading(true);

        try {
            // 1. Upload to Firebase Storage
            console.log('Starting image process with uri:', uri);
            const response = await fetch(uri);
            const blob = await response.blob();

            const imageName = uri.substring(uri.lastIndexOf('/') + 1);
            const imageRef = ref(storage, `images/${imageName}`);

            const uploadTask = uploadBytesResumable(imageRef, blob);
            await uploadTask;

            const downloadURL = await getDownloadURL(imageRef);
            setImageUrl(downloadURL);  // Save the storage URL

            // 2. Call Nyckel API for breed detection
            const apiResponse = await fetch('https://www.nyckel.com/v1/functions/dog-breed-identifier/invoke', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.EXPO_PUBLIC_NYCKEL_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "data": downloadURL
                })
            });

            const breedData = await apiResponse.json();
            setBreedResult({
                labelName: breedData.labelName,
                confidence: breedData.confidence
            });
        } catch (error) {
            console.error('Error processing image:', error);
            console.error('Error stack:', error.stack);
            Alert.alert('Error', 'Failed to process image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Image Picker */}
                <View style={styles.section}>
                    <ImageManager
                        onImageTaken={handleImageTaken}
                        shouldReset={shouldResetImage}
                        existingImageUrl={existingPost?.imageUrl}
                    />
                    {isLoading && <Text>Processing image...</Text>}

                    {/* Breed Result */}
                    {breedResult && (
                        <View style={styles.breedContainer}>
                            <Text style={styles.breedText}>
                                Breed: {breedResult.labelName}
                            </Text>
                            <Text style={styles.confidenceText}>
                                Confidence: {(breedResult.confidence * 100).toFixed(1)}%
                            </Text>
                        </View>
                    )}
                </View>

                {/* Description Input */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DESCRIPTION</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />
                </View>

                {/* Map Placeholder */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>LOCATION</Text>
                    <View style={styles.mapContainer}>
                        <Text>MAP</Text>
                    </View>
                </View>

                {/* Date Picker */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DATE</Text>
                    <DateOrTimePicker
                        value={date}
                        setValue={setDate}
                        mode="date"
                    />
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        styles.cancelButton,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={handleCancel}
                >
                    <Text style={styles.buttonText}>CANCEL</Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        styles.saveButton,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={handleSave}
                >
                    <Text style={styles.buttonText}>SAVE</Text>
                </Pressable>
            </View>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    mapContainer: {
        height: 150,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    breedContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    breedText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    confidenceText: {
        fontSize: 14,
        color: '#666',
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
        paddingVertical: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 10,
        alignItems: 'center',
        elevation: 2,  // Android shadow
        shadowColor: '#000',  // iOS shadow
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    cancelButton: {
        backgroundColor: '#ff4444',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CreatePostScreen;