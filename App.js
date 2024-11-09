import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import { auth } from './Firebase/firebaseSetup';  // Import your Firebase auth

// Import screen components
import HomeScreen from './Screens/HomeScreen';
import MapScreen from './Screens/MapScreen';
import PostScreen from './Screens/CreatePostScreen';
import LeaderboardScreen from './Screens/LeaderboardScreen';
import ProfileScreen from './Screens/ProfileScreen';
import MyBreedScreen from './Screens/MyBreedScreen';
import Login from './Screens/Login';
import Signup from './Screens/Signup';

const ProfileStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="MyProfile" component={ProfileScreen} options={{ title: 'My Profile' }} />
      <ProfileStack.Screen name="MyBreed" component={MyBreedScreen} options={{ title: 'My Breed' }} />
    </ProfileStack.Navigator>
  );
}

function AppStack() {
  return (
    <Tab.Navigator initialRouteName="Profile">
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'HotSpots' }} />
      <Tab.Screen name="Post" component={PostScreen} options={{ title: 'New Post' }} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Leader Board' }} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Signup" component={Signup} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStackScreen />}
    </NavigationContainer>
  );
}