import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
  Animated,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

// Importamos los tipos
import { RootStackParamList } from "../../navigation/StackNavigator";
import {
  Grupo,
  Alumno,
  Profesor,
  ScreenState,
  LoadingState,
  COLORS,
  FONT_SIZES,
  ID,
} from "../../../types";

// Imagen por defecto para grupos
const grupoImage = require("../../../assets/grupo_image.png");

// Habilitamos LayoutAnimation en Android
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Tipo para las props de navegación de esta pantalla
 */
type GrupoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "GrupoList"
>;

/**
 * Props que recibe el componente GrupoScreen
 */
interface GrupoScreenProps {
  navigation: GrupoScreenNavigationProp;
}

/**
 * Interface para grupo extendido con información adicional
 */
interface GrupoExtendido extends Grupo {
  profesor?: Profesor;
  totalAlumnos: number;
  alumnosInscritos: Alumno[];
  horarios: string[];
}

/**
 * Props para el componente de item de grupo
 */
interface GrupoItemProps {
  grupo: GrupoExtendido;
  isExpanded: boolean;
  onPress: (grupo: GrupoExtendido) => void;
  onToggleExpand: (grupoId: ID) => void;
  onViewAlumnos: (grupo: GrupoExtendido) => void;
  fadeAnim: Animated.Value;
}

/**
 * Estados de filtro para grupos
 */
interface GrupoFilterState {
  carrera: string;
  mostrarSoloConAlumnos: boolean;
  ordenarPor: "nombre" | "carrera" | "alumnos";
}

/**
 * Componente para mostrar la información expandida del grupo
 */
const GrupoExpandedInfo: React.FC<{ grupo: GrupoExtendido }> = ({ grupo }) => (
  <View style={styles.expandedContent}>
    <View style={styles.infoRow}>
      <MaterialIcons name="person" size={16} color={COLORS.primary} />
      <Text style={styles.infoText}>
        Profesor: {grupo.profesor?.nombre || "Sin asignar"}
      </Text>
    </View>

    <View style={styles.infoRow}>
      <MaterialIcons name="people" size={16} color={COLORS.primary} />
      <Text style={styles.infoText}>
        Alumnos inscritos: {grupo.totalAlumnos}
      </Text>
    </View>

    {grupo.horarios && grupo.horarios.length > 0 && (
      <View style={styles.infoRow}>
        <MaterialIcons name="schedule" size={16} color={COLORS.primary} />
        <Text style={styles.infoText}>
          Horarios: {grupo.horarios.join(", ")}
        </Text>
      </View>
    )}

    {grupo.profesor?.especialidad && (
      <View style={styles.infoRow}>
        <MaterialIcons name="school" size={16} color={COLORS.primary} />
        <Text style={styles.infoText}>
          Especialidad: {grupo.profesor.especialidad}
        </Text>
      </View>
    )}

    <Text style={styles.expandedDescription}>
      {grupo.totalAlumnos > 0
        ? `Este grupo cuenta con ${
            grupo.totalAlumnos
          } estudiantes inscritos y está a cargo de ${
            grupo.profesor?.nombre || "un profesor sin asignar"
          }.`
        : "Este grupo aún no tiene estudiantes inscritos."}
    </Text>
  </View>
);

/**
 * Componente para renderizar un item individual de grupo
 */
