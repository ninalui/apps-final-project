import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, Switch } from 'react-native';
import { auth } from '../Firebase/firebaseSetup';
import { updateDB } from '../Firebase/firestoreHelper';

export default function NotificationModal({ showModal, toggleModal }) {
  const [notificationOn, setNotificationOn] = useState(false);
  const toggleSwitch = () => setNotificationOn(previousState => !previousState);
  const [notificationTime, setNotificationTime] = useState(new Date());

  function handleCancel() {
    // Alert user to confirm cancel then close modal on confirmation
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel? Any changes will not be saved.',
      [
        {
          text: 'Yes',
          onPress: () => toggleModal(),
        },
        {
          text: 'No',
        },
      ],
    );
  }

  async function handleSave() {
    try {
      const currentUser = auth.currentUser.uid;
      if (currentUser) {
        // Time is set to null if notifications are off
        let formattedTime = null;
        if (notificationOn) {
          // If notifications are on, format time into HH:MM format for database
          const hours = notificationTime.getHours().toString().padStart(2, '0');
          const minutes = notificationTime.getMinutes().toString().padStart(2, '0');
          formattedTime = `${hours}:${minutes}`;
        }
        // Save notification settings to database
        const notificationSettings = {
          notificationOn: notificationOn,
          notificationTime: formattedTime,
        };
        console.log(notificationSettings);
        await updateDB(currentUser, notificationSettings, 'users');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }

    // Provide confirm message and close modal
    Alert.alert(
      'Save',
      'Notification settings saved.',
      [
        {
          text: 'OK',
          onPress: () => toggleModal(),
        },
      ],
    );
  }

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={showModal}
    >
      <View style={styles.centeredContainer}>
        <View style={styles.modalContainer}>
          {/* Toggle notifications on and off */}
          <View style={styles.row}>
            <Text style={{ padding: 10 }}>
              Notifications
            </Text>

            <View style={{ padding: 10 }}>
              {notificationOn ? <Text>On</Text> : <Text>Off</Text>}
            </View>

            <Switch
              trackColor={{ false: 'lightgray', true: 'blue' }}
              thumbColor={notificationOn ? 'white' : 'white'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={notificationOn}
            />
          </View>

          {/* If notifications are on, display input to set time */}
          {notificationOn &&
            <View style={styles.row}>
              <Text style={{ padding: 10 }}>Time</Text>
              {/* placeholder - to update with DateTimePicker */}
              <Text>{notificationTime.toLocaleTimeString()}</Text>
            </View>
          }

          {/* Save and cancel buttons */}
          <View style={styles.row}>
            <Pressable
              onPress={handleSave}
            >
              <Text style={{ color: 'blue', padding: 10 }}>
                Save
              </Text>
            </Pressable>

            <Pressable
              onPress={handleCancel}
            >
              <Text style={{ color: 'blue', padding: 10 }}>
                Cancel
              </Text>
            </Pressable>
          </View>

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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  }
});