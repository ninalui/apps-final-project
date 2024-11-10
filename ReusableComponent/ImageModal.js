import { Pressable, Text, Alert, View } from 'react-native'
import React, { useState } from 'react'
import ImageManager from './imageManager'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase/firebaseSetup';
import { updateDB } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup';
import { globalStyles } from '../styles';

export default function ImageModal({ userImage, setUserImage, toggleEditImageModal }) {
  const [newImageUri, setNewImageUri] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUploadImage = async (uri) => {
    setLoading(true);
    try {
      const repsonse = await fetch(uri);
      const blob = await repsonse.blob();

      // Create reference 
      const imageName = `${auth.currentUser.uid}.jpg`;
      const imageRef = ref(storage, `images/${imageName}`);
      const uploadResult = await uploadBytesResumable(imageRef, blob);

      // Get download url
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
      // Update state and database
      setUserImage(uri);
      setNewImageUri('');
      const currentUser = auth.currentUser.uid;
      await updateDB(currentUser, { photoURL: uri }, 'users');
      // Provide feedback to user and close modal
      Alert.alert('Profile picture successfully updated');
      toggleEditImageModal();
    }
    catch (error) {
      console.error('Error updating user image:', error);
    }
  };

  function handleCancelImage() {
    // Prompt user for confirmation, close modal and reset image uri
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
      <Text style={globalStyles.title}>Upload New Profile Photo</Text>
      {/* Upload image handler */}
      <ImageManager onImageTaken={handleUploadImage} />
      {loading && <Text>Uploading image...</Text>}
      {!loading && newImageUri && <Text>Image successfully uploaded</Text>}

      {/* Save and cancel buttons */}
      <View style={globalStyles.row}>
        <Pressable
          style={({ pressed }) => [
            globalStyles.button,
            globalStyles.fullButton,
            globalStyles.cancelButton,
            pressed && globalStyles.buttonPressed
          ]}
          onPress={handleCancelImage}
        >
          <Text style={globalStyles.buttonText}>
            CANCEL
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            globalStyles.button,
            globalStyles.fullButton,
            globalStyles.saveButton,
            pressed && globalStyles.buttonPressed
          ]}
          onPress={() => handleSaveImage(newImageUri)}
        >
          <Text style={globalStyles.buttonText}>
            SAVE
          </Text>
        </Pressable>
      </View>
    </>
  )
}
