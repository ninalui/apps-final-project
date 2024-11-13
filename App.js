import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import { auth } from './Firebase/firebaseSetup';  // Import your Firebase auth

// Import screen components
import HomeScreen from './Screens/HomeScreen';
import MapScreen from './Screens/MapScreen';
import CreatePostScreen from './Screens/CreatePostScreen';
import LeaderboardScreen from './Screens/LeaderboardScreen';
import OtherUserProfileScreen from './Screens/OtherUserProfileScreen';
import ProfileScreen from './Screens/ProfileScreen';
import MyBreedScreen from './Screens/MyBreedScreen';
import Login from './Screens/Login';
import Signup from './Screens/Signup';

const ProfileStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const LeaderboardStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="MyPosts" component={HomeScreen} options={{ title: 'My Posts' }} />
      <HomeStack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={({ route }) => ({
          title: route.params?.isEditing ? 'Edit Post' : 'New Post'
        })}
      />
    </HomeStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="MyProfile" component={ProfileScreen} options={{ title: 'My Profile' }} />
      <ProfileStack.Screen name="MyBreed" component={MyBreedScreen} options={{ title: 'My Breed' }} />
    </ProfileStack.Navigator>
  );
}

function LeaderboardStackScreen() {
  return (
    <LeaderboardStack.Navigator>
      <LeaderboardStack.Screen name="LeaderBoard" component={LeaderboardScreen} options={{ title: 'Leader Board' }} />
      <LeaderboardStack.Screen name="OtherProfile" component={OtherUserProfileScreen} options={{ title: 'Profile' }} />
    </LeaderboardStack.Navigator>
  );
}

function AppStack() {
  return (
    <Tab.Navigator initialRouteName="Profile">
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{ headerShown: false }}  // Hide header since HomeStack has its own
      />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'HotSpots' }} />
      <Tab.Screen name="Post" component={CreatePostScreen} options={{ title: 'New Post' }} />
      <Tab.Screen name="Leaderboard" component={LeaderboardStackScreen} options={{ headerShown: false }}  />
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