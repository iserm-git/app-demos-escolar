import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

// Importamos los tipos
import { RootStackParamList } from "../../navigation/StackNavigator";
import {
  Profesor,
  ScreenState,
  LoadingState,
  COLORS,
  FONT_SIZES,
} from "../../../types";

// Imagen por defecto para profesores
const profesorImage = require("../../../assets/profesor_image1.png");

/**
 * Tipo para las props de navegación de esta pantalla
 */
type ProfesorScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ProfesorList"
>;

/**
 * Props que recibe el componente ProfesorScreen
 */
interface ProfesorScreenProps {
  navigation: ProfesorScreenNavigationProp;
}

/**
 * Props para el componente de item de profesor
 */
interface ProfesorItemProps {
  profesor: Profesor;
  onPress: (profesor: Profesor) => void;
  onEdit: (profesor: Profesor) => void;
  onDelete: (profesor: Profesor) => void;
  fadeAnim: Animated.Value;
}

/**
 * Props para el filtro de profesores
 */
interface FilterState {
  carrera: string;
  searchText: string;
}

/**
 * Componente para renderizar un item individual de profesor
 */
const ProfesorItem: React.FC<ProfesorItemProps> = ({
  profesor,
  onPress,
  onEdit,
  onDelete,
  fadeAnim,
}) => {
  /**
   * Maneja la confirmación antes de eliminar
   */
  const handleDelete = (): void => {
    Alert.alert(
      "Confirmar Eliminación",
      `¿Estás seguro de que deseas eliminar a ${profesor.nombre}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onDelete(profesor),
        },
      ]
    );
  };

  return (
    <Animated.View style={[styles.profesorCard, { opacity: fadeAnim }]}>
      <Image source={profesorImage} style={styles.profesorImage} />
      <View style={styles.profesorInfo}>
        <Text style={styles.profesorNombre} numberOfLines={2}>
          {profesor.nombre}
        </Text>
        <Text style={styles.profesorCarrera}>Carrera: {profesor.carrera}</Text>
        {profesor.especialidad && (
          <Text style={styles.profesorEspecialidad}>
            {profesor.especialidad}
          </Text>
        )}
        {profesor.email && (
          <Text style={styles.profesorEmail} numberOfLines={1}>
            {profesor.email}
          </Text>
        )}

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => onPress(profesor)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="visibility" size={16} color={COLORS.surface} />
            <Text style={styles.buttonText}>Ver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(profesor)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="edit" size={16} color={COLORS.surface} />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <MaterialIcons name="delete" size={16} color={COLORS.surface} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

/**
 * Pantalla principal de lista de profesores
 * Muestra todos los profesores registrados en el sistema con funciones CRUD
 */
const ProfesorScreen: React.FC<ProfesorScreenProps> = ({ navigation }) => {
  // Estados principales
  const [screenState, setScreenState] = useState<ScreenState<Profesor>>({
    data: [],
    loading: "idle",
    error: { hasError: false },
  });

  const [filteredData, setFilteredData] = useState<Profesor[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterState>({
    carrera: "Todas",
    searchText: "",
  });

  // Animación de fade
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /**
   * Datos mock de profesores - En una app real vendrían de una API
   */
  const mockProfesores: Profesor[] = [
    {
      id: 1,
      nombre: "Dr. Antonio Suárez Zinzun",
      carrera: "ISC",
      especialidad: "Inteligencia Artificial",
      email: "antonio.suarez@escuela.edu.mx",
      telefono: "+52 443 234 5678",
    },
    {
      id: 2,
      nombre: "M.C. Roberto Suárez Zinzun",
      carrera: "ISC",
      especialidad: "Desarrollo Web",
      email: "roberto.suarez@escuela.edu.mx",
      telefono: "+52 443 345 6789",
    },
    {
      id: 3,
      nombre: "Ing. Francisco Rodríguez Díaz",
      carrera: "ISC",
      especialidad: "Redes y Telecomunicaciones",
      email: "francisco.rodriguez@escuela.edu.mx",
      telefono: "+52 443 456 7890",
    },
    {
      id: 4,
      nombre: "Dra. Ana Celia Segundo Sevilla",
      carrera: "ISC",
      especialidad: "Bases de Datos",
      email: "ana.segundo@escuela.edu.mx",
      telefono: "+52 443 567 8901",
    },
    {
      id: 5,
      nombre: "M.C. Claudia Baeza Lara",
      carrera: "IGE",
      especialidad: "Gestión de Proyectos",
      email: "claudia.baeza@escuela.edu.mx",
      telefono: "+52 443 678 9012",
    },
    {
      id: 6,
      nombre: "Dr. Ricardo García Cruz",
      carrera: "IIA",
      especialidad: "Automatización Industrial",
      email: "ricardo.garcia@escuela.edu.mx",
      telefono: "+52 443 789 0123",
    },
  ];

  /**
   * Carreras disponibles para filtrado
   */
  const carrerasDisponibles = ["Todas", "ISC", "IGE", "IIA", "ITICS"];

  /**
   * Efecto para cargar los datos al montar el componente
   */
  useEffect(() => {
    loadProfesores();
    startFadeAnimation();
  }, []);

  /**
   * Efecto para filtrar los datos cuando cambian los filtros
   */
  useEffect(() => {
    applyFilters();
  }, [screenState.data, filter]);

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
   * Simula la carga de profesores desde un servidor
   */
  const loadProfesores = async (): Promise<void> => {
    setScreenState((prev) => ({
      ...prev,
      loading: "loading",
      error: { hasError: false },
    }));

    try {
      // Simulamos delay de red
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setScreenState((prev) => ({
        ...prev,
        data: mockProfesores,
        loading: "success",
      }));
    } catch (error) {
      setScreenState((prev) => ({
        ...prev,
        loading: "error",
        error: {
          hasError: true,
          message: "Error al cargar los profesores",
        },
      }));
    }
  };

  /**
   * Aplica los filtros a los datos
   */
  const applyFilters = (): void => {
    let filtered = screenState.data;

    // Filtro por carrera
    if (filter.carrera !== "Todas") {
      filtered = filtered.filter(
        (profesor) => profesor.carrera === filter.carrera
      );
    }

    // Filtro por texto de búsqueda
    if (filter.searchText.trim() !== "") {
      const searchLower = filter.searchText.toLowerCase();
      filtered = filtered.filter(
        (profesor) =>
          profesor.nombre.toLowerCase().includes(searchLower) ||
          profesor.especialidad?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredData(filtered);
  };

  /**
   * Maneja el refresh de la lista
   */
  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadProfesores();
    setRefreshing(false);
  };

  /**
   * Navega a la pantalla de detalles del profesor
   */
  const handleProfesorPress = (profesor: Profesor): void => {
    navigation.navigate("ProfesorDetails", {
      nombre: profesor.nombre,
      id: profesor.id,
    });
  };

  /**
   * Maneja la edición de un profesor
   */
  const handleEditProfesor = (profesor: Profesor): void => {
    Alert.alert("Editar Profesor", `Editar información de ${profesor.nombre}`, [
      { text: "Próximamente" },
    ]);
  };

  /**
   * Maneja la eliminación de un profesor
   */
  const handleDeleteProfesor = (profesor: Profesor): void => {
    setScreenState((prev) => ({
      ...prev,
      data: prev.data.filter((p) => p.id !== profesor.id),
    }));

    Alert.alert(
      "Profesor Eliminado",
      `${profesor.nombre} ha sido eliminado del sistema.`,
      [{ text: "Entendido" }]
    );
  };

  /**
   * Cambia el filtro de carrera
   */
  const handleCarreraFilter = (carrera: string): void => {
    setFilter((prev) => ({ ...prev, carrera }));
  };

  /**
   * Maneja la adición de un nuevo profesor
   */
  const handleAddProfesor = (): void => {
    Alert.alert(
      "Agregar Profesor",
      "Esta funcionalidad estará disponible próximamente.",
      [{ text: "Entendido" }]
    );
  };

  /**
   * Renderiza el header de la pantalla
   */
  const renderHeader = (): JSX.Element => (
    <View style={styles.headerBar}>
      <TouchableOpacity style={styles.iconButton}>
        <MaterialIcons name="school" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Lista de Profesores</Text>
      <TouchableOpacity style={styles.iconButton} onPress={handleAddProfesor}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  /**
   * Renderiza los filtros
   */
  const renderFilters = (): JSX.Element => (
    <View style={styles.filtersContainer}>
      <Text style={styles.filterLabel}>Filtrar por carrera:</Text>
      <View style={styles.filterButtons}>
        {carrerasDisponibles.map((carrera) => (
          <TouchableOpacity
            key={carrera}
            style={[
              styles.filterButton,
              filter.carrera === carrera && styles.filterButtonActive,
            ]}
            onPress={() => handleCarreraFilter(carrera)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter.carrera === carrera && styles.filterButtonTextActive,
              ]}
            >
              {carrera}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contador de resultados */}
      <Text style={styles.resultsCount}>
        {filteredData.length} profesor{filteredData.length !== 1 ? "es" : ""}{" "}
        encontrado{filteredData.length !== 1 ? "s" : ""}
      </Text>
    </View>
  );

  /**
   * Renderiza el estado de carga
   */
  const renderLoading = (): JSX.Element => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Cargando profesores...</Text>
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
      <TouchableOpacity style={styles.retryButton} onPress={loadProfesores}>
        <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renderiza la lista vacía
   */
  const renderEmpty = (): JSX.Element => (
    <View style={styles.centerContainer}>
      <FontAwesome5
        name="chalkboard-teacher"
        size={64}
        color={COLORS.textSecondary}
      />
      <Text style={styles.emptyText}>
        {filter.carrera !== "Todas" || filter.searchText !== ""
          ? "No se encontraron profesores con los filtros aplicados"
          : "No hay profesores registrados"}
      </Text>
      {filter.carrera !== "Todas" && (
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={() => setFilter({ carrera: "Todas", searchText: "" })}
        >
          <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      {screenState.loading === "loading" ? (
        renderLoading()
      ) : screenState.error.hasError ? (
        renderError()
      ) : (
        <>
          {renderFilters()}
          {filteredData.length === 0 ? (
            renderEmpty()
          ) : (
            <FlatList<Profesor>
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ProfesorItem
                  profesor={item}
                  onPress={handleProfesorPress}
                  onEdit={handleEditProfesor}
                  onDelete={handleDeleteProfesor}
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
        </>
      )}
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
  filtersContainer: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  filterLabel: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: COLORS.surface,
  },
  resultsCount: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
  listContainer: {
    padding: 16,
  },
  profesorCard: {
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
  profesorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  profesorInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profesorNombre: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  profesorCarrera: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  profesorEspecialidad: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    fontStyle: "italic",
    marginBottom: 2,
  },
  profesorEmail: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 6,
  },
  detailButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    gap: 4,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    gap: 4,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.surface,
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
  clearFiltersButton: {
    marginTop: 20,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearFiltersText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
});

export default ProfesorScreen;
