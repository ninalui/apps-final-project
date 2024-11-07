import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screen components
import HomeScreen from './Components/HomeScreen';
import MapScreen from './Components/MapScreen';
import PostScreen from './Components/PostScreen';
import LeaderboardScreen from './Components/LeaderboardScreen';
import ProfileScreen from './Components/ProfileScreen';
import MyBreedScreen from './Components/MyBreedScreen';



// Create navigation stacks
const HomeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="MyPosts" component={HomeScreen} options={{ title: 'My Posts' }} />
      <HomeStack.Screen name="MyBreed" component={MyBreedScreen} options={{ title: 'My Breed' }} />
    </HomeStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{ headerShown: false }}
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
          component={ProfileScreen}
          options={{ title: 'My Profile' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
