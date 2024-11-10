import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { auth } from '../Firebase/firebaseSetup'
import { getAllDocuments } from '../Firebase/firestoreHelper'

export default function BreedCounter() {
  const [breedCount, setBreedCount] = React.useState(0);
  const currentUser = auth.currentUser.uid;

  // Fetch breed count from database
  useEffect(() => {
    const fetchBreedCount = async () => {
      try {
        const breedSubcollectionPath = `users/${currentUser}/breeds`;
        const breeds = await getAllDocuments(breedSubcollectionPath);
        setBreedCount(breeds.length);
      } catch (error) {
        console.error('Error fetching breed count: ', error);
      }
    }
    fetchBreedCount();
    }, []);

  return (
    <View style={styles.container}>
      {/* API for breed detection uses database that has 120 breeds */}
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