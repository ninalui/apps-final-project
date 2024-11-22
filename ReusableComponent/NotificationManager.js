import { View, Text, Button, Alert } from 'react-native'
import React from 'react'
import * as Notifications from 'expo-notifications'

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
    async function scheduleNotifcationHandler() {
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
                    hour: 22,
                    minute: 56,
                    repeats: true,
                    type: Notifications.SchedulableTriggerInputTypes.DAILY,
                },
            });
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

    return (
        // testing buttons to schedule and cancel notifications
        <View>
            <Button title="Schedule Notification" onPress={scheduleNotifcationHandler} />
            <Button title="Cancel All Notifications" onPress={cancelAllNotifications} />
        </View>
    )
}