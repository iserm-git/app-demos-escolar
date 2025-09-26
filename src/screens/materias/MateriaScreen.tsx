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
  Modal,
  TextInput,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

// Importamos los tipos
import { RootStackParamList } from "../../navigation/StackNavigator";
import {
  Materia,
  Profesor,
  ScreenState,
  LoadingState,
  COLORS,
  FONT_SIZES,
  Carrera,
  ID,
} from "../../../types/index";

// Imagen por defecto para materias
const materiaImage = require("../../../assets/materia_image.png");

/**
 * Tipo para las props de navegación de esta pantalla
 */
type MateriaScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MateriaList"
>;

/**
 * Props que recibe el componente MateriaScreen
 */
interface MateriaScreenProps {
  navigation: MateriaScreenNavigationProp;
}

/**
 * Interface para materia extendida con información adicional
 */
interface MateriaExtendida extends Materia {
  profesor?: Profesor;
  gruposAsignados: number;
  alumnosInscritos: number;
  prerrequisitos: string[];
  modalidad: "Presencial" | "Virtual" | "Híbrida";
  estado: "Activa" | "Inactiva" | "En Desarrollo";
}

/**
 * Props para el componente de item de materia
 */
interface MateriaItemProps {
  materia: MateriaExtendida;
  onPress: (materia: MateriaExtendida) => void;
  onEdit: (materia: MateriaExtendida) => void;
  onToggleStatus: (materia: MateriaExtendida) => void;
  fadeAnim: Animated.Value;
}

/**
 * Estados de filtro para materias
 */
interface MateriaFilterState {
  carrera: string;
  semestre: string;
  modalidad: string;
  estado: string;
  searchText: string;
}

/**
 * Props para el modal de búsqueda avanzada
 */
interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  filters: MateriaFilterState;
  onApplyFilters: (filters: MateriaFilterState) => void;
}

/**
 * Componente modal para búsqueda avanzada
 */
