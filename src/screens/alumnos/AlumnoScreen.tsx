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
  TextInput,
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
import AlumnoFormModal from "../../utils/AlumnoFormModal";

import { CallButton } from "../../components/phone/CallButton";

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
  onEdit: (alumno: Alumno) => void;
  onDelete: (alumno: Alumno) => void;
  fadeAnim: Animated.Value;
}

/**
 * Estados de filtro para alumnos
 */
interface AlumnoFilterState {
  carrera: string;
  semestre: string;
  searchText: string;
}

/**
 * Componente para renderizar un item individual de alumno
 */
const AlumnoItem: React.FC<AlumnoItemProps> = ({
  alumno,
  onPress,
  onShowModal,
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
      `¿Estás seguro de que deseas eliminar a ${alumno.nombre}?\n\nEsta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onDelete(alumno),
        },
      ]
    );
  };

  return (
    <Animated.View style={[styles.alumnoCard, { opacity: fadeAnim }]}>
      {/* <Image source={alumnoImage} style={styles.alumnoImage} /> */}
      <Image
        source={alumno.fotoPerfil ? { uri: alumno.fotoPerfil } : alumnoImage}
        style={styles.alumnoImage}
      />
      <View style={styles.alumnoInfo}>
        <Text style={styles.alumnoNombre} numberOfLines={2}>
          {alumno.nombre}
        </Text>
        <Text style={styles.alumnoSem}>Semestre: {alumno.sem}</Text>
        {alumno.carrera && (
          <Text style={styles.alumnoCarrera}>Carrera: {alumno.carrera}</Text>
        )}
        {alumno.email && (
          <Text style={styles.alumnoEmail} numberOfLines={1}>
            📧 {alumno.email}
          </Text>
        )}
        {alumno.telefono && (
          <Text style={styles.alumnoTelefono} numberOfLines={1}>
            📱 {alumno.telefono}
          </Text>
        )}

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          {/* ✅ NUEVO: Botón de llamada si tiene teléfono */}
          {alumno.telefono && (
            <CallButton
              phoneNumber={alumno.telefono}
              compact={true}
              showPrompt={true}
            />
          )}

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => onPress(alumno)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="visibility" size={14} color={COLORS.surface} />
            <Text style={styles.buttonText}>Ver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(alumno)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="edit" size={14} color={COLORS.surface} />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => onShowModal(alumno)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="info" size={14} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <MaterialIcons name="delete" size={14} color={COLORS.surface} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

/**
 * Pantalla principal de lista de alumnos con CRUD completo
 * Permite crear, leer, actualizar y eliminar alumnos
 */
const AlumnoScreen: React.FC<AlumnoScreenProps> = ({ navigation }) => {
  // Estados principales
  const [screenState, setScreenState] = useState<ScreenState<Alumno>>({
    data: [],
    loading: "idle",
    error: { hasError: false },
  });

  const [filteredData, setFilteredData] = useState<Alumno[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [formModalVisible, setFormModalVisible] = useState<boolean>(false);
  const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [searchVisible, setSearchVisible] = useState<boolean>(false);

  // Estados de filtro
  const [filter, setFilter] = useState<AlumnoFilterState>({
    carrera: "Todas",
    semestre: "Todos",
    searchText: "",
  });

  // Animación de fade
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /**
   * Datos mock de alumnos - En una app real vendrían de una API
   */
  const [mockAlumnos, setMockAlumnos] = useState<Alumno[]>([
    {
      id: 1,
      nombre: "Juan Pérez García",
      sem: "7A",
      carrera: "ISC",
      email: "juan.perez@escuela.edu.mx",
      telefono: "+52 443 123 4567",
      numeroControl: "20180001",
    },
    {
      id: 2,
      nombre: "Ana Gómez López",
      sem: "7A",
      carrera: "ISC",
      email: "ana.gomez@escuela.edu.mx",
      telefono: "+52 443 234 5678",
      numeroControl: "20180002",
    },
    {
      id: 3,
      nombre: "Luis Martínez Hernández",
      sem: "7B",
      carrera: "ISC",
      email: "luis.martinez@escuela.edu.mx",
      telefono: "+52 443 345 6789",
      numeroControl: "20180003",
    },
    {
      id: 4,
      nombre: "Francisco Núñez Silva",
      sem: "7A",
      carrera: "ISC",
      email: "francisco.nunez@escuela.edu.mx",
      telefono: "+52 443 456 7890",
      numeroControl: "20180004",
    },
    {
      id: 5,
      nombre: "Berenice Aguilar Rojas",
      sem: "7A",
      carrera: "ISC",
      email: "berenice.aguilar@escuela.edu.mx",
      telefono: "+52 443 567 8901",
      numeroControl: "20180005",
    },
    {
      id: 6,
      nombre: "José Hurtado Morales",
      sem: "7B",
      carrera: "ISC",
      email: "jose.hurtado@escuela.edu.mx",
      telefono: "+52 443 678 9012",
      numeroControl: "20180006",
    },
    {
      id: 7,
      nombre: "María Elena Torres",
      sem: "5A",
      carrera: "IGE",
      email: "maria.torres@escuela.edu.mx",
      telefono: "+52 443 789 0123",
      numeroControl: "20200001",
    },
    {
      id: 8,
      nombre: "Carlos Alberto Mendoza",
      sem: "6A",
      carrera: "IIA",
      email: "carlos.mendoza@escuela.edu.mx",
      telefono: "+52 443 890 1234",
      numeroControl: "20190001",
    },
  ]);

  // Opciones de filtros
  const carrerasDisponibles = ["Todas", "ISC", "IGE", "IIA", "ITICS"];
  const semestresDisponibles = [
    "Todos",
    "1A",
    "1B",
    "2A",
    "2B",
    "3A",
    "3B",
    "4A",
    "4B",
    "5A",
    "5B",
    "6A",
    "6B",
    "7A",
    "7B",
    "8A",
    "8B",
    "9A",
    "9B",
  ];

  /**
   * Efecto para cargar los datos al montar el componente
   */
  useEffect(() => {
    loadAlumnos();
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
      await new Promise((resolve) => setTimeout(resolve, 1200));

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
          message: "Error al cargar los alumnos. Verifica tu conexión.",
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
      filtered = filtered.filter((alumno) => alumno.carrera === filter.carrera);
    }

    // Filtro por semestre
    if (filter.semestre !== "Todos") {
      filtered = filtered.filter((alumno) => alumno.sem === filter.semestre);
    }

    // Filtro por texto de búsqueda
    if (filter.searchText.trim() !== "") {
      const searchLower = filter.searchText.toLowerCase();
      filtered = filtered.filter(
        (alumno) =>
          alumno.nombre.toLowerCase().includes(searchLower) ||
          alumno.email?.toLowerCase().includes(searchLower) ||
          alumno.numeroControl?.toLowerCase().includes(searchLower)
      );
    }

    // Ordenar por nombre
    filtered.sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
    );

    setFilteredData(filtered);
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
   * Cierra el modal de información
   */
  const handleCloseModal = (): void => {
    setModalVisible(false);
    setSelectedAlumno(null);
  };

  /**
   * Abre el modal para crear un nuevo alumno
   */
  const handleCreateAlumno = (): void => {
    setFormMode("create");
    setEditingAlumno(null);
    setFormModalVisible(true);
  };

  /**
   * Abre el modal para editar un alumno existente
   */
  const handleEditAlumno = (alumno: Alumno): void => {
    setFormMode("edit");
    setEditingAlumno(alumno);
    setFormModalVisible(true);
  };

  /**
   * Maneja la eliminación de un alumno
   */
  const handleDeleteAlumno = (alumno: Alumno): void => {
    // Actualizar la lista de alumnos mock
    const updatedAlumnos = mockAlumnos.filter((a) => a.id !== alumno.id);
    setMockAlumnos(updatedAlumnos);

    // Actualizar el estado de la pantalla
    setScreenState((prev) => ({
      ...prev,
      data: updatedAlumnos,
    }));

    // Mostrar confirmación con animación
    Alert.alert(
      "✅ Alumno Eliminado",
      `${alumno.nombre} ha sido eliminado exitosamente del sistema.`,
      [
        {
          text: "Entendido",
          onPress: () => {
            // Pequeña animación para mostrar el cambio
            Animated.sequence([
              Animated.timing(fadeAnim, {
                toValue: 0.7,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
            ]).start();
          },
        },
      ]
    );
  };

  /**
   * Maneja el envío del formulario (crear/editar)
   */
  const handleFormSubmit = (alumnoData: Partial<Alumno>): void => {
    if (formMode === "create") {
      // Crear nuevo alumno
      const newId = Math.max(...mockAlumnos.map((a) => a.id), 0) + 1;
      const newAlumno: Alumno = {
        id: newId,
        nombre: alumnoData.nombre!,
        sem: alumnoData.sem!,
        carrera: alumnoData.carrera! as any,
        email: alumnoData.email!,
        telefono: alumnoData.telefono,
        direccion: alumnoData.direccion,
        fechaNacimiento: alumnoData.fechaNacimiento,
        numeroControl: alumnoData.numeroControl,
      };

      const updatedAlumnos = [...mockAlumnos, newAlumno];
      setMockAlumnos(updatedAlumnos);

      // Actualizar el estado de la pantalla
      setScreenState((prev) => ({
        ...prev,
        data: updatedAlumnos,
      }));

      Alert.alert(
        "✅ Alumno Creado",
        `${newAlumno.nombre} ha sido agregado exitosamente al sistema.`,
        [{ text: "Excelente" }]
      );
    } else if (formMode === "edit" && editingAlumno) {
      // Editar alumno existente
      const updatedAlumnos = mockAlumnos.map((alumno) =>
        alumno.id === editingAlumno.id ? { ...alumno, ...alumnoData } : alumno
      );

      setMockAlumnos(updatedAlumnos);

      // Actualizar el estado de la pantalla
      setScreenState((prev) => ({
        ...prev,
        data: updatedAlumnos,
      }));

      Alert.alert(
        "✅ Alumno Actualizado",
        `La información de ${alumnoData.nombre} ha sido actualizada correctamente.`,
        [{ text: "Perfecto" }]
      );
    }
  };

  /**
   * Cierra el modal del formulario
   */
  const handleCloseFormModal = (): void => {
    setFormModalVisible(false);
    setEditingAlumno(null);
  };

  /**
   * Cambia el filtro de carrera
   */
  const handleCarreraFilter = (carrera: string): void => {
    setFilter((prev) => ({ ...prev, carrera }));
  };

  /**
   * Actualiza el texto de búsqueda
   */
  const handleSearchTextChange = (text: string): void => {
    setFilter((prev) => ({ ...prev, searchText: text }));
  };

  /**
   * Limpia todos los filtros
   */
  const clearFilters = (): void => {
    setFilter({
      carrera: "Todas",
      semestre: "Todos",
      searchText: "",
    });
    setSearchVisible(false);
  };

  /**
   * Calcula estadísticas de los alumnos
   */
  const getStats = () => {
    const total = filteredData.length;
    const porCarrera = carrerasDisponibles.slice(1).reduce((acc, carrera) => {
      acc[carrera] = filteredData.filter((a) => a.carrera === carrera).length;
      return acc;
    }, {} as Record<string, number>);

    return { total, porCarrera };
  };

  /**
   * Renderiza el header de la pantalla
   */
  const renderHeader = (): JSX.Element => (
    <View style={styles.headerBar}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setSearchVisible(!searchVisible)}
      >
        <MaterialIcons name="search" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Lista de Alumnos</Text>
        <Text style={styles.headerSubtitle}>
          {filteredData.length} estudiante{filteredData.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <TouchableOpacity style={styles.iconButton} onPress={handleCreateAlumno}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  /**
   * Renderiza la barra de búsqueda
   */
  const renderSearchBar = (): JSX.Element | null => {
    if (!searchVisible) return null;

    return (
      <Animated.View
        style={styles.searchContainer}
        entering={{
          opacity: 0,
          transform: [{ translateY: -50 }],
        }}
      >
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, email o número de control..."
            value={filter.searchText}
            onChangeText={handleSearchTextChange}
            placeholderTextColor={COLORS.textSecondary}
            autoFocus={searchVisible}
          />
          {filter.searchText.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchTextChange("")}>
              <MaterialIcons
                name="clear"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  /**
   * Renderiza los filtros
   */
  const renderFilters = (): JSX.Element => {
    const stats = getStats();

    return (
      <View style={styles.filtersContainer}>
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>🏫 Filtrar por carrera:</Text>
          <View style={styles.filterButtons}>
            {carrerasDisponibles.slice(0, 5).map((carrera) => (
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
                  {carrera !== "Todas" &&
                    stats.porCarrera[carrera] > 0 &&
                    ` (${stats.porCarrera[carrera]})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Estadísticas de resultados */}
        <View style={styles.statsContainer}>
          <View style={styles.statsLeft}>
            <MaterialIcons name="people" size={16} color={COLORS.primary} />
            <Text style={styles.statsText}>
              {stats.total} resultado{stats.total !== 1 ? "s" : ""}
            </Text>
          </View>

          {(filter.carrera !== "Todas" || filter.searchText !== "") && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearFilters}
            >
              <MaterialIcons name="clear" size={16} color={COLORS.text} />
              <Text style={styles.clearFiltersText}>Limpiar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  /**
   * Renderiza el estado de carga
   */
  const renderLoading = (): JSX.Element => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Cargando alumnos...</Text>
      <Text style={styles.loadingSubtext}>Por favor espera un momento</Text>
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
        <MaterialIcons name="refresh" size={20} color={COLORS.surface} />
        <Text style={styles.retryButtonText}>Reintentar</Text>
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
      <Text style={styles.emptyTitle}>
        {filter.carrera !== "Todas" || filter.searchText !== ""
          ? "Sin resultados"
          : "Sin alumnos registrados"}
      </Text>
      <Text style={styles.emptyText}>
        {filter.carrera !== "Todas" || filter.searchText !== ""
          ? "No se encontraron alumnos con los filtros aplicados."
          : "Aún no hay estudiantes en el sistema."}
      </Text>

      {screenState.data.length === 0 ? (
        <TouchableOpacity
          style={styles.addFirstButton}
          onPress={handleCreateAlumno}
        >
          <MaterialIcons name="add" size={20} color={COLORS.surface} />
          <Text style={styles.addFirstButtonText}>Agregar primer alumno</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={clearFilters}
        >
          <MaterialIcons name="clear" size={16} color={COLORS.text} />
          <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  /**
   * Renderiza el FAB (Floating Action Button)
   */
  const renderFAB = (): JSX.Element => (
    <TouchableOpacity
      style={styles.fab}
      onPress={handleCreateAlumno}
      activeOpacity={0.8}
    >
      <MaterialIcons name="add" size={28} color={COLORS.surface} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderSearchBar()}

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
            <FlatList<Alumno>
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <AlumnoItem
                  alumno={item}
                  onPress={handleAlumnoPress}
                  onShowModal={handleShowModal}
                  onEdit={handleEditAlumno}
                  onDelete={handleDeleteAlumno}
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
                  title="Actualizando..."
                  titleColor={COLORS.textSecondary}
                />
              }
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
          {filteredData.length > 0 && renderFAB()}
        </>
      )}

      {/* Modal de información */}
      <ModalAlumno
        visible={modalVisible}
        onClose={handleCloseModal}
        alumno={selectedAlumno}
      />

      {/* Modal de formulario */}
      <AlumnoFormModal
        visible={formModalVisible}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        alumno={editingAlumno}
        mode={formMode}
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
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.surface,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.small,
    color: COLORS.surface + "CC",
    textAlign: "center",
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  searchContainer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    elevation: 2,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
  },
  filtersContainer: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    elevation: 1,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowOpacity: 0.15,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: COLORS.surface,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  statsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statsText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  clearFiltersText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Espacio para el FAB
  },
  separator: {
    height: 8,
  },
  alumnoCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    elevation: 3,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderWidth: 0.5,
    borderColor: COLORS.divider + "40",
  },
  alumnoImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    borderWidth: 2,
    borderColor: COLORS.primary + "20",
  },
  alumnoInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  alumnoNombre: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  alumnoSem: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  alumnoCarrera: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 3,
  },
  alumnoEmail: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    marginBottom: 2,
  },
  alumnoTelefono: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
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
    elevation: 1,
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
    elevation: 1,
  },
  modalButton: {
    backgroundColor: "transparent",
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    width: 32,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    elevation: 1,
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
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontWeight: "600",
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  errorText: {
    marginTop: 16,
    fontSize: FONT_SIZES.medium,
    color: COLORS.error,
    textAlign: "center",
    lineHeight: 22,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
  },
  emptyText: {
    marginTop: 8,
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  retryButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
  addFirstButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    elevation: 3,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addFirstButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default AlumnoScreen;
