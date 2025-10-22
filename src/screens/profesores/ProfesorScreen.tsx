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

// Importamos componentes
import ModalProfesor from "../../utils/ModalProfesor";
import ProfesorFormModal from "../../utils/ProfesorFormModal";

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
  onShowModal: (profesor: Profesor) => void;
  onEdit: (profesor: Profesor) => void;
  onDelete: (profesor: Profesor) => void;
  fadeAnim: Animated.Value;
}

/**
 * Props para el filtro de profesores
 */
interface FilterState {
  carrera: string;
  estatus: string;
  searchText: string;
}

/**
 * Componente para renderizar un item individual de profesor
 */
const ProfesorItem: React.FC<ProfesorItemProps> = ({
  profesor,
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
      `¿Estás seguro de que deseas eliminar a ${profesor.nombre}?\n\nEsta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onDelete(profesor),
        },
      ]
    );
  };

  /**
   * Obtiene el color del estatus
   */
  const getEstatusColor = (estatus?: string): string => {
    switch (estatus) {
      case "Activo":
        return "#4CAF50";
      case "Inactivo":
        return "#F44336";
      case "Licencia":
        return "#FF9800";
      default:
        return COLORS.textSecondary;
    }
  };

  return (
    <Animated.View style={[styles.profesorCard, { opacity: fadeAnim }]}>
      <Image source={profesorImage} style={styles.profesorImage} />
      <View style={styles.profesorInfo}>
        <View style={styles.profesorHeader}>
          <Text style={styles.profesorNombre} numberOfLines={2}>
            {profesor.nombre}
          </Text>
          {profesor.estatus && (
            <View
              style={[
                styles.estatusBadge,
                { backgroundColor: getEstatusColor(profesor.estatus) },
              ]}
            >
              <Text style={styles.estatusText}>{profesor.estatus}</Text>
            </View>
          )}
        </View>

        <Text style={styles.profesorCarrera}>Carrera: {profesor.carrera}</Text>

        {profesor.especialidad && (
          <Text style={styles.profesorEspecialidad} numberOfLines={1}>
            🎯 {profesor.especialidad}
          </Text>
        )}

        {profesor.gradoAcademico && (
          <Text style={styles.profesorGrado}>🎓 {profesor.gradoAcademico}</Text>
        )}

        {profesor.email && (
          <Text style={styles.profesorEmail} numberOfLines={1}>
            📧 {profesor.email}
          </Text>
        )}

        {profesor.telefono && (
          <Text style={styles.profesorTelefono} numberOfLines={1}>
            📱 {profesor.telefono}
          </Text>
        )}

        {profesor.numeroEmpleado && (
          <Text style={styles.profesorEmpleado}>
            🆔 Emp: {profesor.numeroEmpleado}
          </Text>
        )}

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => onPress(profesor)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="visibility" size={14} color={COLORS.surface} />
            <Text style={styles.buttonText}>Ver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(profesor)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="edit" size={14} color={COLORS.surface} />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => onShowModal(profesor)}
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
 * Pantalla principal de lista de profesores con CRUD completo
 * Permite crear, leer, actualizar y eliminar profesores
 */
const ProfesorScreen: React.FC<ProfesorScreenProps> = ({ navigation }) => {
  // Estados principales
  const [screenState, setScreenState] = useState<ScreenState<Profesor>>({
    data: [],
    loading: "idle",
    error: { hasError: false },
  });

  const [filteredData, setFilteredData] = useState<Profesor[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedProfesor, setSelectedProfesor] = useState<Profesor | null>(
    null
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [formModalVisible, setFormModalVisible] = useState<boolean>(false);
  const [editingProfesor, setEditingProfesor] = useState<Profesor | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [searchVisible, setSearchVisible] = useState<boolean>(false);

  // Estados de filtro
  const [filter, setFilter] = useState<FilterState>({
    carrera: "Todas",
    estatus: "Todos",
    searchText: "",
  });

  // Animación de fade
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /**
   * Datos mock de profesores - En una app real vendrían de una API
   */
  const [mockProfesores, setMockProfesores] = useState<Profesor[]>([
    {
      id: 1,
      nombre: "Dr. Antonio Suárez Zinzun",
      carrera: "ISC",
      especialidad: "Inteligencia Artificial",
      email: "antonio.suarez@escuela.edu.mx",
      telefono: "+52 443 234 5678",
      gradoAcademico: "Doctorado",
      numeroEmpleado: "EMP001",
      departamento: "Sistemas",
      fechaIngreso: "15/08/2015",
      estatus: "Activo",
    },
    {
      id: 2,
      nombre: "M.C. Roberto Suárez Zinzun",
      carrera: "ISC",
      especialidad: "Desarrollo Web",
      email: "roberto.suarez@escuela.edu.mx",
      telefono: "+52 443 345 6789",
      gradoAcademico: "Maestría",
      numeroEmpleado: "EMP002",
      departamento: "Sistemas",
      fechaIngreso: "10/01/2018",
      estatus: "Activo",
    },
    {
      id: 3,
      nombre: "Ing. Francisco Rodríguez Díaz",
      carrera: "ISC",
      especialidad: "Redes y Telecomunicaciones",
      email: "francisco.rodriguez@escuela.edu.mx",
      telefono: "+52 443 456 7890",
      gradoAcademico: "Licenciatura",
      numeroEmpleado: "EMP003",
      departamento: "Sistemas",
      fechaIngreso: "05/09/2017",
      estatus: "Activo",
    },
    {
      id: 4,
      nombre: "Dra. Ana Celia Segundo Sevilla",
      carrera: "ISC",
      especialidad: "Bases de Datos",
      email: "ana.segundo@escuela.edu.mx",
      telefono: "+52 443 567 8901",
      gradoAcademico: "Doctorado",
      numeroEmpleado: "EMP004",
      departamento: "Sistemas",
      fechaIngreso: "20/02/2016",
      estatus: "Activo",
    },
    {
      id: 5,
      nombre: "M.C. Claudia Baeza Lara",
      carrera: "IGE",
      especialidad: "Gestión de Proyectos",
      email: "claudia.baeza@escuela.edu.mx",
      telefono: "+52 443 678 9012",
      gradoAcademico: "Maestría",
      numeroEmpleado: "EMP005",
      departamento: "Gestión",
      fechaIngreso: "12/03/2019",
      estatus: "Activo",
    },
    {
      id: 6,
      nombre: "Dr. Ricardo García Cruz",
      carrera: "IIA",
      especialidad: "Automatización Industrial",
      email: "ricardo.garcia@escuela.edu.mx",
      telefono: "+52 443 789 0123",
      gradoAcademico: "Doctorado",
      numeroEmpleado: "EMP006",
      departamento: "Industrias",
      fechaIngreso: "08/07/2020",
      estatus: "Licencia",
    },
    {
      id: 7,
      nombre: "M.C. Patricia López Hernández",
      carrera: "ITICS",
      especialidad: "Ciberseguridad",
      email: "patricia.lopez@escuela.edu.mx",
      telefono: "+52 443 890 1234",
      gradoAcademico: "Maestría",
      numeroEmpleado: "EMP007",
      departamento: "TICs",
      fechaIngreso: "15/11/2021",
      estatus: "Activo",
    },
  ]);

  // Opciones de filtros
  const carrerasDisponibles = ["Todas", "ISC", "IGE", "IIA", "ITICS"];
  const estatusDisponibles = ["Todos", "Activo", "Inactivo", "Licencia"];

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
          message: "Error al cargar los profesores. Verifica tu conexión.",
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

    // Filtro por estatus
    if (filter.estatus !== "Todos") {
      filtered = filtered.filter(
        (profesor) => profesor.estatus === filter.estatus
      );
    }

    // Filtro por texto de búsqueda
    if (filter.searchText.trim() !== "") {
      const searchLower = filter.searchText.toLowerCase();
      filtered = filtered.filter(
        (profesor) =>
          profesor.nombre.toLowerCase().includes(searchLower) ||
          profesor.especialidad?.toLowerCase().includes(searchLower) ||
          profesor.email?.toLowerCase().includes(searchLower) ||
          profesor.numeroEmpleado?.toLowerCase().includes(searchLower)
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
   * Muestra el modal con información del profesor
   */
  const handleShowModal = (profesor: Profesor): void => {
    setSelectedProfesor(profesor);
    setModalVisible(true);
  };

  /**
   * Cierra el modal de información
   */
  const handleCloseModal = (): void => {
    setModalVisible(false);
    setSelectedProfesor(null);
  };

  /**
   * Abre el modal para crear un nuevo profesor
   */
  const handleCreateProfesor = (): void => {
    setFormMode("create");
    setEditingProfesor(null);
    setFormModalVisible(true);
  };

  /**
   * Abre el modal para editar un profesor existente
   */
  const handleEditProfesor = (profesor: Profesor): void => {
    setFormMode("edit");
    setEditingProfesor(profesor);
    setFormModalVisible(true);
  };

  /**
   * Maneja la eliminación de un profesor
   */
  const handleDeleteProfesor = (profesor: Profesor): void => {
    // Actualizar la lista de profesores mock
    const updatedProfesores = mockProfesores.filter(
      (p) => p.id !== profesor.id
    );
    setMockProfesores(updatedProfesores);

    // Actualizar el estado de la pantalla
    setScreenState((prev) => ({
      ...prev,
      data: updatedProfesores,
    }));

    // Mostrar confirmación con animación
    Alert.alert(
      "✅ Profesor Eliminado",
      `${profesor.nombre} ha sido eliminado exitosamente del sistema.`,
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
  const handleFormSubmit = (profesorData: Partial<Profesor>): void => {
    if (formMode === "create") {
      // Crear nuevo profesor
      const newId = Math.max(...mockProfesores.map((p) => p.id), 0) + 1;
      const newProfesor: Profesor = {
        id: newId,
        nombre: profesorData.nombre!,
        carrera: profesorData.carrera!,
        email: profesorData.email!,
        telefono: profesorData.telefono,
        especialidad: profesorData.especialidad,
        gradoAcademico: profesorData.gradoAcademico,
        numeroEmpleado: profesorData.numeroEmpleado,
        departamento: profesorData.departamento,
        fechaIngreso: profesorData.fechaIngreso,
        estatus: profesorData.estatus || "Activo",
      };

      const updatedProfesores = [...mockProfesores, newProfesor];
      setMockProfesores(updatedProfesores);

      // Actualizar el estado de la pantalla
      setScreenState((prev) => ({
        ...prev,
        data: updatedProfesores,
      }));

      Alert.alert(
        "✅ Profesor Creado",
        `${newProfesor.nombre} ha sido agregado exitosamente al sistema.`,
        [{ text: "Excelente" }]
      );
    } else if (formMode === "edit" && editingProfesor) {
      // Editar profesor existente
      const updatedProfesores = mockProfesores.map((profesor) =>
        profesor.id === editingProfesor.id
          ? { ...profesor, ...profesorData }
          : profesor
      );

      setMockProfesores(updatedProfesores);

      // Actualizar el estado de la pantalla
      setScreenState((prev) => ({
        ...prev,
        data: updatedProfesores,
      }));

      Alert.alert(
        "✅ Profesor Actualizado",
        `La información de ${profesorData.nombre} ha sido actualizada correctamente.`,
        [{ text: "Perfecto" }]
      );
    }
  };

  /**
   * Cierra el modal del formulario
   */
  const handleCloseFormModal = (): void => {
    setFormModalVisible(false);
    setEditingProfesor(null);
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
      estatus: "Todos",
      searchText: "",
    });
    setSearchVisible(false);
  };

  /**
   * Calcula estadísticas de los profesores
   */
  const getStats = () => {
    const total = filteredData.length;
    const porCarrera = carrerasDisponibles.slice(1).reduce((acc, carrera) => {
      acc[carrera] = filteredData.filter((p) => p.carrera === carrera).length;
      return acc;
    }, {} as Record<string, number>);

    const porEstatus = estatusDisponibles.slice(1).reduce((acc, estatus) => {
      acc[estatus] = filteredData.filter((p) => p.estatus === estatus).length;
      return acc;
    }, {} as Record<string, number>);

    return { total, porCarrera, porEstatus };
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
        <Text style={styles.headerTitle}>Lista de Profesores</Text>
        <Text style={styles.headerSubtitle}>
          {filteredData.length} profesor{filteredData.length !== 1 ? "es" : ""}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleCreateProfesor}
      >
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
      <Animated.View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, especialidad, email o empleado..."
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

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>📊 Filtrar por estatus:</Text>
          <View style={styles.filterButtons}>
            {estatusDisponibles.map((estatus) => (
              <TouchableOpacity
                key={estatus}
                style={[
                  styles.filterButton,
                  filter.estatus === estatus && styles.filterButtonActive,
                ]}
                onPress={() => setFilter((prev) => ({ ...prev, estatus }))}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filter.estatus === estatus && styles.filterButtonTextActive,
                  ]}
                >
                  {estatus}
                  {estatus !== "Todos" &&
                    stats.porEstatus[estatus] > 0 &&
                    ` (${stats.porEstatus[estatus]})`}
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

          {(filter.carrera !== "Todas" ||
            filter.estatus !== "Todos" ||
            filter.searchText !== "") && (
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
      <Text style={styles.loadingText}>Cargando profesores...</Text>
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
      <TouchableOpacity style={styles.retryButton} onPress={loadProfesores}>
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
      <FontAwesome5
        name="chalkboard-teacher"
        size={64}
        color={COLORS.textSecondary}
      />
      <Text style={styles.emptyTitle}>
        {filter.carrera !== "Todas" ||
        filter.estatus !== "Todos" ||
        filter.searchText !== ""
          ? "Sin resultados"
          : "Sin profesores registrados"}
      </Text>
      <Text style={styles.emptyText}>
        {filter.carrera !== "Todas" ||
        filter.estatus !== "Todos" ||
        filter.searchText !== ""
          ? "No se encontraron profesores con los filtros aplicados."
          : "Aún no hay profesores en el sistema."}
      </Text>

      {screenState.data.length === 0 ? (
        <TouchableOpacity
          style={styles.addFirstButton}
          onPress={handleCreateProfesor}
        >
          <MaterialIcons name="add" size={20} color={COLORS.surface} />
          <Text style={styles.addFirstButtonText}>Agregar primer profesor</Text>
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
      onPress={handleCreateProfesor}
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
            <FlatList<Profesor>
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ProfesorItem
                  profesor={item}
                  onPress={handleProfesorPress}
                  onShowModal={handleShowModal}
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
      <ModalProfesor
        visible={modalVisible}
        onClose={handleCloseModal}
        profesor={selectedProfesor}
      />

      {/* Modal de formulario */}
      <ProfesorFormModal
        visible={formModalVisible}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        profesor={editingProfesor}
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
    marginBottom: 16,
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
  profesorCard: {
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
  profesorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    borderWidth: 2,
    borderColor: COLORS.primary + "20",
  },
  profesorInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  profesorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  profesorNombre: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  estatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estatusText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.surface,
    fontWeight: "600",
  },
  profesorCarrera: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 3,
  },
  profesorEspecialidad: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 3,
  },
  profesorGrado: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    fontWeight: "500",
    marginBottom: 3,
  },
  profesorEmail: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    marginBottom: 2,
  },
  profesorTelefono: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    marginBottom: 2,
  },
  profesorEmpleado: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
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

export default ProfesorScreen;
