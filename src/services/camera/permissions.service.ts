import * as ImagePicker from "expo-image-picker";

export class PermissionsService {
  static async requestCameraPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === "granted";
  }

  static async requestGalleryPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  }

  static async checkCameraPermission(): Promise<boolean> {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    return status === "granted";
  }

  static async requestAllPermissions(): Promise<{
    camera: boolean;
    gallery: boolean;
  }> {
    const camera = await this.requestCameraPermission();
    const gallery = await this.requestGalleryPermission();
    return { camera, gallery };
  }
}
