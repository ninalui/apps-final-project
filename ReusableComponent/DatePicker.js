import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({ date, setDate, label, showDatePicker, setShowDatePicker }) => {
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        setDate(currentDate);
    };

    const handleDatePickerPress = () => {
        setShowDatePicker(true);
    };

    const handleClose = () => {
        setShowDatePicker(false);
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.datePickerButton}
                onPress={handleDatePickerPress}
            >
                <TextInput
                    style={styles.dateInput}
                    value={date ? date.toDateString() : ''}
                    placeholder="Select date"
                    editable={false}
                />
            </TouchableOpacity>

            {Platform.OS === 'ios' ? (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showDatePicker}
                    onRequestClose={handleClose}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={handleClose}>
                                    <Text style={styles.doneButton}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            <DateTimePicker
                                value={date || new Date()}
                                mode="date"
                                display="spinner"
                                onChange={onDateChange}
                                style={styles.datePicker}
                            />
                        </View>
                    </View>
                </Modal>
            ) : (
                showDatePicker && (
                    <DateTimePicker
                        value={date || new Date()}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    datePickerButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
    },
    dateInput: {
        fontSize: 16,
        color: '#000',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    doneButton: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    datePicker: {
        height: 200,
    },
});

export default DatePicker;