import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, Pressable, View, Switch } from 'react-native';
import { auth } from '../Firebase/firebaseSetup';
import { updateDB } from '../Firebase/firestoreHelper';
import DateOrTimePicker from '../ReusableComponent/DateOrTimePicker';
import { globalStyles } from '../styles';
import setUpNotification from './NotificationManager';

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
    // PRompt user to confirm cancel and close modal
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel? Any changes will not be saved.',
      [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          onPress: () => toggleModal(),
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

        // From NotificationManager.js, to create scheduled notification
        await setUpNotification(currentUser);
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }

    // Provide confirm message and close modal
    Alert.alert('Notification settings saved');
    toggleModal();
  }

  return (
    <>
      <Text style={globalStyles.title}>Notification Settings</Text>
      {/* Toggle notifications on and off */}
      <View style={globalStyles.row}>
        <View style={styles.textContainer}>
          <Text style={globalStyles.normalText}>
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
        <View style={globalStyles.row}>
          <View style={styles.textContainer}>
            <Text style={globalStyles.normalText}>Time</Text>
          </View>
          <View style={styles.timeInputContainer}>
            <DateOrTimePicker value={time} setValue={setTime} mode='time' />
          </View>
        </View>
      }

      {/* Save and cancel buttons */}
      <View style={globalStyles.row}>
        <Pressable
          style={({ pressed }) => [
            globalStyles.button,
            globalStyles.fullButton,
            globalStyles.cancelButton,
            pressed && globalStyles.buttonPressed
          ]}
          onPress={handleCancel}
        >
          <Text style={globalStyles.buttonText}>
            CANCEL
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            globalStyles.button,
            globalStyles.fullButton,
            globalStyles.saveButton,
            pressed && globalStyles.buttonPressed
          ]}
          onPress={handleSave}
        >
          <Text style={globalStyles.buttonText}>
            SAVE
          </Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  timeInputContainer: {
    flex: 3
  },
  switchContainer: {
    alignItems: 'flex-end',
  },
});