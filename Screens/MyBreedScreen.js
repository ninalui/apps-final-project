import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { auth } from '../Firebase/firebaseSetup';
import { database } from '../Firebase/firebaseSetup';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

import BreedCounter from '../ReusableComponent/BreedCounter';
import BreedIcon from '../ReusableComponent/BreedIcon';

const MyBreedScreen = ({ route }) => {
    const { breeds, breedCount } = route.params;
    const [breedCollection, setBreedCollection] = useState(breeds);
    const currentUser = auth.currentUser.uid;

    // Fetch images for each breed
    useEffect(() => {
        const fetchImages = async () => {
            try {
                let breedImages = [...breedCollection];
                for (let i = 0; i < breedImages.length; i++) {
                    const postsQuery = query(
                        collection(database, `users/${currentUser}/posts`),
                        where('breed', '==', breedImages[i].breedName),
                        limit(1)
                    );
                    const imageSnapshot = await getDocs(postsQuery);
                    if (!imageSnapshot.empty) {
                        const image = imageSnapshot.docs[0].data().imageUrl;
                            breedImages[i].imageUrl = image;
                        } else {
                            breedImages[i].imageUrl = '';
                        }
                }
                setBreedCollection(breedImages);
            } catch (error) {
                console.error('Error fetching images for collection: ', error);
            }
        };
        if (breedCollection.length > 0) {
            fetchImages();
        }
    }, [breedCollection]);

    // Breed detection API uses database with 120 breeds
    const totalBreeds = 120;
    const totalBreedsDetected = breedCollection.length;
    const totalBreedsLeft = totalBreeds - totalBreedsDetected;
    let allBreeds = [...breedCollection];
    for (let i = 0; i < totalBreedsLeft; i++) {
        allBreeds.push({ breedName: `Mystery Breed ${i}`, imageUrl: '' });
    }
    
    return (
        <View style={styles.container}>
            <BreedCounter breedCount={breedCount} />
            <FlatList
                data={allBreeds}
                renderItem={({ item }) => (<BreedIcon breedImage={item.imageUrl} breedName={item.breedName} />)}
                keyExtractor={item => item.breedName}
                numColumns={3}
            />
        </View >
    );
};

export default MyBreedScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 5,
    },
});