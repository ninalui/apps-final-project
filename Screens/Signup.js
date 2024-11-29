import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { auth } from '../Firebase/firebaseSetup'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { writeUserToDB } from '../Firebase/firestoreHelper'
import LottieView from 'lottie-react-native';

export default function Signup({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')
    const [requirementMessage, setRequirementMessage] = useState('');
    const [suggestionMessage, setSuggestionMessage] = useState('');

    const checkPasswordValidation = (text) => {
        let requirements = '';
        let suggestions = [];

        // Requirement
        if (text.length < 6) {
            requirements = '• Password must be at least 6 characters';
        }

        // Suggestions
        if (!text.match(/\d/)) {
            suggestions.push('• Consider adding a number');
        }
        if (!text.match(/[A-Z]/)) {
            suggestions.push('• Consider adding an uppercase letter');
        }
        if (!text.match(/[!@#$%^&*(),.?":{}|<>\-_+=/\\[\];']/)) {
            suggestions.push('• Consider adding a special character');
        }

        return {
            requirements,
            suggestions: suggestions.length > 0 ? 'Suggestions:\n' + suggestions.join('\n') : ''
        };
    };

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
                <View style={styles.animationContainer}>
                    <LottieView
                        source={require('../assets/animations/Animation - 1732842837049.json')}
                        autoPlay
                        loop
                        style={styles.animation}
                    />
                </View>

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
                            const validation = checkPasswordValidation(text);
                            setRequirementMessage(validation.requirements);
                            setSuggestionMessage(validation.suggestions);
                        }}
                        secureTextEntry
                    />
                    {requirementMessage && (
                        <Text style={styles.errorMessage}>
                            {requirementMessage}
                        </Text>
                    )}
                    {suggestionMessage && (
                        <Text style={styles.suggestionMessage}>
                            {suggestionMessage}
                        </Text>
                    )}

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
    );


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FCFFE0',
    },
    animationContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        marginTop: -2,
    },
    animation: {
        width: 150,
        height: 150,
        marginTop: -200,
    },
    formContainer: {
        flex: 1.5,
        justifyContent: 'center',
        marginTop: -400,
    },
    footerContainer: {
        paddingBottom: 20,
    },
    label: {
        marginBottom: 5,
        color: '#000',
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
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
        marginTop: -6,
        lineHeight: 20,
    },
    suggestionMessage: {
        color: '#666',
        fontSize: 12,
        marginTop: -5,
        lineHeight: 15,
    }
});
