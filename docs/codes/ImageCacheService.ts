// services/ImageCacheService.ts
import * as FileSystem from "expo-file-system";
import { Image } from "react-native";

interface CacheEntry {
  uri: string;
  size: number;
  timestamp: number;
}

class ImageCacheService {
  private readonly CACHE_DIR = `${FileSystem.cacheDirectory}images/`;
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly CACHE_INDEX = "cache_index.json";

  async init(): Promise<void> {
    // Crear directorio de cache si no existe
    const dirInfo = await FileSystem.getInfoAsync(this.CACHE_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.CACHE_DIR, {
        intermediates: true,
      });
    }
  }

  // Generar nombre de archivo único desde URL
  private getFileNameFromUrl(url: string): string {
    const hash = url.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    const ext = url.split(".").pop()?.split("?")[0] || "jpg";
    return `${Math.abs(hash)}.${ext}`;
  }

  // Leer índice de cache
  private async getCacheIndex(): Promise<CacheEntry[]> {
    try {
      const indexPath = `${this.CACHE_DIR}${this.CACHE_INDEX}`;
      const indexExists = await FileSystem.getInfoAsync(indexPath);

      if (!indexExists.exists) {
        return [];
      }

      const content = await FileSystem.readAsStringAsync(indexPath);
      return JSON.parse(content);
    } catch (error) {
      return [];
    }
  }

  // Guardar índice de cache
  private async saveCacheIndex(index: CacheEntry[]): Promise<void> {
    const indexPath = `${this.CACHE_DIR}${this.CACHE_INDEX}`;
    await FileSystem.writeAsStringAsync(indexPath, JSON.stringify(index));
  }

  // Calcular tamaño total del cache
  private async getCacheSize(index: CacheEntry[]): Promise<number> {
    return index.reduce((total, entry) => total + entry.size, 0);
  }

  // Limpiar cache antigua (LRU - Least Recently Used)
  private async cleanOldCache(index: CacheEntry[]): Promise<CacheEntry[]> {
    let totalSize = await this.getCacheSize(index);

    if (totalSize <= this.MAX_CACHE_SIZE) {
      return index;
    }

    // Ordenar por timestamp (más antiguo primero)
    const sorted = [...index].sort((a, b) => a.timestamp - b.timestamp);
    const newIndex: CacheEntry[] = [];

    for (const entry of sorted) {
      if (totalSize <= this.MAX_CACHE_SIZE * 0.8) {
        // 80% del máximo
        newIndex.push(entry);
      } else {
        // Eliminar archivo
        try {
          await FileSystem.deleteAsync(entry.uri, { idempotent: true });
          totalSize -= entry.size;
        } catch (error) {
          console.error("Error deleting cache file:", error);
        }
      }
    }

    await this.saveCacheIndex(newIndex);
    return newIndex;
  }

  // Obtener imagen (desde cache o descarga)
  async getImage(url: string): Promise<string> {
    await this.init();

    const fileName = this.getFileNameFromUrl(url);
    const fileUri = `${this.CACHE_DIR}${fileName}`;

    // Verificar si existe en cache
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (fileInfo.exists) {
      console.log("Imagen desde cache:", fileName);

      // Actualizar timestamp en el índice
      const index = await this.getCacheIndex();
      const entryIndex = index.findIndex((e) => e.uri === fileUri);
      if (entryIndex !== -1) {
        index[entryIndex].timestamp = Date.now();
        await this.saveCacheIndex(index);
      }

      return fileUri;
    }

    // Descargar imagen
    console.log("Descargando imagen:", url);
    try {
      const downloadResult = await FileSystem.downloadAsync(url, fileUri);

      // Agregar al índice
      const info = await FileSystem.getInfoAsync(downloadResult.uri);
      let index = await this.getCacheIndex();

      index.push({
        uri: downloadResult.uri,
        size: info.size || 0,
        timestamp: Date.now(),
      });

      // Limpiar cache si es necesario
      index = await this.cleanOldCache(index);
      await this.saveCacheIndex(index);

      return downloadResult.uri;
    } catch (error) {
      console.error("Error downloading image:", error);
      throw error;
    }
  }

  // Precargar múltiples imágenes
  async preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map((url) =>
      this.getImage(url).catch((err) => {
        console.error(`Failed to preload ${url}:`, err);
      })
    );
    await Promise.all(promises);
  }

  // Limpiar todo el cache
  async clearCache(): Promise<void> {
    try {
      const index = await this.getCacheIndex();

      for (const entry of index) {
        await FileSystem.deleteAsync(entry.uri, { idempotent: true });
      }

      await this.saveCacheIndex([]);
      console.log("Cache limpiado completamente");
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  // Obtener estadísticas del cache
  async getCacheStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    totalSizeMB: number;
    oldestFile: Date | null;
    newestFile: Date | null;
  }> {
    const index = await this.getCacheIndex();
    const totalSize = await this.getCacheSize(index);

    const timestamps = index.map((e) => e.timestamp);

    return {
      totalFiles: index.length,
      totalSize,
      totalSizeMB: parseFloat((totalSize / (1024 * 1024)).toFixed(2)),
      oldestFile:
        timestamps.length > 0 ? new Date(Math.min(...timestamps)) : null,
      newestFile:
        timestamps.length > 0 ? new Date(Math.max(...timestamps)) : null,
    };
  }
}

export default new ImageCacheService();
