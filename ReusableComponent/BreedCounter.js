import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function BreedCounter() {
  const [breedCount, setBreedCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <Text>{breedCount} out of 120 breeds collected</Text>
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