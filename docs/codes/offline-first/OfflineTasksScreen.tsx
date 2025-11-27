// screens/OfflineTasksScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import SyncService from "../services/SyncService";
import RealmService from "../services/RealmService";
import { SyncableTask } from "../models/SyncableTask";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

const OfflineTasksScreen: React.FC = () => {
  const [tasks, setTasks] = useState<SyncableTask[]>([]);
  const [newTask, setNewTask] = useState("");
  const [stats, setStats] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);

  const { isOnline, connectionType } = useNetworkStatus();

  useEffect(() => {
    initRealm();
  }, []);

  const initRealm = async () => {
    await RealmService.init();
    loadTasks();
    loadStats();

    // Listener reactivo
    const realmTasks =
      RealmService.getRealm().objects<SyncableTask>("SyncableTask");
    realmTasks.addListener(() => {
      setTasks([...realmTasks]);
      loadStats();
    });

    return () => realmTasks.removeAllListeners();
  };

  const loadTasks = () => {
    const realmTasks = RealmService.getRealm()
      .objects<SyncableTask>("SyncableTask")
      .sorted("createdAt", true);
    setTasks([...realmTasks]);
  };

  const loadStats = () => {
    const syncStats = SyncService.getSyncStats();
    setStats(syncStats);
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await SyncService.saveTask(newTask);
    setNewTask("");
  };

  const handleToggle = async (task: SyncableTask) => {
    await SyncService.updateTask(task.localId, {
      completed: !task.completed,
    });
  };

  const handleFullSync = async () => {
    if (!isOnline) {
      alert("Sin conexión a internet");
      return;
    }

    setRefreshing(true);
    try {
      await SyncService.fullSync();
      alert("Sincronización completada");
    } catch (error) {
      alert("Error en sincronización");
    } finally {
      setRefreshing(false);
    }
  };

  const getSyncIcon = (status: string) => {
    switch (status) {
      case "synced":
        return "✅";
      case "syncing":
        return "🔄";
      case "pending":
        return "⏳";
      case "error":
        return "❌";
      default:
        return "❓";
    }
  };

  const renderTask = ({ item }: { item: SyncableTask }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        onPress={() => handleToggle(item)}
        style={styles.taskContent}
      >
        <Text style={[styles.taskTitle, item.completed && styles.completed]}>
          {item.completed ? "✅" : "⭕"} {item.title}
        </Text>
        <Text style={styles.taskMeta}>
          {getSyncIcon(item.syncStatus)} {item.syncStatus}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Banner de conectividad */}
      <View style={[styles.banner, isOnline ? styles.online : styles.offline]}>
        <Text style={styles.bannerText}>
          {isOnline ? `🟢 Online (${connectionType})` : "🔴 Offline"}
        </Text>
      </View>

      {/* Estadísticas */}
      <View style={styles.stats}>
        <Text style={styles.statsText}>
          Total: {stats.total} | Sincronizadas: {stats.synced} | Pendientes:{" "}
          {stats.pending}
        </Text>
      </View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nueva tarea..."
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={handleAddTask}
        />
        <Button title="+" onPress={handleAddTask} />
      </View>

      {/* Botón de sincronización */}
      <Button
        title="🔄 Sincronizar Ahora"
        onPress={handleFullSync}
        disabled={!isOnline || refreshing}
        color="#3498db"
      />

      {/* Lista */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.localId}
        renderItem={renderTask}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleFullSync} />
        }
        ListEmptyComponent={<Text style={styles.empty}>Sin tareas</Text>}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  banner: {
    padding: 10,
    alignItems: "center",
  },
  online: { backgroundColor: "#d4edda" },
  offline: { backgroundColor: "#f8d7da" },
  bannerText: { fontSize: 14, fontWeight: "bold" },
  stats: {
    padding: 10,
    backgroundColor: "#e3f2fd",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  statsText: { fontSize: 12, color: "#1976d2" },
  inputContainer: {
    flexDirection: "row",
    padding: 15,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
  },
  list: { flex: 1, paddingHorizontal: 15 },
  taskItem: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
    borderRadius: 8,
  },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 16, color: "#333" },
  completed: { textDecorationLine: "line-through", color: "#999" },
  taskMeta: { fontSize: 12, color: "#666", marginTop: 4 },
  empty: { textAlign: "center", color: "#999", marginTop: 50 },
});

export default OfflineTasksScreen;
