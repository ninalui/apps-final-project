import { Pressable, Text, Alert, View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import ImageManager from './imageManager'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/firebaseSetup';
import { updateDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup';

export default function ImageModal({ userImage, setUserImage, toggleEditImageModal }) {
  const [newImageUri, setNewImageUri] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUploadImage = async (uri) => {
    setLoading(true);
    try {
      const repsonse = await fetch(uri);
      const blob = await repsonse.blob();

      // create reference 
      const imageName = `${auth.currentUser.uid}.jpg`;
      const imageRef = ref(storage, `images/${imageName}`);
      const uploadResult = await uploadBytesResumable(imageRef, blob);

      // get download url
      const downloadURL = await getDownloadURL(uploadResult.ref);
      setNewImageUri(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
      console.log('Image uploaded');
    }
  };

  const handleSaveImage = async (uri) => {
    try {
      if (loading) {
        Alert.alert('Please wait until the image is finished uploading');
        return;
      }
      if (!newImageUri) {
        Alert.alert('Please upload an image');
        return;
      }
      setUserImage(uri);
      setNewImageUri('');
      const currentUser = auth.currentUser.uid;
      await updateDB(currentUser, { photoURL: uri }, 'users');
      Alert.alert('Profile picture successfully updated');
      toggleEditImageModal();
    }
    catch (error) {
      console.error('Error updating user image:', error);
    }
  };

  function handleCancelImage() {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel? Any changes will not be saved.',
      [
        {
          text: 'Yes',
          onPress: () => {
            setNewImageUri('');
            toggleEditImageModal();
          },
        },
        {
          text: 'No',
        },
      ],
    );
  };

  return (
    <>
      <Text style={styles.title}>Upload New Profile Photo</Text>
      {/* Upload image */}
      <ImageManager onImageTaken={handleUploadImage} />
      {loading ? <Text>Uploading image...</Text> : <Text>Image successfully uploaded</Text>}

      {/* Save and cancel buttons */}
      <View style={styles.row}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.cancelButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleCancelImage}
        >
          <Text style={styles.buttonText}>
            CANCEL
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.saveButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => handleSaveImage(newImageUri)}
        >
          <Text style={styles.buttonText}>
            SAVE
          </Text>
        </Pressable>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
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