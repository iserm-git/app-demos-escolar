// Conflicto: Mismo recurso modificado en local y servidor

enum ConflictResolution {
  SERVER_WINS = "server", // Servidor tiene prioridad
  CLIENT_WINS = "client", // Cliente tiene prioridad
  LAST_WRITE_WINS = "lww", // Última escritura gana
  MANUAL = "manual", // Usuario decide
}

class ConflictResolver {
  resolve(
    localTask: SyncableTask,
    serverTask: any,
    strategy: ConflictResolution
  ): SyncableTask {
    switch (strategy) {
      case ConflictResolution.SERVER_WINS:
        return { ...localTask, ...serverTask };

      case ConflictResolution.CLIENT_WINS:
        return localTask;

      case ConflictResolution.LAST_WRITE_WINS:
        return localTask.updatedAt > new Date(serverTask.updatedAt)
          ? localTask
          : { ...localTask, ...serverTask };

      case ConflictResolution.MANUAL:
        // Mostrar UI para que usuario elija
        return localTask;
    }
  }
}
