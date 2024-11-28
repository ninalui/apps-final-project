import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { auth } from '../Firebase/firebaseSetup'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { writeUserToDB } from '../Firebase/firestoreHelper'

export default function Signup({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')
    const [passwordStrength, setPasswordStrength] = useState('weak')


    const checkPasswordStrength = (password) => {
        // Initialize variables
        let strength = 0;
        let messages = [];

        // Check length
        if (password.length < 6) {
            messages.push('• Password must be at least 6 characters');
        } else {
            strength += 1;
        }

        // Check for numbers
        if (password.match(/\d/)) {
            strength += 1;
        } else {
            messages.push('• Add at least 1 number');
        }

        // Check for uppercase
        if (password.match(/[A-Z]/)) {
            strength += 1;
        } else {
            messages.push('• Add at least 1 uppercase letter');
        }

        // Check for special characters
        if (password.match(/[!@#$%^&*(),.?":{}|<>\-_+=/\\[\];']/)) {
            strength += 1;
        } else {
            messages.push('• Add at least 1 special character');
        }

        // Set strength level
        if (strength < 2) setPasswordStrength('weak');
        else if (strength < 3) setPasswordStrength('medium');
        else setPasswordStrength('strong');

        // Return messages with line breaks
        return messages.join('\n');
    }

    const handleSignup = async () => {
        // Basic validation
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            // 1. Create authentication record
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Create main user profile
            await writeUserToDB({
                email: user.email,
                username: username,
                displayName: '',
                photoURL: '',
            }, user.uid);

        } catch (error) {
            let errorMessage = 'An error occurred during registration';

            // Handle specific Firebase auth errors
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'The email address entered is invalid.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Email/password accounts are not enabled.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Please enter a password with at least 6 characters.';
                    break;
            }

            Alert.alert('Error', errorMessage);
            console.error('Signup error:', error);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setPasswordMessage(checkPasswordStrength(text));
                        }}
                        secureTextEntry
                    />
                    {passwordMessage ?
                        <Text style={[
                            styles.errorMessage,
                            passwordStrength === 'medium' && styles.warningMessage,
                            passwordStrength === 'strong' && styles.successMessage
                        ]}>
                            {passwordMessage}
                        </Text>
                        : null}

                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSignup}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footerContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.link}>Already Registered? Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FCFFE0',
        justifyContent: 'space-between',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center', // Centers the form vertically
    },
    footerContainer: {
        paddingBottom: 20,
    },
    label: {
        marginBottom: 5,
        color: '#000',
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#BACD92',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    link: {
        color: '#75A47F',
        textAlign: 'center',
        fontSize: 16,
    },
    errorMessage: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        lineHeight: 20,
    },
    warningMessage: {
        color: 'orange',
        lineHeight: 20,
    },
    successMessage: {
        color: 'green',
        lineHeight: 20,
    }
})