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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

// Importamos los tipos
import { RootStackParamList } from "../../navigation/StackNavigator";
import {
  Alumno,
  LoadingState,
  ErrorState,
  COLORS,
  FONT_SIZES,
  ID,
} from "../../../types/";

// Imágenes
const alumnoImageDefault = require("../../../assets/alumno_image1.png");
const logoImage = require("../../../assets/logoApp.png");

/**
 * Tipos para navegación
 */
type AlumnoDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AlumnoDetails"
>;
type AlumnoDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "AlumnoDetails"
>;

/**
 * Props que recibe el componente
 */
interface AlumnoDetailScreenProps {
  navigation: AlumnoDetailScreenNavigationProp;
  route: AlumnoDetailScreenRouteProp;
}

/**
 * Interface para las acciones disponibles
 */
interface ActionItem {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  color: string;
  onPress: () => void;
  description: string;
}

/**
 * Interface para los datos académicos
 */
interface AcademicData {
  promedio: number;
  creditos: number;
  materiasAprobadas: number;
  materiasEnCurso: number;
  semestreActual: string;
}

/**
 * Props para el componente de información académica
 */
interface AcademicInfoProps {
  data: AcademicData;
}

/**
 * Componente para mostrar información académica
 */
const AcademicInfo: React.FC<AcademicInfoProps> = ({ data }) => {
  const academicItems = [
    {
      label: "Promedio General",
      value: data.promedio.toFixed(2),
      icon: "star" as const,
      color: "#FFD700",
    },
    {
      label: "Créditos Acumulados",
      value: data.creditos.toString(),
      icon: "school" as const,
      color: "#4CAF50",
    },
    {
      label: "Materias Aprobadas",
      value: data.materiasAprobadas.toString(),
      icon: "check-circle" as const,
      color: "#2196F3",
    },
    {
      label: "Materias en Curso",
      value: data.materiasEnCurso.toString(),
      icon: "schedule" as const,
      color: "#FF9800",
    },
  ];

  return (
    <View style={styles.academicContainer}>
      <Text style={styles.sectionTitle}>Información Académica</Text>
      <View style={styles.academicGrid}>
        {academicItems.map((item, index) => (
          <View key={index} style={styles.academicItem}>
            <View
              style={[styles.academicIcon, { backgroundColor: item.color }]}
            >
              <MaterialIcons
                name={item.icon}
                size={20}
                color={COLORS.surface}
              />
            </View>
            <Text style={styles.academicValue}>{item.value}</Text>
            <Text style={styles.academicLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

/**
 * Pantalla de detalle de un alumno específico
 * Muestra información completa y opciones de gestión
 */
const AlumnoDetailScreen: React.FC<AlumnoDetailScreenProps> = ({
  navigation,
  route,
}) => {
  // Extraemos los parámetros de la ruta
  const { nombre, id } = route.params;

  // Estados del componente
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [loading, setLoading] = useState<LoadingState>("idle");
  const [error, setError] = useState<ErrorState>({ hasError: false });
  const [academicData, setAcademicData] = useState<AcademicData | null>(null);

  /**
   * Simula la carga de datos del alumno desde el servidor
   */
  const loadAlumnoData = async (): Promise<void> => {
    setLoading("loading");
    setError({ hasError: false });

    try {
      // Simulamos delay de red
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Datos mock más completos del alumno
      const alumnoData: Alumno = {
        id: id || 1,
        nombre: nombre,
        sem: "7A",
        carrera: "ISC",
        email: "juan.perez@escuela.edu.mx",
        telefono: "+52 443 123 4567",
      };

      // Datos académicos mock
      const academicInfo: AcademicData = {
        promedio: 8.75,
        creditos: 180,
        materiasAprobadas: 28,
        materiasEnCurso: 6,
        semestreActual: "7A",
      };

      setAlumno(alumnoData);
      setAcademicData(academicInfo);
      setLoading("success");
    } catch (err) {
      setError({
        hasError: true,
        message: "Error al cargar la información del alumno",
      });
      setLoading("error");
    }
  };

  /**
   * Efecto para cargar los datos al montar el componente
   */
  useEffect(() => {
    loadAlumnoData();
  }, [id, nombre]);

  /**
   * Acciones disponibles para el alumno
   */
  const getActionItems = (): ActionItem[] => [
    {
      id: "edit",
      title: "Editar",
      icon: "edit",
      color: COLORS.primary,
      description: "Modificar información del alumno",
      onPress: handleEditAlumno,
    },
    {
      id: "calificaciones",
      title: "Calificaciones",
      icon: "assessment",
      color: "#4CAF50",
      description: "Ver historial académico",
      onPress: handleViewGrades,
    },
    {
      id: "asistencia",
      title: "Asistencias",
      icon: "event-available",
      color: "#2196F3",
      description: "Registro de asistencias",
      onPress: handleViewAttendance,
    },
    {
      id: "documentos",
      title: "Documentos",
      icon: "folder",
      color: "#FF9800",
      description: "Documentos del estudiante",
      onPress: handleViewDocuments,
    },
  ];

  /**
   * Maneja la edición del alumno
   */
  const handleEditAlumno = (): void => {
    Alert.alert(
      "Editar Alumno",
      "Esta funcionalidad estará disponible próximamente.",
      [{ text: "Entendido" }]
    );
  };

  /**
   * Maneja la visualización de calificaciones
   */
  const handleViewGrades = (): void => {
    Alert.alert("Calificaciones", `Ver calificaciones de ${alumno?.nombre}`, [
      { text: "Entendido" },
    ]);
  };

  /**
   * Maneja la visualización de asistencias
   */
  const handleViewAttendance = (): void => {
    Alert.alert("Asistencias", `Ver asistencias de ${alumno?.nombre}`, [
      { text: "Entendido" },
    ]);
  };

  /**
   * Maneja la visualización de documentos
   */
  const handleViewDocuments = (): void => {
    Alert.alert("Documentos", `Ver documentos de ${alumno?.nombre}`, [
      { text: "Entendido" },
    ]);
  };

  /**
   * Maneja el regreso a la pantalla anterior
   */
  const handleGoBack = (): void => {
    navigation.goBack();
  };

  /**
   * Renderiza el header personalizado
   */
  const renderHeader = (): JSX.Element => (
    <View style={styles.header}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <SafeAreaView>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle del Alumno</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>
    </View>
  );

  /**
   * Renderiza la información básica del alumno
   */
  const renderBasicInfo = (): JSX.Element => (
    <View style={styles.basicInfoContainer}>
      <Image source={logoImage} style={styles.logo} />
      <View style={styles.profileSection}>
        <Image source={alumnoImageDefault} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.studentName}>{alumno?.nombre}</Text>
          <Text style={styles.studentDetails}>
            {alumno?.carrera} • Semestre {alumno?.sem}
          </Text>
          <Text style={styles.studentId}>ID: {alumno?.id}</Text>
        </View>
      </View>
    </View>
  );

  /**
   * Renderiza la información de contacto
   */
  const renderContactInfo = (): JSX.Element => (
    <View style={styles.contactContainer}>
      <Text style={styles.sectionTitle}>Información de Contacto</Text>

      {alumno?.email && (
        <View style={styles.contactItem}>
          <MaterialIcons name="email" size={20} color={COLORS.primary} />
          <Text style={styles.contactText}>{alumno.email}</Text>
        </View>
      )}

      {alumno?.telefono && (
        <View style={styles.contactItem}>
          <MaterialIcons name="phone" size={20} color={COLORS.primary} />
          <Text style={styles.contactText}>{alumno.telefono}</Text>
        </View>
      )}
    </View>
  );

  /**
   * Renderiza las acciones disponibles
   */
  const renderActions = (): JSX.Element => (
    <View style={styles.actionsContainer}>
      <Text style={styles.sectionTitle}>Acciones Disponibles</Text>
      <View style={styles.actionsGrid}>
        {getActionItems().map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionButton}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: action.color }]}
            >
              <MaterialIcons
                name={action.icon}
                size={24}
                color={COLORS.surface}
              />
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionDescription}>{action.description}</Text>
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
      <Text style={styles.loadingText}>Cargando información del alumno...</Text>
    </View>
  );

  /**
   * Renderiza el estado de error
   */
  const renderError = (): JSX.Element => (
    <View style={styles.centerContainer}>
      <MaterialIcons name="error-outline" size={64} color={COLORS.error} />
      <Text style={styles.errorText}>{error.message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadAlumnoData}>
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
          {renderContactInfo()}
          {academicData && <AcademicInfo data={academicData} />}
          {renderActions()}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.surface,
    textAlign: "center",
  },
  placeholder: {
    width: 40, // Para balancear el botón de regreso
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
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  studentId: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  contactContainer: {
    backgroundColor: COLORS.surface,
    marginTop: 8,
    padding: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    marginLeft: 12,
  },
  academicContainer: {
    backgroundColor: COLORS.surface,
    marginTop: 8,
    padding: 20,
  },
  academicGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  academicItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  academicIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  academicValue: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  academicLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  actionsContainer: {
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
  actionButton: {
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
  actionTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
    textAlign: "center",
  },
  actionDescription: {
    fontSize: FONT_SIZES.small,
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

export default AlumnoDetailScreen;
