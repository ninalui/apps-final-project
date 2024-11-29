import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { auth } from '../Firebase/firebaseSetup'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import LottieView from 'lottie-react-native';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in successfully:', userCredential.user);
        } catch (error) {
            let errorMessage = 'An error occurred during login.';

            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'The email address entered is invalid.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'The email or password entered is incorrect.';
                    break;
            }

            Alert.alert('Error', errorMessage);
            console.error('Login error:', error);
        }
    }

    const handleForgotPassword = () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        const userEmail = email.trim();

        Alert.alert('Password Reset', `Send a password reset email to ${userEmail}?`,
            [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Send Email',
                    onPress: () => sendResetEmail(email),
                },
            ]);
    }

    const sendResetEmail = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Success', 'If an account exists with this email, a password reset email has been sent.');
        } catch (error) {
            let errorMessage = 'An error occurred while sending the password reset email.';

            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'The email address entered is invalid.';
                    break;
            }

            Alert.alert('Error', errorMessage);
            console.error('Password reset error:', error);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.animationContainer}>
                    <LottieView
                        source={require('../assets/animations/Animation - 1732839937589.json')}
                        autoPlay
                        loop
                        style={styles.animation2}
                    />
                </View>

                <View style={styles.formContainer}>
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
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                    >
                        <Text style={styles.buttonText}>Log In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleForgotPassword}
                    >
                        <Text style={styles.buttonText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footerContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Signup')}
                    >
                        <Text style={styles.link}>New User? Create an account</Text>
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
    },
    animationContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        marginTop: 50,
    },
    animation2: {
        width: 150,
        height: 150,
        marginTop: -100,
    },
    formContainer: {
        flex: 1.5,
        justifyContent: 'center',
        marginTop: -300,
    },
    footerContainer: {
        paddingBottom: 20,
    },
    label: {
        marginBottom: 10,
        color: '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#BACD92',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
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
})