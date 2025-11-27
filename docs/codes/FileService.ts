// services/FileService.ts
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

class FileService {
  // Directorios base
  private readonly DOCS_DIR = FileSystem.documentDirectory;
  private readonly CACHE_DIR = FileSystem.cacheDirectory;

  // ===== GUARDAR ARCHIVO =====
  async saveFile(fileName: string, content: string): Promise<string> {
    const fileUri = `${this.DOCS_DIR}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, content);
    return fileUri;
  }

  // ===== LEER ARCHIVO =====
  async readFile(fileName: string): Promise<string> {
    const fileUri = `${this.DOCS_DIR}${fileName}`;
    const content = await FileSystem.readAsStringAsync(fileUri);
    return content;
  }

  // ===== VERIFICAR SI EXISTE =====
  async fileExists(fileName: string): Promise<boolean> {
    const fileUri = `${this.DOCS_DIR}${fileName}`;
    const info = await FileSystem.getInfoAsync(fileUri);
    return info.exists;
  }

  // ===== ELIMINAR ARCHIVO =====
  async deleteFile(fileName: string): Promise<void> {
    const fileUri = `${this.DOCS_DIR}${fileName}`;
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
  }

  // ===== DESCARGAR ARCHIVO =====
  async downloadFile(url: string, fileName: string): Promise<string> {
    const fileUri = `${this.DOCS_DIR}${fileName}`;
    const downloadResult = await FileSystem.downloadAsync(url, fileUri);
    return downloadResult.uri;
  }

  // ===== COMPARTIR ARCHIVO =====
  async shareFile(fileName: string): Promise<void> {
    const fileUri = `${this.DOCS_DIR}${fileName}`;
    await Sharing.shareAsync(fileUri);
  }

  // ===== LISTAR ARCHIVOS =====
  async listFiles(): Promise<string[]> {
    const files = await FileSystem.readDirectoryAsync(this.DOCS_DIR!);
    return files;
  }

  // ===== OBTENER INFO DEL ARCHIVO =====
  async getFileInfo(fileName: string) {
    const fileUri = `${this.DOCS_DIR}${fileName}`;
    const info = await FileSystem.getInfoAsync(fileUri);
    return {
      exists: info.exists,
      size: info.size,
      uri: info.uri,
      modificationTime: info.modificationTime,
    };
  }

  // ===== CREAR CARPETA =====
  async createDirectory(dirName: string): Promise<string> {
    const dirUri = `${this.DOCS_DIR}${dirName}`;
    await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
    return dirUri;
  }

  // ===== SELECCIONAR ARCHIVO DEL USUARIO =====
  async pickDocument(): Promise<DocumentPicker.DocumentPickerResult> {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });
    return result;
  }

  // ===== COPIAR ARCHIVO =====
  async copyFile(sourceUri: string, destFileName: string): Promise<string> {
    const destUri = `${this.DOCS_DIR}${destFileName}`;
    await FileSystem.copyAsync({ from: sourceUri, to: destUri });
    return destUri;
  }

  // ===== MOVER ARCHIVO =====
  async moveFile(sourceFileName: string, destFileName: string): Promise<void> {
    const sourceUri = `${this.DOCS_DIR}${sourceFileName}`;
    const destUri = `${this.DOCS_DIR}${destFileName}`;
    await FileSystem.moveAsync({ from: sourceUri, to: destUri });
  }
}

export default new FileService();
