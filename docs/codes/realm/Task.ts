// models/Task.ts
import Realm from "realm";

export class Task extends Realm.Object<Task> {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  description?: string;
  completed!: boolean;
  priority!: "low" | "medium" | "high";
  dueDate?: Date;
  category?: Category;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: "Task",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      title: "string",
      description: "string?",
      completed: { type: "bool", default: false },
      priority: { type: "string", default: "medium" },
      dueDate: "date?",
      category: "Category?",
      createdAt: { type: "date", default: () => new Date() },
    },
  };
}

export class Category extends Realm.Object<Category> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  color!: string;
  tasks!: Realm.List<Task>;

  static schema: Realm.ObjectSchema = {
    name: "Category",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      name: "string",
      color: "string",
      tasks: {
        type: "linkingObjects",
        objectType: "Task",
        property: "category",
      },
    },
  };
}
