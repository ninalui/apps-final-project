import { View, Text, Button, Alert } from 'react-native'
import React from 'react'
import * as Notifications from 'expo-notifications'
import { getDocument } from '../Firebase/firestoreHelper';
import { auth } from '../Firebase/firebaseSetup';

export default function NotificationManager() {

    // Check app has permission to use notifications, if not request permission
    async function verifyPermission() {
        try {
            const permissionResponse = await Notifications.getPermissionsAsync();
            if (permissionResponse.status !== 'granted') {
                const newPermission = await Notifications.requestPermissionsAsync();
                return newPermission.status === 'granted';
            }
            return permissionResponse.status === 'granted';

        } catch (error) {
            console.log('Error getting notification permissions', error);
        }
    }

    // Schedule a notification that repeats daily based on user's settings
    async function scheduleNotifcationHandler(hour, minute) {
        try {
            const hasPermission = await verifyPermission();
            if (!hasPermission) {
                Alert.alert('You need to give permission to use notifications');
                return;
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Notification',
                    body: 'New Notification',
                },
                // for testing, checking that notification triggers at the correct time
                trigger: {
                    hour: hour,
                    minute: minute,
                    repeats: true,
                    type: Notifications.SchedulableTriggerInputTypes.DAILY,
                },
            });
            // for testing, check scheduled notifs
            const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
            console.log('Scheduled Notifications:', JSON.stringify(scheduledNotifications));
        } catch (error) {
            console.log('Error scheduling notification', error);
        }
    }

    // Cancel all scheduled notifications
    async function cancelAllNotifications() {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (error) {
            console.log('Error canceling notifications', error);
        }
    }

    // Fetch user's notification settings from database
    async function fetchNotificationSettings(userId) {
        try {
            const userData = await getDocument(userId, 'users');
            console.log('userData:', userData);
            return {
                notificationOn: userData.notificationOn,
                notificationTime: userData.notificationTime,
            }
        } catch (error) {
            console.error('Error fetching notification settings:', error);
        }
    }

    // Sets up notification based on user's settings
    async function setUpNotification(userId) {
        try {
            const settings = await fetchNotificationSettings(userId);
            if (settings.notificationOn) {
                const [hour, minute] = settings.notificationTime.split(':').map(Number);
                scheduleNotifcationHandler(hour, minute);
            } else {
                cancelAllNotifications();
            }
        } catch (error) {
            console.error('Error setting up user notification:', error);
        }
    }


    return (
        // testing buttons to schedule and cancel notifications
        <View>
            <Button title="Schedule Notification" onPress={scheduleNotifcationHandler} />
            <Button title="Cancel All Notifications" onPress={cancelAllNotifications} />
            <Button title="fetchNotificationSettings" onPress={() => fetchNotificationSettings(auth.currentUser.uid)} />
            <Button title="setUpNotification" onPress={() => setUpNotification(auth.currentUser.uid)} />
        </View>
    )
}