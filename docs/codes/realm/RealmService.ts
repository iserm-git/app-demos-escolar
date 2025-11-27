// services/RealmService.ts
import Realm from "realm";
import { Task, Category } from "../models/Task";

class RealmService {
  private realm: Realm | null = null;

  // Inicializar Realm
  async init(): Promise<void> {
    if (this.realm) return;

    this.realm = await Realm.open({
      schema: [Task, Category],
      schemaVersion: 1,
    });

    console.log("Realm initialized");
  }

  getRealm(): Realm {
    if (!this.realm) throw new Error("Realm not initialized");
    return this.realm;
  }

  // ===== CRUD TAREAS =====

  createTask(data: {
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    categoryId?: string;
  }): Task {
    const realm = this.getRealm();
    let task: Task;

    realm.write(() => {
      task = realm.create<Task>("Task", {
        _id: new Realm.BSON.ObjectId(),
        title: data.title,
        description: data.description,
        completed: false,
        priority: data.priority || "medium",
        createdAt: new Date(),
      });

      // Vincular categoría si existe
      if (data.categoryId) {
        const category = realm.objectForPrimaryKey<Category>(
          "Category",
          new Realm.BSON.ObjectId(data.categoryId)
        );
        if (category) {
          task.category = category;
        }
      }
    });

    return task!;
  }

  getTasks(): Realm.Results<Task> {
    const realm = this.getRealm();
    return realm.objects<Task>("Task").sorted("createdAt", true);
  }

  getTaskById(id: string): Task | null {
    const realm = this.getRealm();
    return realm.objectForPrimaryKey<Task>("Task", new Realm.BSON.ObjectId(id));
  }

  updateTask(id: string, updates: Partial<Task>): void {
    const realm = this.getRealm();
    const task = this.getTaskById(id);

    if (!task) throw new Error("Task not found");

    realm.write(() => {
      Object.assign(task, updates);
    });
  }

  deleteTask(id: string): void {
    const realm = this.getRealm();
    const task = this.getTaskById(id);

    if (!task) return;

    realm.write(() => {
      realm.delete(task);
    });
  }

  toggleTaskCompletion(id: string): void {
    const task = this.getTaskById(id);
    if (task) {
      this.updateTask(id, { completed: !task.completed });
    }
  }

  // ===== QUERIES AVANZADAS =====

  getCompletedTasks(): Realm.Results<Task> {
    const realm = this.getRealm();
    return realm.objects<Task>("Task").filtered("completed == true");
  }

  getPendingTasks(): Realm.Results<Task> {
    const realm = this.getRealm();
    return realm.objects<Task>("Task").filtered("completed == false");
  }

  searchTasks(query: string): Realm.Results<Task> {
    const realm = this.getRealm();
    return realm
      .objects<Task>("Task")
      .filtered("title CONTAINS[c] $0 OR description CONTAINS[c] $0", query);
  }

  getTasksByPriority(priority: "low" | "medium" | "high"): Realm.Results<Task> {
    const realm = this.getRealm();
    return realm.objects<Task>("Task").filtered("priority == $0", priority);
  }

  // ===== CATEGORÍAS =====

  createCategory(name: string, color: string): Category {
    const realm = this.getRealm();
    let category: Category;

    realm.write(() => {
      category = realm.create<Category>("Category", {
        _id: new Realm.BSON.ObjectId(),
        name,
        color,
      });
    });

    return category!;
  }

  getCategories(): Realm.Results<Category> {
    const realm = this.getRealm();
    return realm.objects<Category>("Category").sorted("name");
  }

  // ===== ESTADÍSTICAS =====

  getStats() {
    const realm = this.getRealm();
    const tasks = realm.objects<Task>("Task");

    return {
      total: tasks.length,
      completed: tasks.filtered("completed == true").length,
      pending: tasks.filtered("completed == false").length,
      highPriority: tasks.filtered('priority == "high"').length,
    };
  }

  // Cerrar Realm
  close(): void {
    if (this.realm && !this.realm.isClosed) {
      this.realm.close();
      this.realm = null;
    }
  }
}

export default new RealmService();
