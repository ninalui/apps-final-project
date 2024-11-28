import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../styles'
import { getAllDocuments } from '../Firebase/firestoreHelper'
import BreedIcon from '../ReusableComponent/BreedIcon'
import BreedCounter from '../ReusableComponent/BreedCounter'
import UserImageIcon from '../ReusableComponent/UserImageIcon'

export default function OtherUserProfileScreen({ navigation, route }) {
  const [topBreeds, setTopBreeds] = useState([]);
  // Set header title to username's Profile
  useEffect(() => {
    navigation.setOptions({ title: `${route.params.username}'s Profile` });
  }, []);

  // Fetch user's top breeds
  useEffect(() => {
    const fetchTopBreeds = async () => {
      try {
        // Fetch user's top breeds from Firestore
        const breedsSubcollectionPath = `users/${route.params.userId}/breeds`;
        const breeds = await getAllDocuments(breedsSubcollectionPath);
        // Sort breeds by count and get top 3
        const topBreeds = breeds.sort((a, b) => b.count - a.count).slice(0, 3);
        setTopBreeds(topBreeds);

        // Fetch images of top breeds from posts collection
        const breedImages = await Promise.all(topBreeds.map(async (breed) => {
          const breedPosts = await getAllDocuments(`users/${route.params.userId}/posts`);
          // Find post with breed name and return image URL
          for (const post of breedPosts) {
            if (post.breed === breed.breedName) {
              return post.imageUrl;
            }
          }
        }));

        // Update top breeds with images
        const topBreedsWithImages = topBreeds.map((breed, index) => {
          return {
            breedName: breed.breedName,
            breedImage: breedImages[index],
          };
        });
        setTopBreeds(topBreedsWithImages);

      } catch (error) {
        console.error('Error fetching top breeds: ', error);
      }
    };
    fetchTopBreeds();
  }, []);

  return (
    <View style={styles.container}>
      {/* User image */}
      <View>
        <UserImageIcon userImageUri={route.params.userImage} />
      </View>

      {/* User name */}
      <Text style={globalStyles.boldText}>
        {route.params.username}
      </Text>

      {/* Breed collection progress */}
      <BreedCounter breedCount={route.params.breedsCount} />

      {/* Top 3 breeds */}
      <Text style={globalStyles.boldText}>
        Top Breeds
      </Text>
      <View style={styles.topBreedIconsContainer}>
        {topBreeds.map((breed, index) => (
          <BreedIcon key={index} breedName={breed.breedName} breedImage={breed.breedImage} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCFFE0'
  },
  notificationContainer: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    margin: 10,
  },
  topBreedIconsContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  spacer: {
    marginBottom: 15,
  },
}); 