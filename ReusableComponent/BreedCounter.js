import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '../styles';

export default function BreedCounter({ breedCount }) {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>
          {/* API for breed detection uses database that has 120 breeds */}
          {breedCount} <Text style={styles.statValueLight}>/ 120</Text>
        </Text>
        <Text style={styles.statLabel}>Breeds Collected</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  statsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.forest,
  },
  statValueLight: {
    fontSize: 24,
    fontWeight: 'normal',
    color: '#666',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
});