import { View, StyleSheet } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ImageDisplay from './ImageDisplay'

export default function UserImageIcon({ userImageUri }) {
  return (
    <View style={styles.userImageIcon}>
      {/* Display if user has photo, otherwise show icon */}
      {userImageUri ? (
        <ImageDisplay imageUri={userImageUri} displayStyle={styles.userImageIcon} />
      ) : (
        <MaterialCommunityIcons name="account" size={75} color="black" />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  userImageIcon: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 