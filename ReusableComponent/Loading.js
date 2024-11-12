import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { globalStyles } from '../styles'

export default function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={globalStyles.normalText}>Loading...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})