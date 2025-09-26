import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Importamos los tipos
import { Alumno, COLORS, FONT_SIZES } from "../../types";

// Imagen por defecto para alumnos
const alumnoImageDefault = require("../../assets/alumno_image1.png");

/**
 * Props que recibe el componente ModalAlumno
 */
interface ModalAlumnoProps {
  visible: boolean;
  onClose: () => void;
  alumno: Alumno | null;
  title?: string;
}

/**
 * Interface para las secciones de información del modal
 */
interface InfoSection {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  content: string | undefined;
  color: string;
}

/**
 * Props para el componente de información individual
 */
interface InfoItemProps {
  section: InfoSection;
}

/**
 * Obtiene las dimensiones de la pantalla para responsive design
 */
const { width, height } = Dimensions.get("window");

/**
 * Componente para renderizar una sección de información
 */
const InfoItem: React.FC<InfoItemProps> = ({ section }) => {
  if (!section.content) {
    return null; // No mostramos secciones vacías
  }

  return (
    <View style={styles.infoItem}>
      <View style={[styles.iconContainer, { backgroundColor: section.color }]}>
        <MaterialIcons name={section.icon} size={20} color={COLORS.surface} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{section.title}</Text>
        <Text style={styles.infoValue}>{section.content}</Text>
      </View>
    </View>
  );
};

/**
 * Modal para mostrar información detallada de un alumno
 * Componente reutilizable que puede ser usado desde cualquier pantalla
 */
const ModalAlumno: React.FC<ModalAlumnoProps> = ({
  visible,
  onClose,
  alumno,
  title = "Información del Alumno",
}) => {
  /**
   * Genera las secciones de información basadas en los datos del alumno
   */
  const getInfoSections = (): InfoSection[] => {
    if (!alumno) return [];

    return [
      {
        id: "nombre",
        title: "Nombre Completo",
        icon: "person",
        content: alumno.nombre,
        color: COLORS.primary,
      },
      {
        id: "semestre",
        title: "Semestre",
        icon: "school",
        content: alumno.sem,
        color: "#4CAF50",
      },
      {
        id: "carrera",
        title: "Carrera",
        icon: "work",
        content: alumno.carrera,
        color: "#FF9800",
      },
      {
        id: "email",
        title: "Correo Electrónico",
        icon: "email",
        content: alumno.email,
        color: "#2196F3",
      },
      {
        id: "telefono",
        title: "Teléfono",
        icon: "phone",
        content: alumno.telefono,
        color: "#9C27B0",
      },
      {
        id: "id",
        title: "ID de Estudiante",
        icon: "badge",
        content: alumno.id.toString(),
        color: "#607D8B",
      },
    ];
  };

  /**
   * Maneja el cierre del modal
   */
  const handleClose = (): void => {
    onClose();
  };

  /**
   * Renderiza el contenido cuando no hay alumno seleccionado
   */
  const renderEmptyState = (): JSX.Element => (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="person-outline"
        size={64}
        color={COLORS.textSecondary}
      />
      <Text style={styles.emptyText}>No hay información disponible</Text>
    </View>
  );

  /**
   * Renderiza el header del modal con la información básica
   */
  const renderHeader = (): JSX.Element => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Image source={alumnoImageDefault} style={styles.profileImage} />
        <View style={styles.headerText}>
          <Text style={styles.modalTitle} numberOfLines={2}>
            {alumno?.nombre || "Alumno"}
          </Text>
          {alumno?.sem && (
            <Text style={styles.modalSubtitle}>Semestre: {alumno.sem}</Text>
          )}
        </View>
      </View>

      {/* Botón de cerrar */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
        activeOpacity={0.7}
      >
        <MaterialIcons name="close" size={24} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  /**
   * Renderiza el contenido principal del modal
   */
  const renderContent = (): JSX.Element => {
    if (!alumno) {
      return renderEmptyState();
    }

    const infoSections = getInfoSections();
    const availableSections = infoSections.filter((section) => section.content);

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {availableSections.map((section) => (
          <InfoItem key={section.id} section={section} />
        ))}

        {/* Información adicional */}
        <View style={styles.additionalInfo}>
          <Text style={styles.additionalTitle}>Información Adicional</Text>
          <Text style={styles.additionalText}>
            Este perfil contiene la información básica del estudiante. Para más
            detalles, consulte el sistema académico.
          </Text>
        </View>
      </ScrollView>
    );
  };

  /**
   * Renderiza los botones de acción del modal
   */
  const renderActions = (): JSX.Element => (
    <View style={styles.actionContainer}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleClose}
        activeOpacity={0.8}
      >
        <MaterialIcons name="check" size={20} color={COLORS.surface} />
        <Text style={styles.actionButtonText}>Entendido</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {renderHeader()}
          {renderContent()}
          {renderActions()}
        </View>
      </View>
    </Modal>
  );
};

/**
 * Estilos del componente
 */
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 20,
    position: "relative",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.surface,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.surface,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.surface,
    opacity: 0.9,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontWeight: "500",
  },
  additionalInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: 20,
  },
  additionalTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  additionalText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

export default ModalAlumno;
