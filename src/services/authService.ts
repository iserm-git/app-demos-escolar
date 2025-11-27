import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";

/**
 * Interfaz para la respuesta de autenticación
 */
interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}

/**
 * Servicio de autenticación con Firebase
 * Maneja todas las operaciones relacionadas con la autenticación de usuarios
 */
export const authService = {
  /**
   * Iniciar sesión con email y contraseña
   * @param email - Correo electrónico del usuario
   * @param password - Contraseña del usuario
   * @returns Promise con el resultado de la autenticación
   */
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log(
        "Usuario autenticado exitosamente:",
        userCredential.user.email
      );

      return {
        success: true,
        user: userCredential.user,
        message: "Inicio de sesión exitoso",
      };
    } catch (error: any) {
      console.error("Error en signIn:", error.code, error.message);

      // Mensajes de error en español según el código de error
      let errorMessage = "Error al iniciar sesión";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "El correo electrónico no es válido";
          break;
        case "auth/user-disabled":
          errorMessage = "Esta cuenta ha sido deshabilitada";
          break;
        case "auth/user-not-found":
          errorMessage = "No existe una cuenta con este correo";
          break;
        case "auth/wrong-password":
          errorMessage = "Contraseña incorrecta";
          break;
        case "auth/invalid-credential":
          errorMessage =
            "Credenciales inválidas. Verifica tu correo y contraseña";
          break;
        case "auth/network-request-failed":
          errorMessage = "Error de conexión. Verifica tu internet";
          break;
        case "auth/too-many-requests":
          errorMessage = "Demasiados intentos fallidos. Intenta más tarde";
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Registrar nuevo usuario
   * @param email - Correo electrónico del nuevo usuario
   * @param password - Contraseña del nuevo usuario
   * @returns Promise con el resultado del registro
   */
  signUp: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log(
        "Usuario registrado exitosamente:",
        userCredential.user.email
      );

      return {
        success: true,
        user: userCredential.user,
        message: "Usuario creado exitosamente",
      };
    } catch (error: any) {
      console.error("Error en signUp:", error.code, error.message);

      let errorMessage = "Error al crear usuario";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Este correo ya está registrado";
          break;
        case "auth/invalid-email":
          errorMessage = "El correo electrónico no es válido";
          break;
        case "auth/weak-password":
          errorMessage = "La contraseña debe tener al menos 6 caracteres";
          break;
        case "auth/network-request-failed":
          errorMessage = "Error de conexión. Verifica tu internet";
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Cerrar sesión del usuario actual
   * @returns Promise con el resultado del cierre de sesión
   */
  signOut: async (): Promise<AuthResponse> => {
    try {
      await firebaseSignOut(auth);
      console.log("Sesión cerrada exitosamente");

      return {
        success: true,
        message: "Sesión cerrada correctamente",
      };
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);

      return {
        success: false,
        error: "Error al cerrar sesión. Intenta nuevamente",
      };
    }
  },

  /**
   * Enviar correo de recuperación de contraseña
   * @param email - Correo electrónico del usuario
   * @returns Promise con el resultado
   */
  resetPassword: async (email: string): Promise<AuthResponse> => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Correo de recuperación enviado a:", email);

      return {
        success: true,
        message: "Se ha enviado un correo para restablecer tu contraseña",
      };
    } catch (error: any) {
      console.error("Error al enviar correo de recuperación:", error);

      let errorMessage = "Error al enviar correo de recuperación";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "El correo electrónico no es válido";
          break;
        case "auth/user-not-found":
          errorMessage = "No existe una cuenta con este correo";
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Obtener el usuario actual autenticado
   * @returns Usuario actual o null si no hay sesión
   */
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  /**
   * Observador de cambios en el estado de autenticación
   * @param callback - Función que se ejecuta cuando cambia el estado
   * @returns Función para cancelar la suscripción
   */
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Verificar si hay un usuario autenticado
   * @returns true si hay un usuario autenticado, false en caso contrario
   */
  isAuthenticated: (): boolean => {
    return auth.currentUser !== null;
  },
};

export default authService;
