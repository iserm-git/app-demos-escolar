import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  FlatList,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

// Importamos los tipos
import { RootStackParamList } from "../../navigation/StackNavigator";
import {
  Grupo,
  Alumno,
  Profesor,
  LoadingState,
  ErrorState,
  COLORS,
  FONT_SIZES,
  ID,
} from "../../../types";

// Imágenes
const grupoImageDefault = require("../../../assets/grupo_image.png");
const alumnoImageDefault = require("../../../assets/alumno_image1.png");
const logoImage = require("../../../assets/logoApp.png");

/**
 * Tipos para navegación
 */
type GrupoDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "GrupoDetails"
>;
type GrupoDetailScreenRouteProp = RouteProp<RootStackParamList, "GrupoDetails">;

/**
 * Props que recibe el componente
 */
interface GrupoDetailScreenProps {
  navigation: GrupoDetailScreenNavigationProp;
  route: GrupoDetailScreenRouteProp;
}

/**
 * Interface para información completa del grupo
 */
interface GrupoCompleto extends Grupo {
  profesor?: Profesor;
  alumnos: Alumno[];
  horarios: HorarioClase[];
  estadisticas: EstadisticasGrupo;
  materias: MateriaGrupo[];
}

/**
 * Interface para horarios de clase
 */
interface HorarioClase {
  id: ID;
  dia: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado";
  horaInicio: string;
  horaFin: string;
  materia: string;
  aula: string;
}

/**
 * Interface para estadísticas del grupo
 */
interface EstadisticasGrupo {
  totalAlumnos: number;
  promedioGeneral: number;
  asistenciaPromedio: number;
  alumnosAprobados: number;
  alumnosReprobados: number;
}

/**
 * Interface para materias del grupo
 */
interface MateriaGrupo {
  id: ID;
  nombre: string;
  creditos: number;
  profesor: string;
  semestre: number;
}

/**
 * Props para el componente de alumno en lista
 */
interface AlumnoListItemProps {
  alumno: Alumno;
  onPress: (alumno: Alumno) => void;
  index: number;
}

/**
 * Componente para renderizar un alumno en la lista
 */
const AlumnoListItem: React.FC<AlumnoListItemProps> = ({
  alumno,
  onPress,
  index,
}) => (
  <TouchableOpacity
    style={styles.alumnoItem}
    onPress={() => onPress(alumno)}
    activeOpacity={0.7}
  >
    <Text style={styles.alumnoNumber}>{index + 1}</Text>
    <Image source={alumnoImageDefault} style={styles.alumnoAvatar} />
    <View style={styles.alumnoInfo}>
      <Text style={styles.alumnoName} numberOfLines={1}>
        {alumno.nombre}
      </Text>
      <Text style={styles.alumnoSemester}>Semestre: {alumno.sem}</Text>
      {alumno.email && (
        <Text style={styles.alumnoEmail} numberOfLines={1}>
          {alumno.email}
        </Text>
      )}
    </View>
    <MaterialIcons
      name="chevron-right"
      size={20}
      color={COLORS.textSecondary}
    />
  </TouchableOpacity>
);

/**
 * Componente para mostrar estadísticas del grupo
 */
