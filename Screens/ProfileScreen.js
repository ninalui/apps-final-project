import { View, Text, Pressable } from 'react-native';

const ProfileScreen = ({ navigation }) => {
    return (
        <View>
            <Text>Profile Screen</Text>
            <Pressable
                onPress={() => navigation.navigate('MyBreed')}
            >
                <Text style={{ color: 'blue' }}>Go to My Breed</Text>
            </Pressable>
        </View>
    );
};

export default ProfileScreen;