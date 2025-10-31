import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraService } from "../../services/camera/camera.service";
import { ImageManipulationService } from "../../services/camera/image-manipulation.service";
import { COLORS } from "../../../types";

interface ProfileImagePickerProps {
  currentImage?: string;
  onImageSelected: (uri: string) => void;
  onImageRemoved?: () => void;
  size?: number;
  shape?: "circle" | "square";
  editable?: boolean;
}

export const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  currentImage,
  onImageSelected,
  onImageRemoved,
  size = 150,
  shape = "circle",
  editable = true,
}) => {
  const [imageUri, setImageUri] = useState(currentImage);
  const [loading, setLoading] = useState(false);

  const handleCameraCapture = async () => {
    setLoading(true);
    const result = await CameraService.capturePhoto({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.success && result.uri) {
      const optimized = await ImageManipulationService.optimizeForProfile(
        result.uri
      );
      setImageUri(optimized.uri);
      onImageSelected(optimized.uri);
    }
    setLoading(false);
  };

  const handleGalleryPick = async () => {
    setLoading(true);
    const result = await CameraService.pickFromGallery({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.success && result.uri) {
      const optimized = await ImageManipulationService.optimizeForProfile(
        result.uri
      );
      setImageUri(optimized.uri);
      onImageSelected(optimized.uri);
    }
    setLoading(false);
  };

  const showOptions = () => {
    Alert.alert("Seleccionar foto", "Elige una opción", [
      {
        text: "📷 Tomar foto",
        onPress: handleCameraCapture,
      },
      {
        text: "🖼️ Elegir de galería",
        onPress: handleGalleryPick,
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  };

  const handleRemove = () => {
    Alert.alert("Eliminar foto", "¿Estás seguro de eliminar la foto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setImageUri(undefined);
          if (onImageRemoved) onImageRemoved();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={editable ? showOptions : undefined}
        disabled={loading}
      >
        <View
          style={[
            styles.imageContainer,
            { width: size, height: size },
            shape === "circle" && styles.circle,
          ]}
        >
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require("../../../assets/alumno_image1.png")
            }
            style={[
              styles.image,
              { width: size, height: size },
              shape === "circle" && styles.circle,
            ]}
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#FFFFFF" size="large" />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {editable && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCameraCapture}
            disabled={loading}
          >
            <MaterialIcons name="camera-alt" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleGalleryPick}
            disabled={loading}
          >
            <MaterialIcons name="photo-library" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {imageUri && (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleRemove}
              disabled={loading}
            >
              <MaterialIcons name="delete" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  imageContainer: {
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  circle: {
    borderRadius: 999,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
});
