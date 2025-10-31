import * as ImagePicker from "expo-image-picker";
import { ImagePickerOptions, ImagePickerResult } from "../../../types";
import { PermissionsService } from "./permissions.service";

export class CameraService {
  static async capturePhoto(
    options?: Partial<ImagePickerOptions>
  ): Promise<ImagePickerResult> {
    const hasPermission = await PermissionsService.requestCameraPermission();

    if (!hasPermission) {
      return {
        success: false,
        error: "Permiso de cámara denegado",
      };
    }

    const defaultOptions: ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: false,
    };

    const finalOptions = { ...defaultOptions, ...options };

    const result = await ImagePicker.launchCameraAsync(finalOptions);

    if (result.canceled) {
      return { success: false, cancelled: true };
    }

    return {
      success: true,
      uri: result.assets[0].uri,
      width: result.assets[0].width,
      height: result.assets[0].height,
    };
  }

  static async pickFromGallery(
    options?: Partial<ImagePickerOptions>
  ): Promise<ImagePickerResult> {
    const hasPermission = await PermissionsService.requestGalleryPermission();

    if (!hasPermission) {
      return {
        success: false,
        error: "Permiso de galería denegado",
      };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      ...options,
    });

    if (result.canceled) {
      return { success: false, cancelled: true };
    }

    return {
      success: true,
      uri: result.assets[0].uri,
      width: result.assets[0].width,
      height: result.assets[0].height,
    };
  }
}
