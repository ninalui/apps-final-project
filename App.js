import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect, useRef } from 'react';
import { auth } from './Firebase/firebaseSetup';
import * as Notifications from 'expo-notifications';
import { Svg, Path, Rect } from 'react-native-svg';
import { colors, navigationStyles } from './styles';
import LoadingAnimation from './ReusableComponent/LoadingAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from './Screens/OnboardingScreen';

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

global.GLOBAL = global;
LogBox.ignoreLogs(["Property 'GLOBAL"]);

const ProfileStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const LeaderboardStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

const Home03Icon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
    <Path d="M8.9995 22L8.74887 18.4911C8.61412 16.6046 10.1082 15 11.9995 15C13.8908 15 15.3849 16.6046 15.2501 18.4911L14.9995 22" stroke={props.color} strokeWidth="1.5" />
    <Path d="M2.35157 13.2135C1.99855 10.9162 1.82204 9.76763 2.25635 8.74938C2.69065 7.73112 3.65421 7.03443 5.58132 5.64106L7.02117 4.6C9.41847 2.86667 10.6171 2 12.0002 2C13.3832 2 14.5819 2.86667 16.9792 4.6L18.419 5.64106C20.3462 7.03443 21.3097 7.73112 21.744 8.74938C22.1783 9.76763 22.0018 10.9162 21.6488 13.2135L21.3478 15.1724C20.8473 18.4289 20.5971 20.0572 19.4292 21.0286C18.2613 22 16.5538 22 13.139 22H10.8614C7.44652 22 5.73909 22 4.57118 21.0286C3.40327 20.0572 3.15305 18.4289 2.65261 15.1724L2.35157 13.2135Z" stroke={props.color} strokeWidth="1.5" strokeLinejoin="round" />
  </Svg>
);

const LocationFavourite02Icon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
    <Path d="M12 2C16.8706 2 21 6.03298 21 10.9258C21 15.8965 16.8033 19.3847 12.927 21.7567C12.6445 21.9162 12.325 22 12 22C11.675 22 11.3555 21.9162 11.073 21.7567C7.2039 19.3616 3 15.9137 3 10.9258C3 6.03298 7.12944 2 12 2Z" stroke={props.color} strokeWidth="1.5" />
    <Path d="M9.01498 7.38661C10.0876 6.74692 11.0238 7.00471 11.5863 7.41534C11.8169 7.58371 11.9322 7.66789 12 7.66789C12.0678 7.66789 12.1831 7.58371 12.4137 7.41534C12.9762 7.00471 13.9124 6.74692 14.985 7.38661C16.3928 8.22614 16.7113 10.9958 13.4642 13.3324C12.8457 13.7775 12.5365 14 12 14C11.4635 14 11.1543 13.7775 10.5358 13.3324C7.28869 10.9958 7.60723 8.22614 9.01498 7.38661Z" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const Add02Icon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
    <Path d="M14.236 5.29178C14.236 4.77191 14.236 4.51198 14.1789 4.29871C14.0238 3.71997 13.5717 3.26793 12.9931 3.11285C12.4315 2.96238 11.5684 2.96238 11.0068 3.11285C10.4281 3.26793 9.97609 3.71997 9.82101 4.29871C9.76387 4.51198 9.76387 4.77191 9.76387 5.29178C9.76387 6.34588 9.76387 9.109 9.43641 9.43647C9.10894 9.76393 6.34582 9.76393 5.29172 9.76393C4.77185 9.76393 4.51192 9.76393 4.29865 9.82107C3.71991 9.97615 3.26787 10.4282 3.11279 11.0069C2.96232 11.5685 2.96232 12.4315 3.11279 12.9931C3.26787 13.5718 3.71991 14.0239 4.29865 14.1789C4.51192 14.2361 4.77185 14.2361 5.29172 14.2361C6.34582 14.2361 9.10894 14.2361 9.43641 14.5635C9.76387 14.891 9.76387 15.418 9.76387 16.4721C9.76387 16.992 9.76387 19.4881 9.82101 19.7013C9.97609 20.28 10.4281 20.7321 11.0068 20.8871C11.5684 21.0376 12.4315 21.0376 12.9931 20.8871C13.5717 20.7321 14.0238 20.28 14.1789 19.7013C14.236 19.4881 14.236 16.992 14.236 16.4721C14.236 15.418 14.236 14.891 14.5635 14.5635C14.8909 14.2361 17.654 14.2361 18.7082 14.2361C19.228 14.2361 19.488 14.2361 19.7013 14.1789C20.28 14.0239 20.732 13.5718 20.8871 12.9931C21.0376 12.4315 21.0376 11.5685 20.8871 11.0069C20.732 10.4282 20.28 9.97615 19.7013 9.82107C19.488 9.76393 19.228 9.76393 18.7082 9.76393C17.654 9.76393 14.8909 9.76393 14.5635 9.43647C14.236 9.109 14.236 6.34588 14.236 5.29178Z" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RankingIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
    <Path d="M3.5 18C3.5 16.5858 3.5 15.8787 3.93934 15.4393C4.37868 15 5.08579 15 6.5 15H7C7.94281 15 8.41421 15 8.70711 15.2929C9 15.5858 9 16.0572 9 17V22H3.5V18Z" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 19C15 18.0572 15 17.5858 15.2929 17.2929C15.5858 17 16.0572 17 17 17H17.5C18.9142 17 19.6213 17 20.0607 17.4393C20.5 17.8787 20.5 18.5858 20.5 20V22H15V19Z" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 22H22" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 16C9 14.5858 9 13.8787 9.43934 13.4393C9.87868 13 10.5858 13 12 13C13.4142 13 14.1213 13 14.5607 13.4393C15 13.8787 15 14.5858 15 16V22H9V16Z" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12.6911 2.57767L13.395 3.99715C13.491 4.19475 13.7469 4.38428 13.9629 4.42057L15.2388 4.6343C16.0547 4.77141 16.2467 5.36824 15.6587 5.957L14.6668 6.95709C14.4989 7.12646 14.4069 7.4531 14.4589 7.68699L14.7428 8.925C14.9668 9.90492 14.4509 10.284 13.591 9.77185L12.3951 9.05808C12.1791 8.92903 11.8232 8.92903 11.6032 9.05808L10.4073 9.77185C9.5514 10.284 9.03146 9.90089 9.25543 8.925L9.5394 7.68699C9.5914 7.4531 9.49941 7.12646 9.33143 6.95709L8.33954 5.957C7.7556 5.36824 7.94358 4.77141 8.75949 4.6343L10.0353 4.42057C10.2473 4.38428 10.5033 4.19475 10.5993 3.99715L11.3032 2.57767C11.6872 1.80744 12.3111 1.80744 12.6911 2.57767Z" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserAccountIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
    <Path d="M14 8.99988H18" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M14 12.4999H17" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" />
    <Rect x="2" y="2.99988" width="20" height="18" rx="5" stroke={props.color} strokeWidth="1.5" strokeLinejoin="round" />
    <Path d="M5 15.9999C6.20831 13.4188 10.7122 13.249 12 15.9999" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10.5 8.99988C10.5 10.1044 9.60457 10.9999 8.5 10.9999C7.39543 10.9999 6.5 10.1044 6.5 8.99988C6.5 7.89531 7.39543 6.99988 8.5 6.99988C9.60457 6.99988 10.5 7.89531 10.5 8.99988Z" stroke={props.color} strokeWidth="1.5" />
  </Svg>
);

