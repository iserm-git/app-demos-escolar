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
  Linking,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

// Importamos los tipos
import { RootStackParamList } from "../../navigation/StackNavigator";
import {
  Profesor,
  Materia,
  Grupo,
  LoadingState,
  ErrorState,
  COLORS,
  FONT_SIZES,
  ID,
} from "../../../types/";

// Imágenes
const profesorImageDefault = require("../../../assets/profesor_image1.png");
const logoImage = require("../../../assets/logoApp.png");

/**
 * Tipos para navegación
 */
type ProfesorDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ProfesorDetails"
>;
type ProfesorDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ProfesorDetails"
>;

/**
 * Props que recibe el componente
 */
interface ProfesorDetailScreenProps {
  navigation: ProfesorDetailScreenNavigationProp;
  route: ProfesorDetailScreenRouteProp;
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
 * Interface para datos académicos del profesor
 */
interface ProfesorAcademicData {
  materiasImpartidas: Materia[];
  gruposAsignados: Grupo[];
  estudiantesTotales: number;
  experienciaAnios: number;
  promedioEvaluacion: number;
  publicaciones: number;
}

/**
 * Interface para estadísticas del profesor
 */
interface ProfesorStats {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  color: string;
}

/**
 * Props para el componente de información académica
 */
interface AcademicInfoProps {
  data: ProfesorAcademicData;
}

/**
 * Componente para mostrar información académica del profesor
 */
const AcademicInfo: React.FC<AcademicInfoProps> = ({ data }) => {
  const statsItems: ProfesorStats[] = [
    {
      label: "Evaluación Promedio",
      value: data.promedioEvaluacion.toFixed(1),
      icon: "star",
      color: "#FFD700",
    },
    {
      label: "Años de Experiencia",
      value: data.experienciaAnios.toString(),
      icon: "work",
      color: "#4CAF50",
    },
    {
      label: "Estudiantes Totales",
      value: data.estudiantesTotales.toString(),
      icon: "people",
      color: "#2196F3",
    },
    {
      label: "Publicaciones",
      value: data.publicaciones.toString(),
      icon: "library-books",
      color: "#FF9800",
    },
  ];

  return (
    <View style={styles.academicContainer}>
      <Text style={styles.sectionTitle}>📊 Información Académica</Text>
      <View style={styles.statsGrid}>
        {statsItems.map((item, index) => (
          <View key={index} style={styles.statItem}>
            <View
              style={[styles.statIcon, { backgroundColor: item.color }]}
            >
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
 * Componente para mostrar materias del profesor
 */
const MateriasCard: React.FC<{ materias: Materia[] }> = ({ materias }) => (
  <View style={styles.materiasContainer}>
    <Text style={styles.sectionTitle}>📚 Materias que Imparte</Text>
    {materias.length === 0 ? (
      <View style={styles.emptyMaterias}>
        <MaterialIcons name="school" size={40} color={COLORS.textSecondary} />
        <Text style={styles.emptyText}>No hay materias asignadas</Text>
      </View>
    ) : (
      <View style={styles.materiasGrid}>
        {materias.map((materia) => (
          <View key={materia.id} style={styles.materiaItem}>
            <View style={styles.materiaHeader}>
              <Text style={styles.materiaName} numberOfLines={2}>
                {materia.nombre}
              </Text>
              <View style={styles.creditsBadge}>
                <Text style={styles.creditsText}>{materia.creditos}c</Text>
              </View>
            </View>
            <Text style={styles.materiaCarrera}>
              {materia.carrera} • Semestre {materia.semestre}
            </Text>
            {materia.descripcion && (
              <Text style={styles.materiaDescription} numberOfLines={2}>
                {materia.descripcion}
              </Text>
            )}
          </View>
        ))}
      </View>
    )}
  </View>
);

/**
 * Componente para mostrar grupos del profesor
 */
const GruposCard: React.FC<{ grupos: Grupo[] }> = ({ grupos }) => (
  <View style={styles.gruposContainer}>
    <Text style={styles.sectionTitle}>👥 Grupos Asignados</Text>
    {grupos.length === 0 ? (
      <View style={styles.emptyGrupos}>
        <MaterialIcons name="group" size={40} color={COLORS.textSecondary} />
        <Text style={styles.emptyText}>No hay grupos asignados</Text>
      </View>
    ) : (
      <View style={styles.gruposGrid}>
        {grupos.map((grupo) => (
          <View key={grupo.id} style={styles.grupoItem}>
            <View style={styles.grupoHeader}>
              <Text style={styles.grupoName}>{grupo.nombre}</Text>
              <View style={[
                styles.estatusGrupoBadge, 
                { backgroundColor: grupo.estatus === "Activo" ? "#4CAF50" : "#F44336" }
              ]}>
                <Text style={styles.estatusGrupoText}>{grupo.estatus}</Text>
              </View>
            </View>
            <Text style={styles.grupoCarrera}>{grupo.carrera}</Text>
            {grupo.aula && (
              <Text style={styles.grupoAula}>Aula: {grupo.aula}</Text>
            )}
            {grupo.estudiantesInscritos && (
              <Text style={styles.grupoEstudiantes}>
                {grupo.estudiantesInscritos.length} estudiantes
              </Text>
            )}
          </View>
        ))}
      </View>
    )}
  </View>
);

/**
 * Pantalla de detalle de un profesor específico
 * Muestra información completa y opciones de gestión
 */
const ProfesorDetailScreen: React.FC<ProfesorDetailScreenProps> = ({
  navigation,
  route,
}) => {
  // Extraemos los parámetros de la ruta
  const { nombre, id } = route.params;

  // Estados del componente
  const [profesor, setProfesor] = useState<Profesor | null>(null);
  const [loading, setLoading] = useState<LoadingState>("idle");
  const [error, setError] = useState<ErrorState>({ hasError: false });
  const [academicData, setAcademicData] = useState<ProfesorAcademicData | null>(null);

  /**
   * Simula la carga de datos del profesor desde el servidor
   */
  const loadProfesorData = async (): Promise<void> => {
    setLoading("loading");
    setError({ hasError: false });

    try {
      // Simulamos delay de red
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Datos mock completos del profesor
      const profesorData: Profesor = {
        id: id || 1,
        nombre: nombre,
        carrera: "ISC",
        email: "antonio.suarez@escuela.edu.mx",
        telefono: "+52 443 234 5678",
        especialidad: "Inteligencia Artificial",
        gradoAcademico: "Doctorado",
        numeroEmpleado: "EMP001",
        departamento: "Sistemas",
        fechaIngreso: "15/08/2015",
        estatus: "Activo",
      };

      // Datos académicos mock
      const academicInfo: ProfesorAcademicData = {
        materiasImpartidas: [
          {
            id: 1,
            nombre: "Programación Orientada a Objetos",
            carrera: "ISC",
            creditos: 8,
            semestre: 7,
            descripcion: "Principios y técnicas de programación orientada a objetos",
          },
          {
            id: 2,
            nombre: "Inteligencia Artificial",
            carrera: "ISC",
            creditos: 6,
            semestre: 8,
            descripcion: "Fundamentos de IA y machine learning",
          },
          {
            id: 3,
            nombre: "Redes Neuronales",
            carrera: "ISC",
            creditos: 7,
            semestre: 9,
            descripcion: "Diseño e implementación de redes neuronales artificiales",
          },
        ],
        gruposAsignados: [
          {
            id: 1,
            nombre: "Grupo 7A - ISC",
            carrera: "ISC",
            estatus: "Activo",
            aula: "LAB-01",
            estudiantesInscritos: [1, 2, 3, 4, 5],
          },
          {
            id: 2,
            nombre: "Grupo 8A - ISC",
            carrera: "ISC",
            estatus: "Activo",
            aula: "AULA-205",
            estudiantesInscritos: [6, 7, 8, 9],
          },
        ],
        estudiantesTotales: 42,
        experienciaAnios: 9,
        promedioEvaluacion: 4.7,
        publicaciones: 15,
      };

      setProfesor(profesorData);
      setAcademicData(academicInfo);
      setLoading("success");
    } catch (err) {
      setError({
        hasError: true,
        message: "Error al cargar la información del profesor",
      });
      setLoading("error");
    }
  };

  /**
   * Efecto para cargar los datos al montar el componente
   */
  useEffect(() => {
    loadProfesorData();
  }, [id, nombre]);

  /**
   * Acciones disponibles para el profesor
   */
  const getActionItems = (): ActionItem[] => [
    {
      id: "edit",
      title: "Editar",
      icon: "edit",
      color: COLORS.primary,
      description: "Modificar información del profesor",
      onPress: handleEditProfesor,
    },
    {
      id: "schedule",
      title: "Horarios",
      icon: "schedule",
      color: "#4CAF50",
      description: "Ver horarios de clase",
      onPress: handleViewSchedule,
    },
    {
      id: "groups",
      title: "Grupos",
      icon: "group",
      color: "#2196F3",
      description: "Gestionar grupos asignados",
      onPress: handleViewGroups,
    },
    {
      id: "reports",
      title: "Reportes",
      icon: "assessment",
      color: "#FF9800",
      description: "Ver reportes académicos",
      onPress: handleViewReports,
    },
  ];

  /**
   * Maneja la edición del profesor
   */
  const handleEditProfesor = (): void => {
    Alert.alert(
      "Editar Profesor",
      "Esta funcionalidad estará disponible próximamente.",
      [{ text: "Entendido" }]
    );
  };

  /**
   * Maneja la visualización de horarios
   */
  const handleViewSchedule = (): void => {
    Alert.alert("Horarios", `Ver horarios de ${profesor?.nombre}`, [
      { text: "Entendido" },
    ]);
  };

  /**
   * Maneja la visualización de grupos
   */
  const handleViewGroups = (): void => {
    Alert.alert("Grupos", `Gestionar grupos de ${profesor?.nombre}`, [
      { text: "Entendido" },
    ]);
  };

  /**
   * Maneja la visualización de reportes
   */
  const handleViewReports = (): void => {
    Alert.alert("Reportes", `Ver reportes de ${profesor?.nombre}`, [
      { text: "Entendido" },
    ]);
  };

  /**
   * Maneja la llamada telefónica
   */
  const handlePhoneCall = (): void => {
    if (!profesor?.telefono) {
      Alert.alert("Error", "No hay número de teléfono disponible");
      return;
    }

    const phoneUrl = `tel:${profesor.telefono.replace(/\s/g, "")}`;
    
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert("Error", "No se puede realizar la llamada");
        }
      })
      .catch(() => {
        Alert.alert("Error", "No se puede realizar la llamada");
      });
  };

  /**
   * Maneja el envío de email
   */
  const handleSendEmail = (): void => {
    if (!profesor?.email) {
      Alert.alert("Error", "No hay email disponible");
      return;
    }

    const emailUrl = `mailto:${profesor.email}?subject=Contacto desde Sistema Escolar`;
    
    Linking.canOpenURL(emailUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(emailUrl);
        } else {
          Alert.alert("Error", "No se puede abrir el cliente de email");
        }
      })
      .catch(() => {
        Alert.alert("Error", "No se puede enviar el email");
      });
  };

  /**
   * Maneja el regreso a la pantalla anterior
   */
  const handleGoBack = (): void => {
    navigation.goBack();
  };

  /**
   * Obtiene el color de la carrera
   */
  const getCarreraColor = (carrera: string): string => {
    switch (carrera) {
      case "ISC":
        return "#2196F3";
      case "IGE":
        return "#4CAF50";
      case "IIA":
        return "#FF9800";
      case "ITICS":
        return "#9C27B0";
      default:
        return COLORS.primary;
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
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle del Profesor</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>
    </View>
  );

  /**
   * Renderiza la información básica del profesor
   */
  const renderBasicInfo = (): JSX.Element => (
    <View style={styles.basicInfoContainer}>
      <Image source={logoImage} style={styles.logo} />
      <View style={styles.profileSection}>
        <Image source={profesorImageDefault} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.profesorName}>{profesor?.nombre}</Text>
          <View style={styles.profesorDetails}>
            <View style={[
              styles.carreraBadge, 
              { backgroundColor: getCarreraColor(profesor?.carrera || "") }
            ]}>
              <Text style={styles.carreraText}>{profesor?.carrera}</Text>
            </View>
            {profesor?.gradoAcademico && (
              <Text style={styles.gradoText}>{profesor.gradoAcademico}</Text>
            )}
          </View>
          {profesor?.especialidad && (
            <Text style={styles.especialidadText}>{profesor.especialidad}</Text>
          )}
          <Text style={styles.profesorId}>ID: {profesor?.id}</Text>
        </View>
      </View>
    </View>
  );

  /**
   * Renderiza la información de contacto
   */
  const renderContactInfo = (): JSX.Element => (
    <View style={styles.contactContainer}>
      <Text style={styles.sectionTitle}>📞 Información de Contacto</Text>

      {profesor?.email && (
        <TouchableOpacity
          style={styles.contactItem}
          onPress={handleSendEmail}
          activeOpacity={0.7}
        >
          <MaterialIcons name="email" size={20} color={COLORS.primary} />
          <Text style={styles.contactText}>{profesor.email}</Text>
          <MaterialIcons name="open-in-new" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}

      {profesor?.telefono && (
        <TouchableOpacity
          style={styles.contactItem}
          onPress={handlePhoneCall}
          activeOpacity={0.7}
        >
          <MaterialIcons name="phone" size={20} color={COLORS.primary} />
          <Text style={styles.contactText}>{profesor.telefono}</Text>
          <MaterialIcons name="call" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}

      {profesor?.numeroEmpleado && (
        <View style={styles.contactItem}>
          <MaterialIcons name="badge" size={20} color={COLORS.primary} />
          <Text style={styles.contactText}>Empleado: {profesor.numeroEmpleado}</Text>
        </View>
      )}

      {profesor?.departamento && (
        <View style={styles.contactItem}>
          <MaterialIcons name="business" size={20} color={COLORS.primary} />
          <Text style={styles.contactText}>Depto: {profesor.departamento}</Text>
        </View>
      )}

      {profesor?.fechaIngreso && (
        <View style={styles.contactItem}>
          <MaterialIcons name="event" size={20} color={COLORS.primary} />
          <Text style={styles.contactText}>Ingreso: {profesor.fechaIngreso}</Text>
        </View>
      )}
    </View>
  );

  /**
   * Renderiza las acciones disponibles
   */
  const renderActions = (): JSX.Element => (
    <View style={styles.actionsContainer}>
      <Text style={styles.sectionTitle}>⚡ Acciones Disponibles</Text>
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
      <Text style={styles.loadingText}>Cargando información del profesor...</Text>
    </View>
  );

  /**
   * Renderiza el estado de error
   */
  const renderError = (): JSX.Element => (
    <View style={styles.centerContainer}>
      <MaterialIcons name="error-outline" size={64} color={COLORS.error} />
      <Text style={styles.errorText}>{error.message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadProfesorData}>
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
          {academicData && <MateriasCard materias={academicData.materiasImpartidas} />}
          {academicData && <GruposCard grupos={academicData.gruposAsignados} />}
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
    width: 40,
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
    borderWidth: 3,
    borderColor: COLORS.primary + "30",
  },
  profileInfo: {
    flex: 1,
  },
  profesorName: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 26,
  },
  profesorDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    flexWrap: "wrap",
    gap: 8,
  },
  carreraBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  carreraText: {
    fontSize: FONT_SIZES.small,
    fontWeight: "bold",
    color: COLORS.surface,
  },
  gradoText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
  especialidadText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 4,
  },
  profesorId: {
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  contactText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },
  academicContainer: {
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
    elevation: 1,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  materiasContainer: {
    backgroundColor: COLORS.surface,
    marginTop: 8,
    padding: 20,
  },
  materiasGrid: {
    gap: 12,
  },
  materiaItem: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    elevation: 1,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  materiaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  materiaName: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  creditsBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  creditsText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.surface,
    fontWeight: "bold",
  },
  materiaCarrera: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  materiaDescription: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    lineHeight: 16,
  },
  emptyMaterias: {
    alignItems: "center",
    paddingVertical: 40,
  },
  gruposContainer: {
    backgroundColor: COLORS.surface,
    marginTop: 8,
    padding: 20,
  },
  gruposGrid: {
    gap: 12,
  },
  grupoItem: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
    elevation: 1,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  grupoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  grupoName: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
  },
  estatusGrupoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  estatusGrupoText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.surface,
    fontWeight: "bold",
  },
  grupoCarrera: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  grupoAula: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    marginBottom: 2,
  },
  grupoEstudiantes: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    fontWeight: "600",
  },
  emptyGrupos: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: FONT_SIZES.medium,
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
    elevation: 2,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
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
    lineHeight: 16,
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

export default ProfesorDetailScreen;