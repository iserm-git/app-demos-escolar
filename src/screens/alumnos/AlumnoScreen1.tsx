import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

// Importamos los tipos
import { RootStackParamList } from "../../navigation/StackNavigator";
import {
  Alumno,
  ScreenState,
  LoadingState,
  COLORS,
  FONT_SIZES,
} from "../../../types";

// Importamos componentes
import ModalAlumno from "../../utils/ModalAlumno";

// Imagen por defecto para alumnos
const alumnoImage = require("../../../assets/alumno_image1.png");

/**
 * Tipo para las props de navegación de esta pantalla
 */
type AlumnoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AlumnoList"
>;

/**
 * Props que recibe el componente AlumnoScreen
 */
interface AlumnoScreenProps {
  navigation: AlumnoScreenNavigationProp;
}

/**
 * Props para el componente de item de alumno
 */
interface AlumnoItemProps {
  alumno: Alumno;
  onPress: (alumno: Alumno) => void;
  onShowModal: (alumno: Alumno) => void;
  fadeAnim: Animated.Value;
}

/**
 * Componente para renderizar un item individual de alumno
 */
const AlumnoItem: React.FC<AlumnoItemProps> = ({
  alumno,
  onPress,
  onShowModal,
  fadeAnim,
}) => {
  return (
    <Animated.View style={[styles.alumnoCard, { opacity: fadeAnim }]}>
      <Image source={alumnoImage} style={styles.alumnoImage} />
      <View style={styles.alumnoInfo}>
        <Text style={styles.alumnoNombre} numberOfLines={2}>
          {alumno.nombre}
        </Text>
        <Text style={styles.alumnoSem}>Semestre: {alumno.sem}</Text>
        {alumno.carrera && (
          <Text style={styles.alumnoCarrera}>Carrera: {alumno.carrera}</Text>
        )}

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => onPress(alumno)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="visibility" size={16} color={COLORS.surface} />
            <Text style={styles.buttonText}>Ver Detalles</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => onShowModal(alumno)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="info" size={16} color={COLORS.primary} />
            <Text style={styles.modalButtonText}>Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

/**
 * Pantalla principal de lista de alumnos
 * Muestra todos los alumnos registrados en el sistema
 */
const AlumnoScreen: React.FC<AlumnoScreenProps> = ({ navigation }) => {
  // Estados principales
  const [screenState, setScreenState] = useState<ScreenState<Alumno>>({
    data: [],
    loading: "idle",
    error: { hasError: false },
  });

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Animación de fade
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /**
   * Datos mock de alumnos - En una app real vendrían de una API
   */
  const mockAlumnos: Alumno[] = [
    {
      id: 1,
      nombre: "Juan Pérez García",
      sem: "7A",
      carrera: "ISC",
      email: "juan.perez@escuela.edu.mx",
    },
    {
      id: 2,
      nombre: "Ana Gómez López",
      sem: "7A",
      carrera: "ISC",
      email: "ana.gomez@escuela.edu.mx",
    },
    {
      id: 3,
      nombre: "Luis Martínez Hernández",
      sem: "7B",
      carrera: "ISC",
      email: "luis.martinez@escuela.edu.mx",
    },
    {
      id: 4,
      nombre: "Francisco Núñez Silva",
      sem: "7A",
      carrera: "ISC",
      email: "francisco.nunez@escuela.edu.mx",
    },
    {
      id: 5,
      nombre: "Berenice Aguilar Rojas",
      sem: "7A",
      carrera: "ISC",
      email: "berenice.aguilar@escuela.edu.mx",
    },
    {
      id: 6,
      nombre: "José Hurtado Morales",
      sem: "7B",
      carrera: "ISC",
      email: "jose.hurtado@escuela.edu.mx",
    },
  ];

  /**
   * Efecto para cargar los datos al montar el componente
   */
  useEffect(() => {
    loadAlumnos();
    startFadeAnimation();
  }, []);

  /**
   * Inicia la animación de fade
   */
  const startFadeAnimation = (): void => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  /**
   * Simula la carga de alumnos desde un servidor
   */
  const loadAlumnos = async (): Promise<void> => {
    setScreenState((prev) => ({
      ...prev,
      loading: "loading",
      error: { hasError: false },
    }));

    try {
      // Simulamos delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setScreenState((prev) => ({
        ...prev,
        data: mockAlumnos,
        loading: "success",
      }));
    } catch (error) {
      setScreenState((prev) => ({
        ...prev,
        loading: "error",
        error: {
          hasError: true,
          message: "Error al cargar los alumnos",
        },
      }));
    }
  };

  /**
   * Maneja el refresh de la lista
   */
  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadAlumnos();
    setRefreshing(false);
  };

  /**
   * Navega a la pantalla de detalles del alumno
   */
  const handleAlumnoPress = (alumno: Alumno): void => {
    navigation.navigate("AlumnoDetails", {
      nombre: alumno.nombre,
      id: alumno.id,
    });
  };

  /**
   * Muestra el modal con información del alumno
   */
  const handleShowModal = (alumno: Alumno): void => {
    setSelectedAlumno(alumno);
    setModalVisible(true);
  };

  /**
   * Cierra el modal
   */
  const handleCloseModal = (): void => {
    setModalVisible(false);
    setSelectedAlumno(null);
  };

  /**
   * Renderiza el header de la pantalla
   */
  const renderHeader = (): JSX.Element => (
    <View style={styles.headerBar}>
      <TouchableOpacity style={styles.iconButton}>
        <MaterialIcons name="school" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Lista de Alumnos</Text>
      <TouchableOpacity style={styles.iconButton}>
        <Text style={styles.countText}>{screenState.data.length}</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renderiza el estado de carga
   */
  const renderLoading = (): JSX.Element => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Cargando alumnos...</Text>
    </View>
  );

  /**
   * Renderiza el estado de error
   */
  const renderError = (): JSX.Element => (
    <View style={styles.centerContainer}>
      <MaterialIcons name="error-outline" size={64} color={COLORS.error} />
      <Text style={styles.errorText}>
        {screenState.error.message || "Error desconocido"}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadAlumnos}>
        <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renderiza la lista vacía
   */
  const renderEmpty = (): JSX.Element => (
    <View style={styles.centerContainer}>
      <MaterialIcons
        name="person-outline"
        size={64}
        color={COLORS.textSecondary}
      />
      <Text style={styles.emptyText}>No hay alumnos registrados</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      {screenState.loading === "loading" ? (
        renderLoading()
      ) : screenState.error.hasError ? (
        renderError()
      ) : screenState.data.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList<Alumno>
          data={screenState.data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AlumnoItem
              alumno={item}
              onPress={handleAlumnoPress}
              onShowModal={handleShowModal}
              fadeAnim={fadeAnim}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      )}

      {/* Modal de información */}
      <ModalAlumno
        visible={modalVisible}
        onClose={handleCloseModal}
        alumno={selectedAlumno}
      />
    </View>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.surface,
    textAlign: "center",
    flex: 1,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  countText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.surface,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    textAlign: "center",
  },
  listContainer: {
    padding: 16,
  },
  alumnoCard: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  alumnoImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  alumnoInfo: {
    flex: 1,
    justifyContent: "center",
  },
  alumnoNombre: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  alumnoSem: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  alumnoCarrera: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  detailButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  modalButton: {
    flexDirection: "row",
    backgroundColor: "transparent",
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    gap: 4,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.small,
    fontWeight: "600",
  },
  modalButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.small,
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  errorText: {
    marginTop: 16,
    fontSize: FONT_SIZES.medium,
    color: COLORS.error,
    textAlign: "center",
  },
  emptyText: {
    marginTop: 16,
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
});

export default AlumnoScreen;
