import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, Switch } from 'react-native';
import { auth } from '../Firebase/firebaseSetup';
import { updateDB } from '../Firebase/firestoreHelper';
import DateOrTimePicker from './DateOrTimePicker';

export default function NotificationModal({ showModal, toggleModal, notificationOn, setNotificationOn, notificationTime, setNotificationTime }) {
  const [isOn, setIsOn] = useState(notificationOn);
  const [time, setTime] = useState(notificationTime);

  useEffect(() => {
    if (showModal) {
      setIsOn(notificationOn);
      setTime(notificationTime);
    }
  }, [showModal]);

  const toggleSwitch = () => setIsOn(previousState => !previousState);

  function handleCancel() {
    // Reset state to initial values (matching database)
    setIsOn(notificationOn);
    setTime(notificationTime);
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
        if (isOn) {
          // If notifications are on, format time into HH:MM format for database
          const hours = time.getHours().toString().padStart(2, '0');
          const minutes = time.getMinutes().toString().padStart(2, '0');
          formattedTime = `${hours}:${minutes}`;
        }
        // Save notification settings to database
        const notificationSettings = {
          notificationOn: isOn,
          notificationTime: formattedTime,
        };
        await updateDB(currentUser, notificationSettings, 'users');
        setNotificationOn(isOn);
        setNotificationTime(time);
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
            <View style={styles.textContainer}>
              <Text style={styles.text}>
                Enable Notifications
              </Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                trackColor={{ false: 'lightgray', true: 'blue' }}
                thumbColor={isOn ? 'white' : 'white'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isOn}
              />
            </View>
          </View>

          {/* If notifications are on, display input to set time */}
          {isOn &&
            <View style={styles.row}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Time</Text>
              </View>
              <View style={styles.timeInputContainer}>
                <DateOrTimePicker value={time} setValue={setTime} mode='time' />
              </View>
            </View>
          }

          {/* Save and cancel buttons */}
          <View style={styles.row}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.buttonPressed
              ]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>
                CANCEL
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.saveButton,
                pressed && styles.buttonPressed
              ]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>
                SAVE
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