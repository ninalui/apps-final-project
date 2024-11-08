import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screen components
import HomeScreen from './Screens/HomeScreen';
import MapScreen from './Screens/MapScreen';
import PostScreen from './Screens/CreatePostScreen';
import LeaderboardScreen from './Screens/LeaderboardScreen';
import ProfileScreen from './Screens/ProfileScreen';
import MyBreedScreen from './Screens/MyBreedScreen';



// Create navigation stacks
const ProfileStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="MyProfile" component={ProfileScreen} options={{ title: 'My Profile' }} />
      <ProfileStack.Screen name="MyBreed" component={MyBreedScreen} options={{ title: 'My Breed' }} />
    </ProfileStack.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{ title: 'HotSpots' }}
        />
        <Tab.Screen
          name="Post"
          component={PostScreen}
          options={{ title: 'New Post' }}
        />
        <Tab.Screen
          name="Leaderboard"
          component={LeaderboardScreen}
          options={{ title: 'Leader Board' }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStackScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
