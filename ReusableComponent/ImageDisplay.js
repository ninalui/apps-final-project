import React, { useState, useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function ImageDisplay({ imageUri, displayStyle }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const storage = getStorage();
    const imageRef = ref(storage, imageUri);
    getDownloadURL(imageRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((error) => {
        console.error("Error fetching image: ", error);
      });
  }, []);

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