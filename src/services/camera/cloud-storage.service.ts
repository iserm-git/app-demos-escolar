import storage from "@react-native-firebase/storage";

export class CloudStorageService {
  static async uploadProfileImage(
    uri: string,
    userId: string,
    type: "professor" | "student"
  ): Promise<string> {
    const filename = `${userId}_${Date.now()}.jpg`;
    const path = `images/profiles/${type}s/${filename}`;
    const reference = storage().ref(path);

    await reference.putFile(uri);
    const downloadURL = await reference.getDownloadURL();

    return downloadURL;
  }

  static async uploadWithProgress(
    uri: string,
    path: string,
    onProgress: (progress: number) => void
  ): Promise<string> {
    const reference = storage().ref(path);
    const task = reference.putFile(uri);

    task.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress);
    });

    await task;
    return await reference.getDownloadURL();
  }

  static async deleteImage(path: string): Promise<void> {
    const reference = storage().ref(path);
    await reference.delete();
  }
}
