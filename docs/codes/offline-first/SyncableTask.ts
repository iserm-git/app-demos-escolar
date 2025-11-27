// models/SyncableTask.ts
import Realm from "realm";

export class SyncableTask extends Realm.Object<SyncableTask> {
  _id!: Realm.BSON.ObjectId;
  localId!: string; // ID local único
  serverId?: string; // ID del servidor (cuando se sincroniza)
  title!: string;
  completed!: boolean;

  // Estados de sincronización
  syncStatus!: "pending" | "syncing" | "synced" | "error";
  needsSync!: boolean;
  lastSyncAt?: Date;

  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: "SyncableTask",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      localId: "string",
      serverId: "string?",
      title: "string",
      completed: { type: "bool", default: false },
      syncStatus: { type: "string", default: "pending" },
      needsSync: { type: "bool", default: true },
      lastSyncAt: "date?",
      createdAt: { type: "date", default: () => new Date() },
      updatedAt: { type: "date", default: () => new Date() },
    },
  };
}
