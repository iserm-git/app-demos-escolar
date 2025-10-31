import * as ImageManipulator from "expo-image-manipulator";
import { ImageInfo } from "../../../types";

export class ImageManipulationService {
  static async resizeImage(
    uri: string,
    width: number,
    height: number
  ): Promise<string> {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width, height } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  }

  static async optimizeForProfile(uri: string): Promise<ImageInfo> {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 400, height: 400 } }],
      {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return {
      uri: result.uri,
      width: result.width,
      height: result.height,
      format: "jpeg",
      fileSize: 0,
    };
  }

  static async createThumbnail(
    uri: string,
    size: number = 150
  ): Promise<string> {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: size, height: size } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  }
}
