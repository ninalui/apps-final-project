import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
import ImageManager from '../ReusableComponent/imageManager';
import DatePicker from '../ReusableComponent/DatePicker';
import { storage } from '../Firebase/firebaseSetup';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';


const CreatePostScreen = () => {
    const [breedResult, setBreedResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);



    const handleCancel = () => {
        // cancel logic 
        console.log('Cancel pressed');
    };

    const handleSave = () => {
        // save logic
        console.log('Save pressed');
    };

    const handleImageTaken = async (uri) => {
        setIsLoading(true);

        try {
            // 1. Fetch and verify blob
            console.log('Starting image process with uri:', uri);
            const response = await fetch(uri);
            const blob = await response.blob();
            console.log('Blob details:', {
                size: blob.size,
                type: blob.type
            });

            // Create reference with original image name
            const imageName = uri.substring(uri.lastIndexOf('/') + 1);
            console.log('Image name:', imageName);

            const imageRef = ref(storage, `images/${imageName}`);
            console.log('Storage reference created:', {
                bucket: imageRef.bucket,
                fullPath: imageRef.fullPath,
                name: imageRef.name
            });

            // Upload image
            console.log('Starting upload...');
            const uploadTask = uploadBytesResumable(imageRef, blob);
            console.log('Upload task created:', uploadTask);

            await uploadTask;
            // Remove this line as uploadResult is not defined
            // console.log('Upload successful:', uploadResult);  

            console.log('Getting download URL...');
            const downloadURL = await getDownloadURL(imageRef);
            console.log('Download URL:', downloadURL);

            // Rest of the code...

        } catch (error) {
            console.error('Error processing image:', error);
            console.error('Error stack:', error.stack);  // Add stack trace
        } finally {
            setIsLoading(false);
        }
    };

    // write to post collection (create post function in firebasehelper)
    // write to breed collection

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Image Picker */}
                <View style={styles.section}>
                    <ImageManager onImageTaken={handleImageTaken} />
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