const EstadisticasCard: React.FC<{ estadisticas: EstadisticasGrupo }> = ({
  estadisticas,
}) => {
  const statsItems = [
    {
      label: "Promedio General",
      value: estadisticas.promedioGeneral.toFixed(2),
      icon: "star" as const,
      color: "#FFD700",
    },
    {
      label: "Asistencia",
      value: `${estadisticas.asistenciaPromedio}%`,
      icon: "event-available" as const,
      color: "#4CAF50",
    },
    {
      label: "Aprobados",
      value: estadisticas.alumnosAprobados.toString(),
      icon: "check-circle" as const,
      color: "#2196F3",
    },
    {
      label: "Reprobados",
      value: estadisticas.alumnosReprobados.toString(),
      icon: "cancel" as const,
      color: "#F44336",
    },
  ];

  return (
    <View style={styles.statisticsContainer}>
      <Text style={styles.sectionTitle}>Estadísticas del Grupo</Text>
      <View style={styles.statsGrid}>
        {statsItems.map((item, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: item.color }]}>
              <MaterialIcons
                name={item.icon}
                size={20}
                color={COLORS.surface}
              />
            </View>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

/**
 * Componente para mostrar horarios del grupo
 */
const HorariosCard: React.FC<{ horarios: HorarioClase[] }> = ({ horarios }) => (
  <View style={styles.horariosContainer}>
    <Text style={styles.sectionTitle}>Horarios de Clase</Text>
    {horarios.length === 0 ? (
      <View style={styles.emptyHorarios}>
        <MaterialIcons name="schedule" size={40} color={COLORS.textSecondary} />
        <Text style={styles.emptyText}>No hay horarios asignados</Text>
      </View>
    ) : (
      <View style={styles.horariosGrid}>
        {horarios.map((horario) => (
          <View key={horario.id} style={styles.horarioItem}>
            <View style={styles.horarioHeader}>
              <Text style={styles.horarioDia}>{horario.dia}</Text>
              <Text style={styles.horarioHora}>
                {horario.horaInicio} - {horario.horaFin}
              </Text>
            </View>
            <Text style={styles.horarioMateria}>{horario.materia}</Text>
            <Text style={styles.horarioAula}>Aula: {horario.aula}</Text>
          </View>
        ))}
      </View>
    )}
  </View>
);

/**
 * Pantalla de detalle de un grupo específico
 * Muestra información completa del grupo, alumnos, estadísticas y horarios
 */
const GrupoDetailScreen: React.FC<GrupoDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { nombre, id } = route.params;

  // Estados del componente
  const [grupo, setGrupo] = useState<GrupoCompleto | null>(null);
  const [loading, setLoading] = useState<LoadingState>("idle");
  const [error, setError] = useState<ErrorState>({ hasError: false });
  const [selectedSection, setSelectedSection] = useState<
    "alumnos" | "horarios" | "estadisticas"
  >("alumnos");

  /**
   * Mock data para el grupo completo
   */
  const getMockGrupoData = (): GrupoCompleto => ({
    id: id || 1,
    nombre: nombre,
    carrera: "ISC",
    profesor: {
      id: 1,
      nombre: "Dr. Antonio Suárez Zinzun",
      carrera: "ISC",
      especialidad: "Inteligencia Artificial",
      email: "antonio.suarez@escuela.edu.mx",
    },
    alumnos: [
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
        sem: "7A",
        carrera: "ISC",
        email: "luis.martinez@escuela.edu.mx",
      },
      {
        id: 4,
        nombre: "María Fernanda Silva",
        sem: "7A",
        carrera: "ISC",
        email: "maria.silva@escuela.edu.mx",
      },
      {
        id: 5,
        nombre: "Carlos Eduardo Ramírez",
        sem: "7A",
        carrera: "ISC",
        email: "carlos.ramirez@escuela.edu.mx",
      },
    ],
    horarios: [
      {
        id: 1,
        dia: "Lunes",
        horaInicio: "08:00",
        horaFin: "10:00",
        materia: "Programación Orientada a Objetos",
        aula: "LAB-01",
      },
      {
        id: 2,
        dia: "Miércoles",
        horaInicio: "10:00",
        horaFin: "12:00",
        materia: "Bases de Datos",
        aula: "AULA-205",
      },
      {
        id: 3,
        dia: "Viernes",
        horaInicio: "14:00",
        horaFin: "16:00",
        materia: "Ingeniería de Software",
        aula: "AULA-301",
      },
    ],
    estadisticas: {
      totalAlumnos: 5,
      promedioGeneral: 8.45,
      asistenciaPromedio: 87,
      alumnosAprobados: 4,
      alumnosReprobados: 1,
    },
    materias: [
      {
        id: 1,
        nombre: "Programación Orientada a Objetos",
        creditos: 8,
        profesor: "Dr. Antonio Suárez Zinzun",
        semestre: 7,
      },
      {
        id: 2,
        nombre: "Bases de Datos",
        creditos: 6,
        profesor: "Dra. Ana Celia Segundo",
        semestre: 7,
      },
    ],
  });

  /**
   * Simula la carga de datos del grupo
   */
  const loadGrupoData = async (): Promise<void> => {
    setLoading("loading");
    setError({ hasError: false });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const grupoData = getMockGrupoData();
      setGrupo(grupoData);
      setLoading("success");
    } catch (err) {
      setError({
        hasError: true,
        message: "Error al cargar la información del grupo",
      });
      setLoading("error");
    }
  };

  /**
   * Efecto para cargar los datos al montar el componente
   */
  useEffect(() => {
    loadGrupoData();
  }, [id, nombre]);

  /**
   * Maneja la navegación a detalle de alumno
   */
  const handleAlumnoPress = (alumno: Alumno): void => {
    navigation.navigate("AlumnoDetails", {
      nombre: alumno.nombre,
      id: alumno.id,
    });
  };

  /**
   * Maneja las acciones del grupo
   */
  const handleGroupAction = (action: string): void => {
    switch (action) {
      case "edit":
        Alert.alert("Editar Grupo", `Editar información de ${grupo?.nombre}`, [
          { text: "Próximamente" },
        ]);
        break;
      case "addAlumno":
        Alert.alert("Agregar Alumno", "Inscribir un nuevo alumno al grupo", [
          { text: "Próximamente" },
        ]);
        break;
      case "viewReports":
        Alert.alert("Reportes", "Ver reportes de rendimiento del grupo", [
          { text: "Próximamente" },
        ]);
        break;
      default:
        break;
    }
  };

  /**
   * Renderiza el header personalizado
   */
  const renderHeader = (): JSX.Element => (
    <View style={styles.header}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <SafeAreaView>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle del Grupo</Text>
          <TouchableOpacity
            onPress={() => handleGroupAction("edit")}
            style={styles.editButton}
          >
            <MaterialIcons name="edit" size={24} color={COLORS.surface} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );

  /**
   * Renderiza la información básica del grupo
   */
  const renderBasicInfo = (): JSX.Element => (
    <View style={styles.basicInfoContainer}>
      <Image source={logoImage} style={styles.logo} />
      <View style={styles.groupSection}>
        <Image source={grupoImageDefault} style={styles.groupImage} />
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{grupo?.nombre}</Text>
          <Text style={styles.groupCarrera}>
            {grupo?.carrera} • {grupo?.estadisticas.totalAlumnos} estudiantes
          </Text>
          <Text style={styles.groupId}>ID: {grupo?.id}</Text>
          {grupo?.profesor && (
            <Text style={styles.groupProfesor}>
              Prof. {grupo.profesor.nombre}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  /**
   * Renderiza los tabs de secciones
   */
  const renderSectionTabs = (): JSX.Element => (
    <View style={styles.tabsContainer}>
      {[
        { key: "alumnos", label: "Alumnos", icon: "people" },
        { key: "estadisticas", label: "Estadísticas", icon: "bar-chart" },
        { key: "horarios", label: "Horarios", icon: "schedule" },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, selectedSection === tab.key && styles.tabActive]}
          onPress={() => setSelectedSection(tab.key as any)}
        >
          <MaterialIcons
            name={tab.icon as any}
            size={20}
            color={
              selectedSection === tab.key
                ? COLORS.surface
                : COLORS.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              selectedSection === tab.key && styles.tabTextActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  /**
   * Renderiza el contenido de la sección seleccionada
   */
  const renderSectionContent = (): JSX.Element => {
    if (!grupo) return <></>;

    switch (selectedSection) {
      case "alumnos":
        return (
          <View style={styles.sectionContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Lista de Alumnos ({grupo.alumnos.length})
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleGroupAction("addAlumno")}
              >
                <MaterialIcons name="add" size={20} color={COLORS.surface} />
              </TouchableOpacity>
            </View>

            {grupo.alumnos.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons
                  name="person-outline"
                  size={60}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.emptyText}>No hay alumnos inscritos</Text>
              </View>
            ) : (
              <FlatList<Alumno>
                data={grupo.alumnos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                  <AlumnoListItem
                    alumno={item}
                    onPress={handleAlumnoPress}
                    index={index}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.alumnosList}
              />
            )}
          </View>
        );

      case "estadisticas":
        return <EstadisticasCard estadisticas={grupo.estadisticas} />;

      case "horarios":
        return <HorariosCard horarios={grupo.horarios} />;

      default:
        return <></>;
    }
  };

  /**
   * Renderiza las acciones rápidas
   */
  const renderQuickActions = (): JSX.Element => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      <View style={styles.actionsGrid}>
        {[
          {
            icon: "assessment",
            label: "Reportes",
            action: "viewReports",
            color: "#4CAF50",
          },
          {
            icon: "event",
            label: "Asistencias",
            action: "attendance",
            color: "#2196F3",
          },
          {
            icon: "grade",
            label: "Calificaciones",
            action: "grades",
            color: "#FF9800",
          },
          {
            icon: "share",
            label: "Compartir",
            action: "share",
            color: "#9C27B0",
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionCard}
            onPress={() => handleGroupAction(item.action)}
          >
            <View style={[styles.actionIcon, { backgroundColor: item.color }]}>
              <MaterialIcons
                name={item.icon as any}
                size={24}
                color={COLORS.surface}
              />
            </View>
            <Text style={styles.actionLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  /**
   * Renderiza el estado de carga
   */
  const renderLoading = (): JSX.Element => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Cargando información del grupo...</Text>
    </View>
  );

  /**
   * Renderiza el estado de error
   */
  const renderError = (): JSX.Element => (
    <View style={styles.centerContainer}>
      <MaterialIcons name="error-outline" size={64} color={COLORS.error} />
      <Text style={styles.errorText}>{error.message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadGrupoData}>
        <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      {loading === "loading" ? (
        renderLoading()
      ) : error.hasError ? (
        renderError()
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderBasicInfo()}
          {renderSectionTabs()}
          {renderSectionContent()}
          {renderQuickActions()}
        </ScrollView>
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
  header: {
    backgroundColor: COLORS.primary,
    elevation: 4,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.surface,
    textAlign: "center",
    flex: 1,
  },
  content: {
    flex: 1,
  },
  basicInfoContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    resizeMode: "contain",
  },
  groupSection: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  groupCarrera: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  groupId: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    marginBottom: 4,
  },
  groupProfesor: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.primary,
    fontWeight: "600",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  tabText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  tabTextActive: {
    color: COLORS.surface,
  },
  sectionContent: {
    backgroundColor: COLORS.surface,
    marginTop: 8,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  alumnosList: {
    paddingHorizontal: 20,
  },
  alumnoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  alumnoNumber: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primary,
    width: 30,
  },
  alumnoAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  alumnoInfo: {
    flex: 1,
  },
  alumnoName: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  alumnoSemester: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 1,
  },
  alumnoEmail: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
  },
  statisticsContainer: {
    backgroundColor: COLORS.surface,
    marginTop: 8,
    padding: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  horariosContainer: {
    backgroundColor: COLORS.surface,
    marginTop: 8,
    padding: 20,
  },
  horariosGrid: {
    gap: 12,
  },
  horarioItem: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  horarioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  horarioDia: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.text,
  },
  horarioHora: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    fontWeight: "600",
  },
  horarioMateria: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    marginBottom: 4,
  },
  horarioAula: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
  },
  emptyHorarios: {
    alignItems: "center",
    paddingVertical: 40,
  },
  quickActionsContainer: {
    backgroundColor: COLORS.surface,
    marginTop: 8,
    padding: 20,
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: "center",
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
  },
  errorText: {
    marginTop: 16,
    fontSize: FONT_SIZES.medium,
    color: COLORS.error,
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

export default GrupoDetailScreen;
