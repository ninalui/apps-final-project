import { View, Text, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View >
            <Text>Home Screen</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('MyBreed')}
            >
                <Text style={{ color: 'blue' }}>Go to My Breed</Text>
            </TouchableOpacity>
        </View>
    );
};


export default HomeScreen;