import { database } from './firebaseSetup';
import { collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, setDoc, increment } from 'firebase/firestore';

// Write to posts subcollection
export async function createPost(userId, postData) {
    try {
        const userPostsRef = collection(database, 'users', userId, 'posts');
        const docRef = await addDoc(userPostsRef, {
            ...postData,
            createdAt: new Date()
        });
        return docRef.id;  // Return the new post ID
    } catch (error) {
        console.error('Error creating post: ', error);
        throw error;
    }
}

// Function to update posts
export async function updatePost(userId, postId, postData) {
    try {
        const postRef = doc(database, 'users', userId, 'posts', postId);
        await updateDoc(postRef, postData);
        return postId;
    } catch (error) {
        console.error('Error updating post: ', error);
        throw error;
    }
}

// Update or create breed count in breeds subcollection
export async function updateBreedCount(userId, breedName) {
    try {
        const userBreedsRef = doc(database, 'users', userId, 'breeds', breedName);
        const breedDoc = await getDoc(userBreedsRef);

        if (breedDoc.exists()) {
            // Increment count if breed exists
            await updateDoc(userBreedsRef, {
                count: increment(1)
            });
        } else {
            // Create new breed document if it doesn't exist
            await setDoc(userBreedsRef, {
                breedName: breedName,
                count: 1
            });
        }
    } catch (error) {
        console.error('Error updating breed count: ', error);
        throw error;
    }
}


// Function for writing user data with custom ID
export async function writeUserToDB(data, uid) {
    try {
        const userRef = doc(database, 'users', uid);
        await setDoc(userRef, data);
    } catch (error) {
        console.error('Error adding user document: ', error);
    }
}

// Create a new document in the specified collection
export async function writeToDB(data, collectionName) {
    try {
        await addDoc(collection(database, collectionName), data);
    } catch (error) {
        console.error('Error adding document: ', error);
    }
}

// Get a specific document from the specified collection
export async function getDocument(docID, collectionName) {
    try {
        const docRef = doc(database, collectionName, docID);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            console.log('No such document!');
            return;
        } else {
            return docSnap.data();
        }
    } catch (error) {
        console.log('Error getting document:', error);
    }
}

// Get all documents from the specified collection
export async function getAllDocuments(collectionName) {
    try {
        const querySnapshot = await getDocs(collection(database, collectionName));
        const data = [];
        if (querySnapshot.empty) {
            console.log("No documents found in ", collectionName);
            return data;
        }
        querySnapshot.forEach((docSnapshot) => {
            data.push(docSnapshot.data());
        });
        return data;
    }
    catch (error) {
        console.log("Error getting documents: ", error);
    }
}

// Update a document in the specified collection
export async function updateDB(docID, data, collectionName) {
    try {
        await updateDoc(doc(database, collectionName, docID), data);
    } catch (error) {
        console.error('Error updating document: ', error);
    }
}

// Delete a specific document from the specified collection
export async function deleteFromDB(docID, collectionName) {
    try {
        await deleteDoc(doc(database, collectionName, docID));
    } catch (error) {
        console.error('Error deleting document: ', error);
    }
}

// Get count of documents in a collection
export async function getCollectionCount(collectionPath) {
    try {
        const querySnapshot = await getDocs(collection(database, collectionPath));
        return querySnapshot.size;
    } catch (error) {
        console.error('Error getting collection count: ', error);
        return 0;
    }
}