const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<MateriaFilterState>(filters);

  const modalidades = ["Todas", "Presencial", "Virtual", "Híbrida"];
  const estados = ["Todos", "Activa", "Inactiva", "En Desarrollo"];
  const semestres = ["Todos", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Búsqueda Avanzada</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons
                name="close"
                size={24}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Búsqueda por texto */}
            <View style={styles.searchInputContainer}>
              <MaterialIcons
                name="search"
                size={20}
                color={COLORS.textSecondary}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar materia..."
                value={localFilters.searchText}
                onChangeText={(text) =>
                  setLocalFilters((prev) => ({ ...prev, searchText: text }))
                }
              />
            </View>

            {/* Filtro por modalidad */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupLabel}>Modalidad:</Text>
              <View style={styles.filterButtons}>
                {modalidades.map((modalidad) => (
                  <TouchableOpacity
                    key={modalidad}
                    style={[
                      styles.filterChip,
                      localFilters.modalidad === modalidad &&
                        styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setLocalFilters((prev) => ({ ...prev, modalidad }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        localFilters.modalidad === modalidad &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      {modalidad}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filtro por estado */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupLabel}>Estado:</Text>
              <View style={styles.filterButtons}>
                {estados.map((estado) => (
                  <TouchableOpacity
                    key={estado}
                    style={[
                      styles.filterChip,
                      localFilters.estado === estado && styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setLocalFilters((prev) => ({ ...prev, estado }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        localFilters.estado === estado &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      {estado}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filtro por semestre */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupLabel}>Semestre:</Text>
              <View style={styles.filterButtons}>
                {semestres.map((semestre) => (
                  <TouchableOpacity
                    key={semestre}
                    style={[
                      styles.filterChip,
                      localFilters.semestre === semestre &&
                        styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setLocalFilters((prev) => ({ ...prev, semestre }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        localFilters.semestre === semestre &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      {semestre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalButtonSecondary}
              onPress={() => {
                const resetFilters: MateriaFilterState = {
                  carrera: "Todas",
                  semestre: "Todos",
                  modalidad: "Todas",
                  estado: "Todos",
                  searchText: "",
                };
                setLocalFilters(resetFilters);
              }}
            >
              <Text style={styles.modalButtonSecondaryText}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={() => {
                onApplyFilters(localFilters);
                onClose();
              }}
            >
              <Text style={styles.modalButtonPrimaryText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

/**
 * Componente para renderizar un item individual de materia
 */
const MateriaItem: React.FC<MateriaItemProps> = ({
  materia,
  onPress,
  onEdit,
  onToggleStatus,
  fadeAnim,
}) => {
  /**
   * Obtiene el color del estado
   */
  const getStatusColor = (estado: string): string => {
    switch (estado) {
      case "Activa":
        return "#4CAF50";
      case "Inactiva":
        return "#F44336";
      case "En Desarrollo":
        return "#FF9800";
      default:
        return COLORS.textSecondary;
    }
  };

  /**
   * Obtiene el icono de la modalidad
   */
  const getModalidadIcon = (
    modalidad: string
  ): React.ComponentProps<typeof MaterialIcons>["name"] => {
    switch (modalidad) {
      case "Presencial":
        return "school";
      case "Virtual":
        return "computer";
      case "Híbrida":
        return "merge-type";
      default:
        return "help-outline";
    }
  };

  return (
    <Animated.View style={[styles.materiaCard, { opacity: fadeAnim }]}>
      <Image source={materiaImage} style={styles.materiaImage} />
      <View style={styles.materiaInfo}>
        <View style={styles.materiaHeader}>
          <Text style={styles.materiaNombre} numberOfLines={2}>
            {materia.nombre}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(materia.estado) },
            ]}
          >
            <Text style={styles.statusText}>{materia.estado}</Text>
          </View>
        </View>

        <View style={styles.materiaDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="work" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>
              {materia.carrera} • {materia.creditos} créditos
            </Text>
          </View>

          {materia.semestre && (
            <View style={styles.detailRow}>
              <MaterialIcons
                name="school"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.detailText}>Semestre {materia.semestre}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <MaterialIcons
              name={getModalidadIcon(materia.modalidad)}
              size={16}
              color={COLORS.textSecondary}
            />
            <Text style={styles.detailText}>{materia.modalidad}</Text>
          </View>

          {materia.profesor && (
            <View style={styles.detailRow}>
              <MaterialIcons name="person" size={16} color={COLORS.primary} />
              <Text style={[styles.detailText, { color: COLORS.primary }]}>
                Prof. {materia.profesor.nombre}
              </Text>
            </View>
          )}
        </View>

        {/* Estadísticas rápidas */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{materia.gruposAsignados}</Text>
            <Text style={styles.statLabel}>Grupos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{materia.alumnosInscritos}</Text>
            <Text style={styles.statLabel}>Alumnos</Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => onPress(materia)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="visibility" size={16} color={COLORS.surface} />
            <Text style={styles.buttonText}>Ver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(materia)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="edit" size={16} color={COLORS.surface} />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusButton,
              {
                backgroundColor:
                  materia.estado === "Activa" ? "#F44336" : "#4CAF50",
              },
            ]}
            onPress={() => onToggleStatus(materia)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={materia.estado === "Activa" ? "pause" : "play-arrow"}
              size={16}
              color={COLORS.surface}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

/**
 * Pantalla principal de lista de materias
 * Muestra todas las materias con filtros avanzados y funciones CRUD
 */
const MateriaScreen: React.FC<MateriaScreenProps> = ({ navigation }) => {
  // Estados principales
  const [screenState, setScreenState] = useState<ScreenState<MateriaExtendida>>(
    {
      data: [],
      loading: "idle",
      error: { hasError: false },
    }
  );

  const [filteredData, setFilteredData] = useState<MateriaExtendida[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchModalVisible, setSearchModalVisible] = useState<boolean>(false);
  const [filter, setFilter] = useState<MateriaFilterState>({
    carrera: "Todas",
    semestre: "Todos",
    modalidad: "Todas",
    estado: "Todos",
    searchText: "",
  });

  // Animación de fade
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /**
   * Datos mock de materias con información extendida
   */
  const mockMaterias: MateriaExtendida[] = [
    {
      id: 1,
      nombre: "Programación Orientada a Objetos",
      carrera: "ISC",
      creditos: 8,
      semestre: 7,
      descripcion: "Principios de programación orientada a objetos",
      profesor: {
        id: 1,
        nombre: "Dr. Antonio Suárez Zinzun",
        carrera: "ISC",
        especialidad: "Desarrollo de Software",
      },
      gruposAsignados: 3,
      alumnosInscritos: 85,
      prerrequisitos: ["Fundamentos de Programación", "Estructuras de Datos"],
      modalidad: "Presencial",
      estado: "Activa",
    },
    {
      id: 2,
      nombre: "Bases de Datos Avanzadas",
      carrera: "ISC",
      creditos: 6,
      semestre: 8,
      descripcion: "Diseño y administración de bases de datos",
      profesor: {
        id: 4,
        nombre: "Dra. Ana Celia Segundo Sevilla",
        carrera: "ISC",
        especialidad: "Bases de Datos",
      },
      gruposAsignados: 2,
      alumnosInscritos: 60,
      prerrequisitos: ["Bases de Datos I"],
      modalidad: "Híbrida",
      estado: "Activa",
    },
    {
      id: 3,
      nombre: "Redes de Computadoras",
      carrera: "ISC",
      creditos: 7,
      semestre: 6,
      descripcion: "Fundamentos de redes y telecomunicaciones",
      profesor: {
        id: 3,
        nombre: "Ing. Francisco Rodríguez Díaz",
        carrera: "ISC",
        especialidad: "Redes y Telecomunicaciones",
      },
      gruposAsignados: 2,
      alumnosInscritos: 55,
      prerrequisitos: ["Sistemas Operativos"],
      modalidad: "Presencial",
      estado: "Activa",
    },
    {
      id: 4,
      nombre: "Inteligencia Artificial",
      carrera: "ISC",
      creditos: 8,
      semestre: 9,
      descripcion: "Introducción a la inteligencia artificial",
      gruposAsignados: 1,
      alumnosInscritos: 30,
      prerrequisitos: ["Matemáticas Discretas", "Algoritmos"],
      modalidad: "Virtual",
      estado: "En Desarrollo",
    },
    {
      id: 5,
      nombre: "Gestión de Proyectos",
      carrera: "IGE",
      creditos: 6,
      semestre: 8,
      descripcion: "Metodologías de gestión de proyectos",
      profesor: {
        id: 5,
        nombre: "M.C. Claudia Baeza Lara",
        carrera: "IGE",
        especialidad: "Gestión de Proyectos",
      },
      gruposAsignados: 2,
      alumnosInscritos: 45,
      prerrequisitos: ["Administración", "Economía"],
      modalidad: "Presencial",
      estado: "Activa",
    },
    {
      id: 6,
      nombre: "Automatización Industrial",
      carrera: "IIA",
      creditos: 7,
      semestre: 7,
      descripcion: "Sistemas de automatización en la industria",
      profesor: {
        id: 6,
        nombre: "Dr. Ricardo García Cruz",
        carrera: "IIA",
        especialidad: "Automatización Industrial",
      },
      gruposAsignados: 1,
      alumnosInscritos: 25,
      prerrequisitos: ["Control Automático", "Instrumentación"],
      modalidad: "Presencial",
      estado: "Inactiva",
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
    loadMaterias();
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
   * Simula la carga de materias desde un servidor
   */
  const loadMaterias = async (): Promise<void> => {
    setScreenState((prev) => ({
      ...prev,
      loading: "loading",
      error: { hasError: false },
    }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setScreenState((prev) => ({
        ...prev,
        data: mockMaterias,
        loading: "success",
      }));
    } catch (error) {
      setScreenState((prev) => ({
        ...prev,
        loading: "error",
        error: {
          hasError: true,
          message: "Error al cargar las materias",
        },
      }));
    }
  };

  /**
   * Aplica los filtros a los datos
   */
  const applyFilters = (): void => {
    let filtered = [...screenState.data];

    // Filtro por carrera
    if (filter.carrera !== "Todas") {
      filtered = filtered.filter(
        (materia) => materia.carrera === filter.carrera
      );
    }

    // Filtro por semestre
    if (filter.semestre !== "Todos") {
      filtered = filtered.filter(
        (materia) => materia.semestre?.toString() === filter.semestre
      );
    }

    // Filtro por modalidad
    if (filter.modalidad !== "Todas") {
      filtered = filtered.filter(
        (materia) => materia.modalidad === filter.modalidad
      );
    }

    // Filtro por estado
    if (filter.estado !== "Todos") {
      filtered = filtered.filter((materia) => materia.estado === filter.estado);
    }

    // Filtro por texto de búsqueda
    if (filter.searchText.trim() !== "") {
      const searchLower = filter.searchText.toLowerCase();
      filtered = filtered.filter(
        (materia) =>
          materia.nombre.toLowerCase().includes(searchLower) ||
          materia.descripcion?.toLowerCase().includes(searchLower) ||
          materia.profesor?.nombre.toLowerCase().includes(searchLower)
      );
    }

    // Ordenar por nombre
    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));

    setFilteredData(filtered);
  };

  /**
   * Maneja el refresh de la lista
   */
  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadMaterias();
    setRefreshing(false);
  };

  /**
   * Navega a la pantalla de detalles de la materia
   */
  const handleMateriaPress = (materia: MateriaExtendida): void => {
    navigation.navigate("MateriaDetails", {
      nombre: materia.nombre,
      id: materia.id,
    });
  };

  /**
   * Maneja la edición de una materia
   */
  const handleEditMateria = (materia: MateriaExtendida): void => {
    Alert.alert("Editar Materia", `Editar información de ${materia.nombre}`, [
      { text: "Próximamente" },
    ]);
  };

  /**
   * Maneja el cambio de estado de una materia
   */
  const handleToggleStatus = (materia: MateriaExtendida): void => {
    const newStatus = materia.estado === "Activa" ? "Inactiva" : "Activa";

    Alert.alert(
      "Cambiar Estado",
      `¿Deseas cambiar el estado de "${materia.nombre}" a ${newStatus}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            setScreenState((prev) => ({
              ...prev,
              data: prev.data.map((m) =>
                m.id === materia.id ? { ...m, estado: newStatus as any } : m
              ),
            }));

            Alert.alert(
              "Estado Actualizado",
              `${materia.nombre} ahora está ${newStatus.toLowerCase()}.`
            );
          },
        },
      ]
    );
  };

  /**
   * Maneja la aplicación de filtros desde el modal
   */
  const handleApplyFilters = (newFilters: MateriaFilterState): void => {
    setFilter(newFilters);
  };

  /**
   * Renderiza el header de la pantalla
   */
  const renderHeader = (): JSX.Element => (
    <View style={styles.headerBar}>
      <TouchableOpacity style={styles.iconButton}>
        <MaterialIcons name="school" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Lista de Materias</Text>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setSearchModalVisible(true)}
      >
        <MaterialIcons name="filter-list" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  /**
   * Renderiza los filtros rápidos
   */
  const renderQuickFilters = (): JSX.Element => (
    <View style={styles.quickFiltersContainer}>
      <Text style={styles.filterLabel}>Filtros rápidos:</Text>
      <View style={styles.quickFilterButtons}>
        {carrerasDisponibles.slice(0, 4).map((carrera) => (
          <TouchableOpacity
            key={carrera}
            style={[
              styles.quickFilterButton,
              filter.carrera === carrera && styles.quickFilterButtonActive,
            ]}
            onPress={() => setFilter((prev) => ({ ...prev, carrera }))}
          >
            <Text
              style={[
                styles.quickFilterButtonText,
                filter.carrera === carrera &&
                  styles.quickFilterButtonTextActive,
              ]}
            >
              {carrera}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Estadísticas de filtros */}
      <View style={styles.filterStats}>
        <Text style={styles.filterStatsText}>
          {filteredData.length} materia{filteredData.length !== 1 ? "s" : ""} •{" "}
          {filteredData.reduce(
            (sum, materia) => sum + materia.alumnosInscritos,
            0
          )}{" "}
          alumnos total •{" "}
          {filteredData.filter((m) => m.estado === "Activa").length} activas
        </Text>
      </View>
    </View>
  );

  /**
   * Renderiza el estado de carga
   */
  const renderLoading = (): JSX.Element => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Cargando materias...</Text>
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
      <TouchableOpacity style={styles.retryButton} onPress={loadMaterias}>
        <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renderiza la lista vacía
   */
  const renderEmpty = (): JSX.Element => (
    <View style={styles.centerContainer}>
      <FontAwesome5 name="book-open" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyText}>
        {Object.values(filter).some(
          (value) => value !== "Todas" && value !== "Todos" && value !== ""
        )
          ? "No se encontraron materias con los filtros aplicados"
          : "No hay materias registradas"}
      </Text>
      <TouchableOpacity
        style={styles.clearFiltersButton}
        onPress={() =>
          setFilter({
            carrera: "Todas",
            semestre: "Todos",
            modalidad: "Todas",
            estado: "Todos",
            searchText: "",
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
          {renderQuickFilters()}
          {filteredData.length === 0 ? (
            renderEmpty()
          ) : (
            <FlatList<MateriaExtendida>
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <MateriaItem
                  materia={item}
                  onPress={handleMateriaPress}
                  onEdit={handleEditMateria}
                  onToggleStatus={handleToggleStatus}
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

      {/* Modal de búsqueda avanzada */}
      <SearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        filters={filter}
        onApplyFilters={handleApplyFilters}
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
  quickFiltersContainer: {
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
  quickFilterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  quickFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  quickFilterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  quickFilterButtonText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    fontWeight: "500",
  },
  quickFilterButtonTextActive: {
    color: COLORS.surface,
  },
  filterStats: {
    marginTop: 4,
  },
  filterStatsText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
  listContainer: {
    padding: 16,
  },
  materiaCard: {
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
  materiaImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  materiaInfo: {
    flex: 1,
  },
  materiaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  materiaNombre: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.surface,
    fontWeight: "600",
  },
  materiaDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  quickStats: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
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
    flex: 1,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  statusButton: {
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
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  modalTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
  },
  modalContent: {
    padding: 20,
    maxHeight: 400,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    marginLeft: 8,
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterGroupLabel: {
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
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: COLORS.surface,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
    gap: 12,
  },
  modalButtonSecondary: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonSecondaryText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontWeight: "600",
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonPrimaryText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.surface,
    fontWeight: "bold",
  },
});

export default MateriaScreen;
