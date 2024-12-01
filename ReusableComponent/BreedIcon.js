import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import ImageDisplay from './ImageDisplay'
import { Dimensions } from 'react-native';
import { colors } from '../styles';
const { width } = Dimensions.get('window');
import Octicons from '@expo/vector-icons/Octicons';

export default function BreedIcon({ breedImage, breedName }) {
  return (
    <View style={styles.breedCard}>
      <View style={styles.breedImage}>
        {breedImage ? <ImageDisplay imageUri={breedImage} /> : (
          <View style={styles.mysteryIcon}>
            <Octicons name="question" size={50} color={colors.forest} />
          </View>
        )}
      </View>
      <Text style={styles.breedName}>
        {breedName.includes('Mystery') ? 'Mystery Breed' : breedName}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  breedCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 17,
    alignItems: 'center',
    width: (width / 3) - 18,
    marginHorizontal: 5,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  breedImage: {
    width: 90,
    height: 70,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  breedName: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.forest,
    fontWeight: '500',
  },
  mysteryIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});