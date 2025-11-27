// screens/TasksScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import FirebaseAuthService from "../services/FirebaseAuthService";
import FirestoreService from "../services/FirestoreService";

interface Task {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
}

const TasksScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = FirebaseAuthService.getCurrentUser();
    if (!user) {
      navigation.replace("Login");
      return;
    }

    // 🔥 Suscribirse a cambios en tiempo real
    const unsubscribe = FirestoreService.subscribeToUserTasks(
      user.uid,
      (updatedTasks) => {
        setTasks(updatedTasks);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    const user = FirebaseAuthService.getCurrentUser();
    if (!user) return;

    try {
      setLoading(true);
      await FirestoreService.createTask({
        title: newTask,
        description: "",
        completed: false,
        userId: user.uid,
      });
      setNewTask("");
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (task: Task) => {
    if (!task.id) return;
    await FirestoreService.updateTask(task.id, {
      completed: !task.completed,
    });
  };

  const handleDelete = async (taskId: string) => {
    await FirestoreService.deleteTask(taskId);
  };

  const handleLogout = async () => {
    await FirebaseAuthService.logout();
    navigation.replace("Login");
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        onPress={() => handleToggle(item)}
        style={styles.taskContent}
      >
        <Text style={[styles.taskTitle, item.completed && styles.completed]}>
          {item.completed ? "OK" : "NO OK"} {item.title}
        </Text>
        <Text style={styles.taskDate}>
          {item.createdAt.toLocaleDateString("es-MX")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item.id!)}>
        <Text style={styles.deleteBtn}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Tareas ({tasks.length})</Text>
        <Button title="Salir" onPress={handleLogout} color="#e74c3c" />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nueva tarea..."
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={handleAddTask}
        />
        <Button title="+" onPress={handleAddTask} disabled={loading} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id!}
        renderItem={renderTask}
        ListEmptyComponent={<Text style={styles.empty}>Sin tareas</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  inputContainer: { flexDirection: "row", marginBottom: 20, gap: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
  },
  taskItem: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
    borderRadius: 8,
  },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 16, color: "#333" },
  completed: { textDecorationLine: "line-through", color: "#999" },
  taskDate: { fontSize: 12, color: "#666", marginTop: 4 },
  deleteBtn: { fontSize: 20 },
  empty: { textAlign: "center", color: "#999", marginTop: 50 },
});

export default TasksScreen;
