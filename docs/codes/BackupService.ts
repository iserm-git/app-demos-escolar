// services/BackupService.ts
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface BackupMetadata {
  version: string;
  createdAt: string;
  size: number;
  dataKeys: string[];
}

interface Backup {
  metadata: BackupMetadata;
  data: { [key: string]: any };
}

class BackupService {
  private readonly BACKUP_DIR = `${FileSystem.documentDirectory}backups/`;
  private readonly MAX_BACKUPS = 7; // Últimos 7 días
  private readonly BACKUP_VERSION = "1.0";

  async init(): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(this.BACKUP_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.BACKUP_DIR, {
        intermediates: true,
      });
    }
  }

  // Crear backup completo
  async createBackup(customData?: any): Promise<string> {
    await this.init();

    try {
      // Obtener todos los datos de AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();
      const allData: { [key: string]: any } = {};

      for (const key of allKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          try {
            allData[key] = JSON.parse(value);
          } catch {
            allData[key] = value;
          }
        }
      }

      // Agregar datos personalizados si existen
      if (customData) {
        allData["_custom_data"] = customData;
      }

      // Crear metadata
      const metadata: BackupMetadata = {
        version: this.BACKUP_VERSION,
        createdAt: new Date().toISOString(),
        size: JSON.stringify(allData).length,
        dataKeys: Object.keys(allData),
      };

      const backup: Backup = { metadata, data: allData };

      // Guardar backup
      const fileName = `backup_${Date.now()}.json`;
      const fileUri = `${this.BACKUP_DIR}${fileName}`;

      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(backup, null, 2),
        { encoding: FileSystem.EncodingType.UTF8 }
      );

      // Limpiar backups antiguos
      await this.cleanOldBackups();

      console.log("Backup creado:", fileName);
      return fileUri;
    } catch (error) {
      console.error("Error creating backup:", error);
      throw error;
    }
  }

  // Listar backups disponibles
  async listBackups(): Promise<
    Array<{
      fileName: string;
      uri: string;
      size: number;
      date: Date;
      metadata?: BackupMetadata;
    }>
  > {
    await this.init();

    try {
      const files = await FileSystem.readDirectoryAsync(this.BACKUP_DIR);
      const backupFiles = files.filter(
        (f) => f.startsWith("backup_") && f.endsWith(".json")
      );

      const backups = await Promise.all(
        backupFiles.map(async (fileName) => {
          const uri = `${this.BACKUP_DIR}${fileName}`;
          const info = await FileSystem.getInfoAsync(uri);

          let metadata: BackupMetadata | undefined;
          try {
            const content = await FileSystem.readAsStringAsync(uri);
            const backup: Backup = JSON.parse(content);
            metadata = backup.metadata;
          } catch {}

          return {
            fileName,
            uri,
            size: info.size || 0,
            date: new Date(
              parseInt(fileName.replace("backup_", "").replace(".json", ""))
            ),
            metadata,
          };
        })
      );

      // Ordenar por fecha (más reciente primero)
      return backups.sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
      console.error("Error listing backups:", error);
      return [];
    }
  }

  // Restaurar desde backup
  async restoreFromBackup(backupUri: string): Promise<void> {
    try {
      const content = await FileSystem.readAsStringAsync(backupUri);
      const backup: Backup = JSON.parse(content);

      // Validar versión
      if (backup.metadata.version !== this.BACKUP_VERSION) {
        console.warn("Backup version mismatch");
      }

      // Limpiar datos actuales
      await AsyncStorage.clear();

      // Restaurar datos
      const { _custom_data, ...asyncStorageData } = backup.data;

      for (const [key, value] of Object.entries(asyncStorageData)) {
        const stringValue =
          typeof value === "string" ? value : JSON.stringify(value);
        await AsyncStorage.setItem(key, stringValue);
      }

      console.log("Backup restaurado correctamente");

      // Retornar custom_data si existe
      return _custom_data;
    } catch (error) {
      console.error("Error restoring backup:", error);
      throw error;
    }
  }

  // Limpiar backups antiguos (mantener solo MAX_BACKUPS)
  private async cleanOldBackups(): Promise<void> {
    const backups = await this.listBackups();

    if (backups.length <= this.MAX_BACKUPS) {
      return;
    }

    // Eliminar los más antiguos
    const toDelete = backups.slice(this.MAX_BACKUPS);

    for (const backup of toDelete) {
      try {
        await FileSystem.deleteAsync(backup.uri, { idempotent: true });
        console.log("🗑️ Backup antiguo eliminado:", backup.fileName);
      } catch (error) {
        console.error("Error deleting old backup:", error);
      }
    }
  }

  // Exportar backup para compartir
  async exportBackup(backupUri?: string): Promise<void> {
    try {
      let uri = backupUri;

      if (!uri) {
        // Crear nuevo backup si no se especifica uno
        uri = await this.createBackup();
      }

      await Sharing.shareAsync(uri, {
        mimeType: "application/json",
        dialogTitle: "Exportar Backup",
      });
    } catch (error) {
      console.error("Error exporting backup:", error);
      throw error;
    }
  }

  // Importar backup desde archivo externo
  async importBackup(externalUri: string): Promise<void> {
    try {
      // Copiar a directorio de backups
      const fileName = `backup_imported_${Date.now()}.json`;
      const destUri = `${this.BACKUP_DIR}${fileName}`;

      await FileSystem.copyAsync({
        from: externalUri,
        to: destUri,
      });

      console.log("Backup importado:", fileName);
    } catch (error) {
      console.error("Error importing backup:", error);
      throw error;
    }
  }

  // Programar backup automático (llamar en App.tsx)
  async scheduleAutoBackup(): Promise<void> {
    const lastBackupKey = "@last_backup_date";

    try {
      const lastBackup = await AsyncStorage.getItem(lastBackupKey);
      const lastBackupDate = lastBackup ? new Date(lastBackup) : null;
      const now = new Date();

      // Verificar si han pasado 24 horas
      if (
        !lastBackupDate ||
        now.getTime() - lastBackupDate.getTime() > 24 * 60 * 60 * 1000
      ) {
        await this.createBackup();
        await AsyncStorage.setItem(lastBackupKey, now.toISOString());
        console.log("Backup automático completado");
      } else {
        console.log("Backup automático no necesario aún");
      }
    } catch (error) {
      console.error("Error in auto backup:", error);
    }
  }

  // Obtener estadísticas de backups
  async getBackupStats(): Promise<{
    totalBackups: number;
    totalSize: number;
    totalSizeMB: number;
    oldestBackup: Date | null;
    newestBackup: Date | null;
  }> {
    const backups = await this.listBackups();
    const totalSize = backups.reduce((sum, b) => sum + b.size, 0);

    return {
      totalBackups: backups.length,
      totalSize,
      totalSizeMB: parseFloat((totalSize / (1024 * 1024)).toFixed(2)),
      oldestBackup:
        backups.length > 0 ? backups[backups.length - 1].date : null,
      newestBackup: backups.length > 0 ? backups[0].date : null,
    };
  }

  // Eliminar todos los backups
  async deleteAllBackups(): Promise<void> {
    const backups = await this.listBackups();

    for (const backup of backups) {
      await FileSystem.deleteAsync(backup.uri, { idempotent: true });
    }

    console.log("Todos los backups eliminados");
  }
}

export default new BackupService();
