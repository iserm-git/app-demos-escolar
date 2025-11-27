// services/FirestoreService.ts
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

interface Task {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
}

class FirestoreService {
  private readonly COLLECTION = "tasks";

  // Crear tarea
  async createTask(task: Omit<Task, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(collection(db, this.COLLECTION), {
      ...task,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  // Obtener tareas del usuario
  async getUserTasks(userId: string): Promise<Task[]> {
    const q = query(
      collection(db, this.COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        } as Task)
    );
  }

  // Actualizar tarea
  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const taskRef = doc(db, this.COLLECTION, taskId);
    await updateDoc(taskRef, updates);
  }

  // Eliminar tarea
  async deleteTask(taskId: string): Promise<void> {
    await deleteDoc(doc(db, this.COLLECTION, taskId));
  }

  // ESCUCHAR CAMBIOS EN TIEMPO REAL
  subscribeToUserTasks(userId: string, callback: (tasks: Task[]) => void) {
    const q = query(
      collection(db, this.COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          } as Task)
      );
      callback(tasks);
    });
  }

  // Búsqueda
  async searchTasks(userId: string, searchTerm: string): Promise<Task[]> {
    const q = query(
      collection(db, this.COLLECTION),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        } as Task)
    );

    // Filtrar localmente (Firestore no soporta LIKE)
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

export default new FirestoreService();
