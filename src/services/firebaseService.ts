import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Alumno, AlumnoFormData } from "../../types/index";

// ==========================================
// SERVICIO DE ALUMNOS
// ==========================================

export const alumnoService = {
  /**
   * Crear un nuevo alumno
   */
  create: async (data: AlumnoFormData): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, "alumnos"), {
        ...data,
        createdAt: Timestamp.now(),
        activo: true,
      });
      console.log("Alumno creado con ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error al crear alumno:", error);
      throw error;
    }
  },

  /**
   * Obtener todos los alumnos
   */
  getAll: async (): Promise<Alumno[]> => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "alumnos"), orderBy("nombre", "asc"))
      );

      const alumnos: Alumno[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id as any, // Convertir string a número si es necesario
            ...doc.data(),
          } as Alumno)
      );

      return alumnos;
    } catch (error) {
      console.error("Error al obtener alumnos:", error);
      throw error;
    }
  },

  /**
   * Obtener alumnos por carrera
   */
  getByCarrera: async (carrera: string): Promise<Alumno[]> => {
    try {
      const q = query(
        collection(db, "alumnos"),
        where("carrera", "==", carrera),
        orderBy("nombre", "asc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id as any,
            ...doc.data(),
          } as Alumno)
      );
    } catch (error) {
      console.error("Error al obtener alumnos por carrera:", error);
      throw error;
    }
  },

  /**
   * Obtener un alumno por ID
   */
  getById: async (id: string): Promise<Alumno | null> => {
    try {
      const docRef = doc(db, "alumnos", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id as any,
          ...docSnap.data(),
        } as Alumno;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener alumno:", error);
      throw error;
    }
  },

  /**
   * Actualizar alumno
   */
  update: async (id: string, data: Partial<AlumnoFormData>): Promise<void> => {
    try {
      const docRef = doc(db, "alumnos", id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
      console.log("Alumno actualizado:", id);
    } catch (error) {
      console.error("Error al actualizar alumno:", error);
      throw error;
    }
  },

  /**
   * Eliminar alumno (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, "alumnos", id);
      await updateDoc(docRef, {
        activo: false,
        deletedAt: Timestamp.now(),
      });
      console.log("Alumno desactivado:", id);
    } catch (error) {
      console.error("Error al eliminar alumno:", error);
      throw error;
    }
  },

  /**
   * Eliminar alumno permanentemente
   */
  deletePermanent: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "alumnos", id));
      console.log("Alumno eliminado permanentemente:", id);
    } catch (error) {
      console.error("Error al eliminar permanentemente:", error);
      throw error;
    }
  },
};