// To present notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  })
});

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={navigationStyles}>
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
    <ProfileStack.Navigator screenOptions={navigationStyles}>
      <ProfileStack.Screen name="MyProfile" component={ProfileScreen} options={{ title: 'My Profile' }} />
      <ProfileStack.Screen name="MyBreed" component={MyBreedScreen} options={{ title: 'My Breed' }} />
    </ProfileStack.Navigator>
  );
}

function LeaderboardStackScreen() {
  return (
    <LeaderboardStack.Navigator screenOptions={navigationStyles}>
      <LeaderboardStack.Screen name="LeaderBoard" component={LeaderboardScreen} options={{ title: 'Leader Board' }} />
      <LeaderboardStack.Screen name="OtherProfile" component={OtherUserProfileScreen} options={{ title: 'Profile' }} />
    </LeaderboardStack.Navigator>
  );
}

function AppStack() {
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colors.sage,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case 'Home':
              return <Home03Icon width={size} height={size} color={color} />;
            case 'Map':
              return <LocationFavourite02Icon width={size} height={size} color={color} />;
            case 'Post':
              return <Add02Icon width={size} height={size} color={color} />;
            case 'Leaderboard':
              return <RankingIcon width={size} height={size} color={color} />;
            case 'Profile':
              return <UserAccountIcon width={size} height={size} color={color} />;
          }
        },
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          paddingTop: 5,
          paddingBottom: 15,
          elevation: 0,
          backgroundColor: '#FFE6A9',
          borderTopWidth: 1,
        },

      })}
    >
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
        component={CreatePostScreen}
        options={{ title: 'New Post' }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardStackScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function AuthStackScreen() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(value === 'true');
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingAnimation />
  }

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {!hasSeenOnboarding ? (
        <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : null}
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Signup" component={Signup} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const navigationRef = useRef();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Navigate to screen when notification is tapped
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      const screen = response.notification.request.content.data.screen;
      if (screen && navigationRef.current) {
        navigationRef.current.navigate(screen);
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      {user ? <AppStack /> : <AuthStackScreen />}
    </NavigationContainer>
  );
}