const GrupoItem: React.FC<GrupoItemProps> = ({
  grupo,
  isExpanded,
  onPress,
  onToggleExpand,
  onViewAlumnos,
  fadeAnim,
}) => {
  return (
    <Animated.View style={[styles.grupoCard, { opacity: fadeAnim }]}>
      <Image source={grupoImage} style={styles.grupoImage} />
      <View style={styles.grupoInfo}>
        <View style={styles.grupoHeader}>
          <Text style={styles.grupoNombre} numberOfLines={1}>
            {grupo.nombre}
          </Text>
          <View style={styles.alumnosCounter}>
            <Text style={styles.counterText}>{grupo.totalAlumnos}</Text>
          </View>
        </View>

        <Text style={styles.grupoCarrera}>Carrera: {grupo.carrera}</Text>

        {grupo.profesor && (
          <Text style={styles.grupoProfesor} numberOfLines={1}>
            Prof. {grupo.profesor.nombre}
          </Text>
        )}

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => onPress(grupo)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="visibility" size={16} color={COLORS.surface} />
            <Text style={styles.buttonText}>Ver Detalles</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.alumnosButton}
            onPress={() => onViewAlumnos(grupo)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="people" size={16} color={COLORS.primary} />
            <Text style={styles.alumnosButtonText}>Alumnos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onToggleExpand(grupo.id)}
            style={styles.expandButton}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={isExpanded ? "expand-less" : "expand-more"}
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Contenido expandido */}
        {isExpanded && <GrupoExpandedInfo grupo={grupo} />}
      </View>
    </Animated.View>
  );
};

/**
 * Pantalla principal de lista de grupos
 * Muestra todos los grupos con funcionalidad de expandir/contraer
 */
