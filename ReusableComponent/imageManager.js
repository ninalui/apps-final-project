import { View, StyleSheet, Pressable, Image } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

export default function ImageManager({ onImageTaken }) {
    const [permission, requestPermission] = ImagePicker.useCameraPermissions();
    const [imageUri, setImageUri] = useState(null);

    const verifyPermission = async () => {
        if (permission?.granted) {
            return true;
        }
        const permissionResult = await requestPermission();
        return permissionResult.granted;
    };

    const handleCameraPress = async () => {
        try {
            if (Platform.OS === 'ios') {
                const hasPermission = await verifyPermission();
                if (!hasPermission) {
                    Alert.alert('Permission Required', 'You need to enable camera permissions to take photos');
                    return;
                }
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                setImageUri(uri);
                onImageTaken(uri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert("Error", "Failed to take photo. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            {!imageUri ? (
                <Pressable
                    style={({ pressed }) => [
                        styles.uploadContainer,
                        pressed && styles.pressed
                    ]}
                    onPress={handleCameraPress}
                >
                    <MaterialIcons name="camera-alt" size={40} color="#666" />
                </Pressable>
            ) : (
                <View style={styles.imagePreviewContainer}>
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.preview}
                    />
                    <Pressable
                        style={styles.changePhotoButton}
                        onPress={handleCameraPress}
                    >
                        <MaterialIcons name="camera-alt" size={24} color="#fff" />
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
    },
    uploadContainer: {
        width: '100%',
        height: 200,
        borderWidth: 2,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    pressed: {
        opacity: 0.7,
        backgroundColor: '#e5e5e5',
    },
    imagePreviewContainer: {
        width: '100%',
        height: 200,
        position: 'relative',
    },
    preview: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    changePhotoButton: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 20,
    }
});