// services/FirebaseStorageService.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

class FirebaseStorageService {
  async uploadImage(uri: string, userId: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `users/${userId}/profile.jpg`);
    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }
}

export default new FirebaseStorageService();
