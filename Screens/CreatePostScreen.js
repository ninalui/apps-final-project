import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
import ImageManager from '../ReusableComponent/imageManager';
import DatePicker from '../ReusableComponent/DatePicker';
import { storage, auth } from '../Firebase/firebaseSetup';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { createPost, updateBreedCount } from '../Firebase/firestoreHelper';
import { Alert } from 'react-native';

const CreatePostScreen = () => {
    const user = auth.currentUser;
    const [breedResult, setBreedResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [shouldResetImage, setShouldResetImage] = useState(false);


    const handleCancel = () => {
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
                        setShowDatePicker(false);
                        setImageUrl(null);
                        setShouldResetImage(true);  // Trigger image reset

                        // Reset the shouldResetImage flag after a short delay
                        setTimeout(() => {
                            setShouldResetImage(false);
                        }, 100);
                    }
                }
            ]
        );
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

        try {
            const postData = {
                imageUrl,
                description,
                date,
                location: {
                    latitude: 0,
                    longitude: 0
                },
                createdAt: new Date(),
                ...(breedResult && {
                    breed: breedResult.labelName,
                    confidence: breedResult.confidence
                })
            };
            // Create post
            const postId = await createPost(user.uid, postData);

            // Update breed count if breed was detected
            if (breedResult?.labelName) {
                await updateBreedCount(user.uid, breedResult.labelName);
            }

            Alert.alert('Success', 'Post created successfully');
            // Add navigation logic here if needed

        } catch (error) {
            console.error('Error saving post:', error);
            Alert.alert('Error', 'Failed to save post. Please try again.');
        }
    };


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
                    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJuYmYiOjE3MzEyMTUzMTUsImV4cCI6MTczMTIxODkxNSwiaXNzIjoiaHR0cHM6Ly93d3cubnlja2VsLmNvbSIsImNsaWVudF9pZCI6IjI4dTd0dGM0bjZiZXkzb2ZzdjlsZXdrcmxrb25zajk1IiwianRpIjoiOURDOTI3NEEwNkMwODVGMjhDNkExMkFBODYxRkExMDIiLCJpYXQiOjE3MzEyMTUzMTUsInNjb3BlIjpbImFwaSJdfQ.YVR9XKO-eWASv0Rg8zzjB_4tdqKmsZbXPC9Cuak12K_B2yNIediSYcMeuDXfIY8SzmQ1HFCRs24egnXajVW8GhU9UzLPRACM3_ycl6B2yUpQzm8L9UAnGId7V0IDN0zgdYHEnbWOo8WMKyZsZEt53vwIrzvgkzW-pk6PvB7TEEFsEDL72unFdN9mWvUUEaU25_b6r9fhXa7OTO_gkf0VFlTlu4-iAySjZR4XbjFYyO7SNKrUhKqQ6M3gkCs45wZLzkAJwpmZcicfjkjtTA3AiWQhemngq4L893eRifzps6jovVbXhnngsrxTFXsMPcx6GZwyHe3v48TdWZUJUmtPBw',
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
                    <DatePicker
                        date={date}
                        setDate={setDate}
                        label=""
                        showDatePicker={showDatePicker}
                        setShowDatePicker={setShowDatePicker}
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
    }
});

export default CreatePostScreen;