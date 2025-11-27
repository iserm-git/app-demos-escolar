// components/CachedImage.tsx
import React, { useState, useEffect } from "react";
import {
  Image,
  ImageProps,
  ActivityIndicator,
  View,
  StyleSheet,
} from "react-native";
import ImageCacheService from "../services/ImageCacheService";

interface CachedImageProps extends Omit<ImageProps, "source"> {
  uri: string;
}

const CachedImage: React.FC<CachedImageProps> = ({ uri, style, ...props }) => {
  const [cachedUri, setCachedUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadImage();
  }, [uri]);

  const loadImage = async () => {
    try {
      setLoading(true);
      setError(false);
      const localUri = await ImageCacheService.getImage(uri);
      setCachedUri(localUri);
    } catch (err) {
      setError(true);
      console.error("Error loading image:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.placeholder, style]}>
        <ActivityIndicator size="small" color="#999" />
      </View>
    );
  }

  if (error || !cachedUri) {
    return <View style={[styles.placeholder, style]} />;
  }

  return <Image source={{ uri: cachedUri }} style={style} {...props} />;
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CachedImage;
