import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

export default function BreedIcon({ breedImage, breedName }) {

  // todo: download image from database

  return (
    <View style={styles.container}>
      <View style={styles.breedImage}>
        {/* todo: update with image from database */}
        <Image source={{uri: breedImage}} />
      </View>
      <Text>{breedName}</Text>
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
  }
})