const GrupoScreen: React.FC<GrupoScreenProps> = ({ navigation }) => {
  // Estados principales
  const [screenState, setScreenState] = useState<ScreenState<GrupoExtendido>>({
    data: [],
    loading: "idle",
    error: { hasError: false },
  });

  const [filteredData, setFilteredData] = useState<GrupoExtendido[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<ID>>(new Set());
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filter, setFilter] = useState<GrupoFilterState>({
    carrera: "Todas",
    mostrarSoloConAlumnos: false,
    ordenarPor: "nombre",
  });

  // Animación de fade
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /**
   * Datos mock de grupos con información extendida
   */
  const mockGrupos: GrupoExtendido[] = [
    {
      id: 1,
      nombre: "Grupo 7A - ISC",
      carrera: "ISC",
      profesorId: 1,
      profesor: {
        id: 1,
        nombre: "Dr. Antonio Suárez Zinzun",
        carrera: "ISC",
        especialidad: "Inteligencia Artificial",
      },
      totalAlumnos: 28,
      alumnosInscritos: [], // Se cargarían desde API
      horarios: [
        "Lunes 8:00-10:00",
        "Miércoles 10:00-12:00",
        "Viernes 14:00-16:00",
      ],
    },
    {
      id: 2,
      nombre: "Grupo 7B - ISC",
      carrera: "ISC",
      profesorId: 2,
      profesor: {
        id: 2,
        nombre: "M.C. Roberto Suárez Zinzun",
        carrera: "ISC",
        especialidad: "Desarrollo Web",
      },
      totalAlumnos: 25,
      alumnosInscritos: [],
      horarios: ["Martes 8:00-10:00", "Jueves 10:00-12:00"],
    },
    {
      id: 3,
      nombre: "Grupo 8A - ISC",
      carrera: "ISC",
      profesorId: 3,
      profesor: {
        id: 3,
        nombre: "Ing. Francisco Rodríguez Díaz",
        carrera: "ISC",
        especialidad: "Redes y Telecomunicaciones",
      },
      totalAlumnos: 22,
      alumnosInscritos: [],
      horarios: ["Lunes 14:00-16:00", "Miércoles 8:00-10:00"],
    },
    {
      id: 4,
      nombre: "Grupo 8B - ISC",
      carrera: "ISC",
      totalAlumnos: 0, // Grupo sin alumnos
      alumnosInscritos: [],
      horarios: [],
    },
    {
      id: 5,
      nombre: "Grupo 5A - IGE",
      carrera: "IGE",
      profesorId: 5,
      profesor: {
        id: 5,
        nombre: "M.C. Claudia Baeza Lara",
        carrera: "IGE",
        especialidad: "Gestión de Proyectos",
      },
      totalAlumnos: 30,
      alumnosInscritos: [],
      horarios: ["Lunes 10:00-12:00", "Viernes 8:00-10:00"],
    },
    {
      id: 6,
      nombre: "Grupo 6A - IIA",
      carrera: "IIA",
      profesorId: 6,
      profesor: {
        id: 6,
        nombre: "Dr. Ricardo García Cruz",
        carrera: "IIA",
        especialidad: "Automatización Industrial",
      },
      totalAlumnos: 18,
      alumnosInscritos: [],
      horarios: ["Martes 14:00-16:00", "Jueves 8:00-10:00"],
    },
  ];

  /**
   * Carreras y opciones de ordenamiento disponibles
   */
  const carrerasDisponibles = ["Todas", "ISC", "IGE", "IIA", "ITICS"];
  const opcionesOrdenamiento = [
    { value: "nombre", label: "Nombre" },
    { value: "carrera", label: "Carrera" },
    { value: "alumnos", label: "Cantidad de Alumnos" },
  ] as const;

  /**
   * Efecto para cargar los datos al montar el componente
   */
  useEffect(() => {
    loadGrupos();
    startFadeAnimation();
  }, []);

  /**
   * Efecto para filtrar y ordenar los datos
   */
  useEffect(() => {
    applyFiltersAndSorting();
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
   * Simula la carga de grupos desde un servidor
   */
  const loadGrupos = async (): Promise<void> => {
    setScreenState((prev) => ({
      ...prev,
      loading: "loading",
      error: { hasError: false },
    }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setScreenState((prev) => ({
        ...prev,
        data: mockGrupos,
        loading: "success",
      }));
    } catch (error) {
      setScreenState((prev) => ({
        ...prev,
        loading: "error",
        error: {
          hasError: true,
          message: "Error al cargar los grupos",
        },
      }));
    }
  };

  /**
   * Aplica filtros y ordenamiento a los datos
   */
  const applyFiltersAndSorting = (): void => {
    let filtered = [...screenState.data];

    // Filtro por carrera
    if (filter.carrera !== "Todas") {
      filtered = filtered.filter((grupo) => grupo.carrera === filter.carrera);
    }

    // Filtro por grupos con alumnos
    if (filter.mostrarSoloConAlumnos) {
      filtered = filtered.filter((grupo) => grupo.totalAlumnos > 0);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (filter.ordenarPor) {
        case "nombre":
          return a.nombre.localeCompare(b.nombre);
        case "carrera":
          return a.carrera.localeCompare(b.carrera);
        case "alumnos":
          return b.totalAlumnos - a.totalAlumnos; // Descendente
        default:
          return 0;
      }
    });

    setFilteredData(filtered);
  };

  /**
   * Maneja la expansión/contracción de grupos
   */
  const handleToggleExpand = (grupoId: ID): void => {
    // Configuramos la animación de layout
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(grupoId)) {
        newSet.delete(grupoId);
      } else {
        newSet.add(grupoId);
      }
      return newSet;
    });
  };

  /**
   * Maneja el refresh de la lista
   */
  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadGrupos();
    setRefreshing(false);
  };

  /**
   * Navega a la pantalla de detalles del grupo
   */
  const handleGrupoPress = (grupo: GrupoExtendido): void => {
    navigation.navigate("GrupoDetails", {
      nombre: grupo.nombre,
      id: grupo.id,
    });
  };

  /**
   * Muestra los alumnos del grupo
   */
  const handleViewAlumnos = (grupo: GrupoExtendido): void => {
    if (grupo.totalAlumnos === 0) {
      Alert.alert(
        "Grupo Vacío",
        `El grupo ${grupo.nombre} aún no tiene alumnos inscritos.`,
        [{ text: "Entendido" }]
      );
      return;
    }

    Alert.alert(
      "Alumnos del Grupo",
      `Ver lista completa de los ${grupo.totalAlumnos} alumnos de ${grupo.nombre}`,
      [{ text: "Próximamente" }]
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
      <Text style={styles.headerTitle}>Lista de Grupos</Text>
      <TouchableOpacity style={styles.iconButton}>
        <Text style={styles.countBadge}>{filteredData.length}</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renderiza los controles de filtro
   */
  const renderFilters = (): JSX.Element => (
    <View style={styles.filtersContainer}>
      {/* Filtro por carrera */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Carrera:</Text>
        <View style={styles.filterButtons}>
          {carrerasDisponibles.map((carrera) => (
            <TouchableOpacity
              key={carrera}
              style={[
                styles.filterButton,
                filter.carrera === carrera && styles.filterButtonActive,
              ]}
              onPress={() => setFilter((prev) => ({ ...prev, carrera }))}
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
      </View>

      {/* Filtro por grupos con alumnos */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() =>
          setFilter((prev) => ({
            ...prev,
            mostrarSoloConAlumnos: !prev.mostrarSoloConAlumnos,
          }))
        }
      >
        <MaterialIcons
          name={
            filter.mostrarSoloConAlumnos
              ? "check-box"
              : "check-box-outline-blank"
          }
          size={20}
          color={COLORS.primary}
        />
        <Text style={styles.checkboxLabel}>Solo grupos con alumnos</Text>
      </TouchableOpacity>

      {/* Estadísticas */}
      <Text style={styles.statsText}>
        {filteredData.length} grupo{filteredData.length !== 1 ? "s" : ""} •{" "}
        {filteredData.reduce((sum, grupo) => sum + grupo.totalAlumnos, 0)}{" "}
        alumnos total
      </Text>
    </View>
  );

  /**
   * Renderiza el estado de carga
   */
  const renderLoading = (): JSX.Element => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Cargando grupos...</Text>
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
      <TouchableOpacity style={styles.retryButton} onPress={loadGrupos}>
        <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renderiza la lista vacía
   */
  const renderEmpty = (): JSX.Element => (
    <View style={styles.centerContainer}>
      <FontAwesome5 name="users" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyText}>
        {filter.carrera !== "Todas" || filter.mostrarSoloConAlumnos
          ? "No se encontraron grupos con los filtros aplicados"
          : "No hay grupos registrados"}
      </Text>
      <TouchableOpacity
        style={styles.clearFiltersButton}
        onPress={() =>
          setFilter({
            carrera: "Todas",
            mostrarSoloConAlumnos: false,
            ordenarPor: "nombre",
          })
        }
      >
        <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
      </TouchableOpacity>
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
            <FlatList<GrupoExtendido>
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <GrupoItem
                  grupo={item}
                  isExpanded={expandedGroups.has(item.id)}
                  onPress={handleGrupoPress}
                  onToggleExpand={handleToggleExpand}
                  onViewAlumnos={handleViewAlumnos}
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
  countBadge: {
    fontSize: FONT_SIZES.small,
    fontWeight: "bold",
    color: COLORS.surface,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    textAlign: "center",
  },
  filtersContainer: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  filterSection: {
    marginBottom: 12,
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
  },
  statsText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
  listContainer: {
    padding: 16,
  },
  grupoCard: {
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
  grupoImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  grupoInfo: {
    flex: 1,
  },
  grupoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  grupoNombre: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
  },
  alumnosCounter: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  counterText: {
    fontSize: FONT_SIZES.small,
    fontWeight: "bold",
    color: COLORS.surface,
  },
  grupoCarrera: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  grupoProfesor: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    fontStyle: "italic",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    flex: 1,
  },
  alumnosButton: {
    flexDirection: "row",
    backgroundColor: "transparent",
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    gap: 4,
  },
  expandButton: {
    padding: 4,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.small,
    fontWeight: "600",
  },
  alumnosButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.small,
    fontWeight: "600",
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  expandedDescription: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    marginTop: 8,
    lineHeight: 18,
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

export default GrupoScreen;
