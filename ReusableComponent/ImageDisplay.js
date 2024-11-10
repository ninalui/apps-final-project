import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text } from "react-native";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function ImageDisplay({ imageUri, displayStyle }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (imageUri) {
      const fetchImageUrl = async () => {
        try {
          const storage = getStorage();
          const imageRef = ref(storage, imageUri);
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        } catch (error) {
          console.error("Error fetching image: ", error);
        }
    };
    fetchImageUrl();
  }
  }, [imageUri]);

  return (
    <Image
      style={[styles.image, displayStyle]}
      source={{ uri: imageUrl }}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 90,
    height: 70,
  },
});