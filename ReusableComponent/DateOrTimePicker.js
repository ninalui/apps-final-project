import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// from DatePicker.js -- refactored to be able to handle both date and time based on mode prop
const DateOrTimePicker = ({ value, setValue, mode }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [input, setInput] = useState(value || new Date());

    const onInputChange = (event, selectedInput) => {
        const currentInput = selectedInput || value;
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        setInput(currentInput);
        setValue(currentInput);
    };

    const handleDatePickerPress = () => {
        setShowDatePicker(true);
    };

    const handleClose = () => {
        setShowDatePicker(false);
    };

    function formatValue(value) {
        if (!value) {
            return '';
        }
        if (mode === 'time') {
            // Format time as 12-hour clock with AM/PM
            return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        if (mode === 'date') {
            // Format date as 'Day, Month Date, Year'
            return value.toDateString();
        }
        return value.toString();
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.datePickerButton}
                onPress={handleDatePickerPress}
            >
                <TextInput
                    style={styles.dateInput}
                    value={formatValue(input)}
                    placeholder={`Select ${mode}`}
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
                                value={input}
                                mode={mode}
                                display="spinner"
                                onChange={onInputChange}
                                style={styles.datePicker}
                                textColor='#000'
                            />
                        </View>
                    </View>
                </Modal>
            ) : (
                showDatePicker && (
                    <DateTimePicker
                        value={input}
                        mode={mode}
                        display="default"
                        onChange={onInputChange}
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

export default DateOrTimePicker;