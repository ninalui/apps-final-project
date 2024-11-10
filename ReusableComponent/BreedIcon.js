import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import ImageDisplay from './ImageDisplay'

export default function BreedIcon({ breedImage, breedName }) {
  return (
    <View style={styles.container}>
      <View style={styles.breedImage}>
        <ImageDisplay imageUri={breedImage} />
      </View>
      <Text style={styles.breedText}>{breedName}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  breedImage: {
    width: 90,
    height: 70,
    margin: 10,
    marginBottom: 0,
  }, 
  breedText: {
    fontSize: 16,
    padding: 5,
  }
})