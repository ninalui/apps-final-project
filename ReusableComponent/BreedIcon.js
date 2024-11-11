import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import ImageDisplay from './ImageDisplay'
import { Dimensions } from 'react-native';
import { globalStyles } from '../styles';
const { width } = Dimensions.get('window');
import Octicons from '@expo/vector-icons/Octicons';

export default function BreedIcon({ breedImage, breedName }) {
  return (
    <View style={styles.container}>
      <View style={styles.breedImage}>
        {breedImage ? <ImageDisplay imageUri={breedImage} /> : (
          <View style={styles.mysteryIcon}>
            <Octicons name="question" size={50} color="black" />
          </View>)}
      </View>
      <View style={{ alignSelf: 'center' }}>
        <Text style={[globalStyles.normalText, styles.breedText]}>
          {breedName.includes('Mystery') ? 'Mystery Breed' : breedName}
        </Text>
      </View>
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
    width: (width / 3) - 15,
  },
  breedImage: {
    width: 90,
    height: 70,
    margin: 10,
    marginBottom: 0,
  },
  breedText: {
    padding: 5,
    textAlign: 'center',
  },
  mysteryIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})