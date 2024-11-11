import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { auth } from '../Firebase/firebaseSetup';
import { database } from '../Firebase/firebaseSetup';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

import BreedCounter from '../ReusableComponent/BreedCounter';
import BreedIcon from '../ReusableComponent/BreedIcon';

const MyBreedScreen = ({ route }) => {
    const { breeds } = route.params;
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

    return (
        <View>
            <BreedCounter />
            <View style={styles.iconsContainer}>
                {breedCollection.map((breed) => {
                    return (
                        <BreedIcon key={breed.breedName} breedImage={breed.imageUrl} breedName={breed.breedName} />
                    );
                })}
            </View>
        </View>
    );
};

export default MyBreedScreen;

const styles = StyleSheet.create({
    iconsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});