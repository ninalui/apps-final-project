import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { globalStyles } from '../styles';

export default function BreedCounter({ breedCount }) {
  return (
    <View style={styles.container}>
      {/* API for breed detection uses database that has 120 breeds */}
      <Text style={globalStyles.normalText}>{breedCount} out of 120 breeds collected</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
})