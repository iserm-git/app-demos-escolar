import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Importación de pantallas
import LoginScreen from "../screens/auth/LoginScreen";
import HomeScreen from "../screens/home/HomeScreen";
import AlumnoScreen from "../screens/alumnos/AlumnoScreen";
import AlumnoDetailScreen from "../screens/alumnos/AlumnoDetailScreen";
import ProfesorScreen from "../screens/profesores/ProfesorScreen";
import GrupoScreen from "../screens/grupos/GrupoScreen";
import GrupoDetailScreen from "../screens/grupos/GrupoDetailScreen";
import MateriaScreen from "../screens/materias/MateriaScreen";
import MateriaDetailScreen from "../screens/materias/MateriaDetailScreen";

/**
 * Definición de los tipos para los parámetros de navegación
 * Esto ayuda a TypeScript a entender qué parámetros espera cada pantalla
 */
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  AlumnoList: undefined;
  AlumnoDetails: {
    nombre: string;
    id?: number;
  };
  ProfesorList: undefined;
  ProfesorDetails: {
    nombre: string;
    id?: number;
  };
  MateriaList: undefined;
  MateriaDetails: {
    nombre: string;
    id?: number;
  };
  GrupoList: undefined;
  GrupoDetails: {
    nombre: string;
    id?: number;
  };
};

/**
 * Creamos el Stack Navigator con tipado
 */
const Stack = createStackNavigator<RootStackParamList>();

/**
 * Componente principal de navegación
 * Gestiona todas las rutas de la aplicación
 */
const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#6200ea",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
      }}
    >
      {/* Pantalla de Login */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Iniciar Sesión",
          headerShown: false, // Ocultamos el header en login
        }}
      />

      {/* Pantalla Principal */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Sistema Escolar",
          headerLeft: () => null, // Evitamos el botón de regreso
        }}
      />

      {/* Pantallas de Alumnos */}
      <Stack.Screen
        name="AlumnoList"
        component={AlumnoScreen}
        options={{ title: "Lista de Alumnos" }}
      />
      <Stack.Screen
        name="AlumnoDetails"
        component={AlumnoDetailScreen}
        options={{ title: "Detalle del Alumno" }}
      />

      {/* Pantallas de Profesores */}
      <Stack.Screen
        name="ProfesorList"
        component={ProfesorScreen}
        options={{ title: "Lista de Profesores" }}
      />

      {/* Pantallas de Materias */}
      <Stack.Screen
        name="MateriaList"
        component={MateriaScreen}
        options={{ title: "Lista de Materias" }}
      />

      <Stack.Screen
        name="MateriaDetails"
        component={MateriaDetailScreen}
        options={{ title: "Detalle de la Materia" }}
      />

      {/* Pantallas de Grupos */}
      <Stack.Screen
        name="GrupoList"
        component={GrupoScreen}
        options={{ title: "Lista de Grupos" }}
      />
      <Stack.Screen
        name="GrupoDetails"
        component={GrupoDetailScreen}
        options={{ title: "Detalle del Grupo" }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
