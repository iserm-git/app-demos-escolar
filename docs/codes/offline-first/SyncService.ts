// services/SyncService.ts
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RealmService from "./RealmService";
import { SyncableTask } from "../models/SyncableTask";

class SyncService {
  private isSyncing = false;
  private syncQueue: string[] = [];

  // Verificar conectividad
  async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }

  // Guardar tarea (siempre en local primero)
  async saveTask(title: string): Promise<SyncableTask> {
    const realm = RealmService.getRealm();
    let task: SyncableTask;

    realm.write(() => {
      task = realm.create<SyncableTask>("SyncableTask", {
        _id: new Realm.BSON.ObjectId(),
        localId: `local_${Date.now()}`,
        title,
        completed: false,
        syncStatus: "pending",
        needsSync: true,
      });
    });

    // Intentar sincronizar
    this.enqueueSyncTask(task!.localId);
    this.processSyncQueue();

    return task!;
  }

  // Actualizar tarea
  async updateTask(
    localId: string,
    updates: Partial<SyncableTask>
  ): Promise<void> {
    const realm = RealmService.getRealm();
    const task = realm
      .objects<SyncableTask>("SyncableTask")
      .filtered("localId == $0", localId)[0];

    if (!task) return;

    realm.write(() => {
      Object.assign(task, updates);
      task.updatedAt = new Date();
      task.needsSync = true;
      task.syncStatus = "pending";
    });

    this.enqueueSyncTask(localId);
    this.processSyncQueue();
  }

  // Agregar a cola de sincronización
  private enqueueSyncTask(localId: string): void {
    if (!this.syncQueue.includes(localId)) {
      this.syncQueue.push(localId);
    }
  }

  // Procesar cola de sincronización
  async processSyncQueue(): Promise<void> {
    if (this.isSyncing || this.syncQueue.length === 0) return;

    const online = await this.isOnline();
    if (!online) {
      console.log("Sin conexión, sincronización pospuesta");
      return;
    }

    this.isSyncing = true;
    console.log(`Sincronizando ${this.syncQueue.length} tareas...`);

    while (this.syncQueue.length > 0) {
      const localId = this.syncQueue.shift()!;
      await this.syncTaskToServer(localId);
    }

    this.isSyncing = false;
    console.log("Sincronización completada");
  }

  // Sincronizar tarea individual con servidor
  private async syncTaskToServer(localId: string): Promise<void> {
    const realm = RealmService.getRealm();
    const task = realm
      .objects<SyncableTask>("SyncableTask")
      .filtered("localId == $0", localId)[0];

    if (!task || !task.needsSync) return;

    // Actualizar estado
    realm.write(() => {
      task.syncStatus = "syncing";
    });

    try {
      // Simular llamada a API
      const serverData = await this.sendToServer(task);

      // Actualizar con datos del servidor
      realm.write(() => {
        task.serverId = serverData.id;
        task.syncStatus = "synced";
        task.needsSync = false;
        task.lastSyncAt = new Date();
      });

      console.log(`Tarea ${localId} sincronizada`);
    } catch (error) {
      console.error(`Error sincronizando ${localId}:`, error);
      realm.write(() => {
        task.syncStatus = "error";
      });

      // Reintentar después
      setTimeout(() => this.enqueueSyncTask(localId), 5000);
    }
  }

  // Simular envío al servidor
  private async sendToServer(task: SyncableTask): Promise<{ id: string }> {
    // Simular latencia de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simular respuesta del servidor
    if (Math.random() > 0.9) {
      throw new Error("Simulated network error");
    }

    return {
      id: `server_${Date.now()}`,
    };
  }

  // Sincronización completa (pull desde servidor)
  async fullSync(): Promise<void> {
    const online = await this.isOnline();
    if (!online) {
      throw new Error("Sin conexión a internet");
    }

    console.log("Iniciando sincronización completa...");

    // 1. Push: Enviar cambios locales
    await this.processSyncQueue();

    // 2. Pull: Obtener cambios del servidor
    await this.pullFromServer();

    console.log("Sincronización completa finalizada");
  }

  // Obtener cambios desde el servidor
  private async pullFromServer(): Promise<void> {
    const realm = RealmService.getRealm();
    const lastSyncKey = "@last_sync_timestamp";

    try {
      // Obtener timestamp de última sincronización
      const lastSyncStr = await AsyncStorage.getItem(lastSyncKey);
      const lastSync = lastSyncStr ? new Date(lastSyncStr) : new Date(0);

      // Simular obtención de datos del servidor
      const serverTasks = await this.fetchFromServer(lastSync);

      // Actualizar base de datos local
      realm.write(() => {
        serverTasks.forEach((serverTask) => {
          const existingTask = realm
            .objects<SyncableTask>("SyncableTask")
            .filtered("serverId == $0", serverTask.serverId)[0];

          if (existingTask) {
            // Actualizar tarea existente
            Object.assign(existingTask, {
              title: serverTask.title,
              completed: serverTask.completed,
              syncStatus: "synced",
              needsSync: false,
              lastSyncAt: new Date(),
            });
          } else {
            // Crear nueva tarea
            realm.create<SyncableTask>("SyncableTask", {
              _id: new Realm.BSON.ObjectId(),
              localId: `local_${Date.now()}_${Math.random()}`,
              serverId: serverTask.serverId,
              title: serverTask.title,
              completed: serverTask.completed,
              syncStatus: "synced",
              needsSync: false,
              lastSyncAt: new Date(),
            });
          }
        });
      });

      // Guardar timestamp de sincronización
      await AsyncStorage.setItem(lastSyncKey, new Date().toISOString());
      console.log("Pull completado");
    } catch (error) {
      console.error("Error en pull:", error);
      throw error;
    }
  }

  // Simular obtención desde servidor
  private async fetchFromServer(since: Date): Promise<any[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Simular datos del servidor
    return [];
  }

  // Obtener estadísticas de sincronización
  getSyncStats() {
    const realm = RealmService.getRealm();
    const tasks = realm.objects<SyncableTask>("SyncableTask");

    return {
      total: tasks.length,
      synced: tasks.filtered('syncStatus == "synced"').length,
      pending: tasks.filtered('syncStatus == "pending"').length,
      syncing: tasks.filtered('syncStatus == "syncing"').length,
      errors: tasks.filtered('syncStatus == "error"').length,
    };
  }

  // Limpiar tareas sincronizadas antiguas
  async cleanOldSyncedTasks(daysOld: number = 30): Promise<number> {
    const realm = RealmService.getRealm();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const oldTasks = realm
      .objects<SyncableTask>("SyncableTask")
      .filtered('syncStatus == "synced" AND lastSyncAt < $0', cutoffDate);

    const count = oldTasks.length;

    realm.write(() => {
      realm.delete(oldTasks);
    });

    return count;
  }
}

export default new SyncService();
