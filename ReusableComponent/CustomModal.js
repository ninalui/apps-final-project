import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';


export default function NotificationModal({ children, showModal }) {

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={showModal}
    >
      <View style={styles.centeredContainer}>
        <View style={styles.modalContainer}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  textContainer: {
    flex: 1,
  },
  timeInputContainer: {
    flex: 3
  },
  switchContainer: {
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 10,
    alignItems: 'center',
    elevation: 2,  // Android shadow
    shadowColor: '#000',  // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});