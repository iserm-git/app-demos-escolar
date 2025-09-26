import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { CommonActions } from "@react-navigation/native";

// Importamos los tipos
import { RootStackParamList } from "../../navigation/StackNavigator";
import { COLORS, FONT_SIZES } from "../../../types";

/**
 * Tipo para las props de navegación de esta pantalla
 */
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

/**
 * Props que recibe el componente HomeScreen
 */
interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

/**
 * Interfaz para definir las opciones del menú principal
 */
interface MenuOption {
  id: string;
  title: string;
  icon: string;
  iconLibrary: "FontAwesome5" | "MaterialIcons" | "Entypo";
  color: string;
  route?: keyof RootStackParamList;
  onPress?: () => void;
}

/**
 * Pantalla principal del sistema
 * Muestra el menú principal con las opciones disponibles
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Estado para controlar la visibilidad del menú
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  /**
   * Opciones del menú principal
   */
  const menuOptions: MenuOption[] = [
    {
      id: "alumnos",
      title: "Alumnos",
      icon: "user-graduate",
      iconLibrary: "FontAwesome5",
      color: "#2196F3",
      route: "AlumnoList",
    },
    {
      id: "profesores",
      title: "Profesores",
      icon: "briefcase",
      iconLibrary: "Entypo",
      color: "#4CAF50",
      route: "ProfesorList",
    },
    {
      id: "grupos",
      title: "Grupos",
      icon: "users",
      iconLibrary: "FontAwesome5",
      color: "#FF9800",
      route: "GrupoList",
    },
    {
      id: "materias",
      title: "Materias",
      icon: "book",
      iconLibrary: "FontAwesome5",
      color: "#9C27B0",
      route: "MateriaList",
    },
    {
      id: "asistencia",
      title: "Pase de Lista",
      icon: "check-box",
      iconLibrary: "MaterialIcons",
      color: "#00BCD4",
      onPress: () => handleComingSoon("Pase de Lista"),
    },
    {
      id: "calificaciones",
      title: "Calificaciones",
      icon: "bar-chart",
      iconLibrary: "MaterialIcons",
      color: "#F44336",
      onPress: () => handleComingSoon("Calificaciones"),
    },
  ];

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = (): void => {
    setMenuVisible(false);

    // Mostramos confirmación antes de cerrar sesión
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  /**
   * Maneja la navegación al perfil del usuario
   */
  const handleProfile = (): void => {
    console.log("Navegando a perfil de usuario");
    setMenuVisible(false);

    // Aquí iría la navegación al perfil cuando esté implementado
    handleComingSoon("Perfil de Usuario");
  };

  /**
   * Muestra mensaje de funcionalidad próximamente disponible
   */
  const handleComingSoon = (feature: string): void => {
    // Implementación básica por ahora
    console.log(`Funcionalidad: ${feature} - Próximamente disponible`);
  };

  /**
   * Abre el menú de hamburguesa
   */
  const openMenu = (): void => {
    setMenuVisible(true);
  };

  /**
   * Cierra el menú de hamburguesa
   */
  const closeMenu = (): void => {
    setMenuVisible(false);
  };

  /**
   * Maneja la navegación a las diferentes pantallas
   */
  const handleNavigation = (option: MenuOption): void => {
    if (option.route) {
      navigation.navigate(option.route);
    } else if (option.onPress) {
      option.onPress();
    }
  };

  /**
   * Renderiza un icono según la librería especificada
   */
  const renderIcon = (option: MenuOption): JSX.Element => {
    const iconProps = {
      size: 50,
      color: option.color,
    };

    switch (option.iconLibrary) {
      case "FontAwesome5":
        return <FontAwesome5 name={option.icon as any} {...iconProps} />;
      case "MaterialIcons":
        return <MaterialIcons name={option.icon as any} {...iconProps} />;
      case "Entypo":
        return <Entypo name={option.icon as any} {...iconProps} />;
      default:
        return <MaterialIcons name="help-outline" {...iconProps} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="school" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sistema de Gestión Escolar</Text>
        <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
          <MaterialIcons name="menu" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal del menú de hamburguesa */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={closeMenu}
      >
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Menú de Usuario</Text>

            <Pressable style={styles.menuOption} onPress={handleProfile}>
              <MaterialIcons name="person" size={20} color={COLORS.primary} />
              <Text style={styles.menuText}>Mi Perfil</Text>
            </Pressable>

            <Pressable style={styles.menuOption} onPress={handleLogout}>
              <MaterialIcons name="logout" size={20} color={COLORS.error} />
              <Text style={[styles.menuText, { color: COLORS.error }]}>
                Cerrar Sesión
              </Text>
            </Pressable>

            <Pressable style={styles.closeMenuButton} onPress={closeMenu}>
              <Text style={styles.closeMenuText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Grid de opciones principales */}
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>¡Bienvenido al Sistema!</Text>
        <Text style={styles.instructionText}>
          Selecciona una opción para comenzar
        </Text>

        <View style={styles.gridContainer}>
          {menuOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.card}
              onPress={() => handleNavigation(option)}
              activeOpacity={0.7}
            >
              {renderIcon(option)}
              <Text style={styles.cardText}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * Estilos del componente
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.surface,
    flex: 1,
    textAlign: "center",
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 30,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  card: {
    width: "42%",
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: COLORS.text,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  cardText: {
    marginTop: 12,
    fontSize: FONT_SIZES.medium,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  menuContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
  },
  menuTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 20,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  menuText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    marginLeft: 15,
    fontWeight: "500",
  },
  closeMenuButton: {
    alignSelf: "center",
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeMenuText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
});

export default HomeScreen;
