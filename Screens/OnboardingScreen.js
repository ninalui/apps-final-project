import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SLIDER_WIDTH = Dimensions.get('window').width;

export default function OnboardingScreen({ navigation }) {
    const [activeSlide, setActiveSlide] = useState(0);

    const slides = [
        {
            title: "Welcome to PupScout",
            text: "Identify and log every breed with our AI-powered technology.",
            image: require('../assets/OnboardingPics/1.png')
        },
        {
            title: "Spot & Plot",
            text: "Discover posts at hotspots and plot your next dog adventure!",
            image: require('../assets/OnboardingPics/2.png')
        },
        {
            title: "Join the Community",
            text: "Compete, collect, and climb the ranks among PupScout enthusiasts!",
            image: require('../assets/OnboardingPics/3.png')
        },
    ];

    const handleScroll = (event) => {
        if (!event || !event.nativeEvent) return;

        const contentOffset = event.nativeEvent.contentOffset;
        const viewSize = event.nativeEvent.layoutMeasurement;

        if (!viewSize.width) return;

        const newIndex = Math.floor(contentOffset.x / viewSize.width);

        if (newIndex >= 0 && newIndex < slides.length && newIndex !== activeSlide) {
            setActiveSlide(newIndex);
        }
    };

    const handleGetStarted = async () => {
        try {
            await AsyncStorage.setItem('hasSeenOnboarding', 'true');
            navigation.replace('Signup');
        } catch (error) {
            console.error('Error saving onboarding status:', error);
            navigation.replace('Signup');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
            >
                {slides.map((slide, index) => (
                    <View key={index} style={styles.slide}>
                        <Image
                            source={slide.image}
                            style={[
                                styles.image,
                                index === 0 && styles.firstImage
                            ]}
                            resizeMode={index === 0 ? "contain" : "cover"}
                        />
                        <View style={[
                            styles.textContainer,
                            index === 0 && styles.firstSlideTextContainer
                        ]}>
                            <Text style={styles.title}>{slide.title}</Text>
                            <Text style={styles.text}>{slide.text}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.pagination}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === activeSlide ? styles.activeDot : styles.inactiveDot
                        ]}
                    />
                ))}
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleGetStarted}
            >
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCFFE0',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    slide: {
        width: SLIDER_WIDTH,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    image: {
        width: SLIDER_WIDTH * 0.85,
        height: SLIDER_WIDTH * 1.1,
        marginTop: 120,
        borderRadius: 25,
    },
    firstImage: {
        height: SLIDER_WIDTH * 1.2,
    },
    textContainer: {
        paddingHorizontal: 20,
        marginTop: 30,
        alignItems: 'center',
    },
    firstSlideTextContainer: {
        marginTop: -6,
    },

    iconPlaceholder: {
        width: 150,
        height: 150,
        backgroundColor: '#BACD92',
        borderRadius: 75,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#75A47F',
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#BACD92',
    },
    inactiveDot: {
        backgroundColor: '#ddd',
    },
    button: {
        backgroundColor: '#BACD92',
        padding: 15,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
        marginBottom: 50,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});