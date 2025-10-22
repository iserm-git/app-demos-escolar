import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Profesor, COLORS, FONT_SIZES } from "../../types";

// Imagen por defecto para profesores
const profesorImageDefault = require("../../assets/profesor_image1.png");

/**
 * Props para el modal de información de profesor
 */
interface ModalProfesorProps {
  visible: boolean;
  onClose: () => void;
  profesor: Profesor | null;
}

/**
 * Interface para acciones rápidas del profesor
 */
interface QuickAction {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  color: string;
  onPress: () => void;
  description: string;
}

/**
 * Modal para mostrar información detallada de un profesor
 * Incluye datos personales, académicos y acciones rápidas
 */
const ModalProfesor: React.FC<ModalProfesorProps> = ({
  visible,
  onClose,
  profesor,
}) => {
  /**
   * Maneja la llamada telefónica
   */
  const handlePhoneCall = (phoneNumber: string): void => {
    if (!phoneNumber) {
      Alert.alert("Error", "No hay número de teléfono disponible");
      return;
    }

    const phoneUrl = `tel:${phoneNumber.replace(/\s/g, "")}`;

    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert("Error", "No se puede realizar la llamada");
        }
      })
      .catch((err) => {
        console.error("Error al abrir el teléfono:", err);
        Alert.alert("Error", "No se puede realizar la llamada");
      });
  };

  /**
   * Maneja el envío de email
   */
  const handleSendEmail = (email: string): void => {
    if (!email) {
      Alert.alert("Error", "No hay email disponible");
      return;
    }

    const emailUrl = `mailto:${email}?subject=Contacto desde Sistema Escolar`;

    Linking.canOpenURL(emailUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(emailUrl);
        } else {
          Alert.alert("Error", "No se puede abrir el cliente de email");
        }
      })
      .catch((err) => {
        console.error("Error al abrir email:", err);
        Alert.alert("Error", "No se puede enviar el email");
      });
  };

  /**
   * Maneja las acciones específicas del profesor
   */
  const handleQuickAction = (actionId: string): void => {
    switch (actionId) {
      case "schedule":
        Alert.alert("Horarios", `Ver horarios de ${profesor?.nombre}`, [
          { text: "Próximamente" },
        ]);
        break;
      case "subjects":
        Alert.alert("Materias", `Materias de ${profesor?.nombre}`, [
          { text: "Próximamente" },
        ]);
        break;
      case "groups":
        Alert.alert("Grupos", `Grupos asignados a ${profesor?.nombre}`, [
          { text: "Próximamente" },
        ]);
        break;
      case "reports":
        Alert.alert("Reportes", `Reportes de ${profesor?.nombre}`, [
          { text: "Próximamente" },
        ]);
        break;
      default:
        break;
    }
  };

  /**
   * Obtiene las acciones rápidas para el profesor
   */
  const getQuickActions = (): QuickAction[] => [
    {
      id: "schedule",
      title: "Horarios",
      icon: "schedule",
      color: "#2196F3",
      description: "Ver horarios de clase",
      onPress: () => handleQuickAction("schedule"),
    },
    {
      id: "subjects",
      title: "Materias",
      icon: "book",
      color: "#4CAF50",
      description: "Materias que imparte",
      onPress: () => handleQuickAction("subjects"),
    },
    {
      id: "groups",
      title: "Grupos",
      icon: "group",
      color: "#FF9800",
      description: "Grupos asignados",
      onPress: () => handleQuickAction("groups"),
    },
    {
      id: "reports",
      title: "Reportes",
      icon: "assessment",
      color: "#9C27B0",
      description: "Ver reportes académicos",
      onPress: () => handleQuickAction("reports"),
    },
  ];

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
   * Obtiene el icono del grado académico
   */
  const getGradoAcademicoIcon = (
    grado?: string
  ): React.ComponentProps<typeof MaterialIcons>["name"] => {
    switch (grado) {
      case "Doctorado":
        return "school";
      case "Maestría":
        return "account-balance";
      case "Licenciatura":
        return "menu-book";
      default:
        return "school";
    }
  };

  /**
   * Renderiza la información de contacto
   */
  const renderContactInfo = (): JSX.Element => (
    <View style={styles.contactSection}>
      <Text style={styles.sectionTitle}>📞 Información de Contacto</Text>

      {profesor?.email && (
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleSendEmail(profesor.email!)}
          activeOpacity={0.7}
        >
          <View style={styles.contactIconContainer}>
            <MaterialIcons name="email" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{profesor.email}</Text>
          </View>
          <MaterialIcons
            name="open-in-new"
            size={16}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      )}

      {profesor?.telefono && (
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handlePhoneCall(profesor.telefono!)}
          activeOpacity={0.7}
        >
          <View style={styles.contactIconContainer}>
            <MaterialIcons name="phone" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactLabel}>Teléfono</Text>
            <Text style={styles.contactValue}>{profesor.telefono}</Text>
          </View>
          <MaterialIcons name="call" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}

      {profesor?.numeroEmpleado && (
        <View style={styles.contactItem}>
          <View style={styles.contactIconContainer}>
            <MaterialIcons name="badge" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactLabel}>Número de Empleado</Text>
            <Text style={styles.contactValue}>{profesor.numeroEmpleado}</Text>
          </View>
        </View>
      )}

      {profesor?.departamento && (
        <View style={styles.contactItem}>
          <View style={styles.contactIconContainer}>
            <MaterialIcons name="business" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactLabel}>Departamento</Text>
            <Text style={styles.contactValue}>{profesor.departamento}</Text>
          </View>
        </View>
      )}
    </View>
  );

  /**
   * Renderiza la información académica
   */
  const renderAcademicInfo = (): JSX.Element => (
    <View style={styles.academicSection}>
      <Text style={styles.sectionTitle}>🎓 Información Académica</Text>

      <View style={styles.academicGrid}>
        <View style={styles.academicItem}>
          <View
            style={[
              styles.academicIcon,
              { backgroundColor: getCarreraColor(profesor?.carrera || "") },
            ]}
          >
            <MaterialIcons name="work" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.academicLabel}>Carrera</Text>
          <Text style={styles.academicValue}>{profesor?.carrera}</Text>
        </View>

        {profesor?.especialidad && (
          <View style={styles.academicItem}>
            <View style={[styles.academicIcon, { backgroundColor: "#4CAF50" }]}>
              <MaterialIcons name="star" size={20} color={COLORS.surface} />
            </View>
            <Text style={styles.academicLabel}>Especialidad</Text>
            <Text style={styles.academicValue}>{profesor.especialidad}</Text>
          </View>
        )}

        {profesor?.gradoAcademico && (
          <View style={styles.academicItem}>
            <View style={[styles.academicIcon, { backgroundColor: "#FF9800" }]}>
              <MaterialIcons
                name={getGradoAcademicoIcon(profesor.gradoAcademico)}
                size={20}
                color={COLORS.surface}
              />
            </View>
            <Text style={styles.academicLabel}>Grado</Text>
            <Text style={styles.academicValue}>{profesor.gradoAcademico}</Text>
          </View>
        )}

        {profesor?.estatus && (
          <View style={styles.academicItem}>
            <View
              style={[
                styles.academicIcon,
                {
                  backgroundColor:
                    profesor.estatus === "Activo" ? "#4CAF50" : "#F44336",
                },
              ]}
            >
              <MaterialIcons
                name={
                  profesor.estatus === "Activo"
                    ? "check-circle"
                    : "pause-circle-filled"
                }
                size={20}
                color={COLORS.surface}
              />
            </View>
            <Text style={styles.academicLabel}>Estatus</Text>
            <Text style={styles.academicValue}>{profesor.estatus}</Text>
          </View>
        )}
      </View>
    </View>
  );

  /**
   * Renderiza las acciones rápidas
   */
  const renderQuickActions = (): JSX.Element => (
    <View style={styles.actionsSection}>
      <Text style={styles.sectionTitle}>⚡ Acciones Rápidas</Text>
      <View style={styles.actionsGrid}>
        {getQuickActions().map((action) => (
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
   * Renderiza la información adicional
   */
  const renderAdditionalInfo = (): JSX.Element => (
    <View style={styles.additionalSection}>
      <Text style={styles.sectionTitle}>ℹ️ Información Adicional</Text>

      {profesor?.fechaIngreso && (
        <View style={styles.infoRow}>
          <MaterialIcons name="event" size={18} color={COLORS.primary} />
          <Text style={styles.infoLabel}>Fecha de Ingreso:</Text>
          <Text style={styles.infoValue}>{profesor.fechaIngreso}</Text>
        </View>
      )}

      <View style={styles.infoRow}>
        <MaterialIcons name="assignment" size={18} color={COLORS.primary} />
        <Text style={styles.infoLabel}>ID de Profesor:</Text>
        <Text style={styles.infoValue}>#{profesor?.id}</Text>
      </View>

      {profesor?.materiasImpartidas &&
        profesor.materiasImpartidas.length > 0 && (
          <View style={styles.infoRow}>
            <MaterialIcons
              name="library-books"
              size={18}
              color={COLORS.primary}
            />
            <Text style={styles.infoLabel}>Materias Asignadas:</Text>
            <Text style={styles.infoValue}>
              {profesor.materiasImpartidas.length}
            </Text>
          </View>
        )}

      {profesor?.gruposAsignados && profesor.gruposAsignados.length > 0 && (
        <View style={styles.infoRow}>
          <MaterialIcons name="groups" size={18} color={COLORS.primary} />
          <Text style={styles.infoLabel}>Grupos Asignados:</Text>
          <Text style={styles.infoValue}>
            {profesor.gruposAsignados.length}
          </Text>
        </View>
      )}
    </View>
  );

  // Si no hay profesor seleccionado, no mostrar el modal
  if (!profesor) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header del modal */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Image source={profesorImageDefault} style={styles.headerImage} />
              <View style={styles.headerInfo}>
                <Text style={styles.profesorName} numberOfLines={2}>
                  {profesor.nombre}
                </Text>
                <View style={styles.headerDetails}>
                  <View
                    style={[
                      styles.carreraBadge,
                      { backgroundColor: getCarreraColor(profesor.carrera) },
                    ]}
                  >
                    <Text style={styles.carreraText}>{profesor.carrera}</Text>
                  </View>
                  {profesor.especialidad && (
                    <Text style={styles.especialidadText} numberOfLines={1}>
                      {profesor.especialidad}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons
                name="close"
                size={24}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Contenido del modal */}
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {renderContactInfo()}
            {renderAcademicInfo()}
            {renderQuickActions()}
            {renderAdditionalInfo()}

            {/* Espacio adicional al final */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    elevation: 10,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: COLORS.primary + "20",
  },
  headerInfo: {
    flex: 1,
  },
  profesorName: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  headerDetails: {
    flexDirection: "row",
    alignItems: "center",
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
  especialidadText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
  },
  modalContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
    marginTop: 8,
  },

  // Estilos para información de contacto
  contactSection: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontWeight: "500",
  },

  // Estilos para información académica
  academicSection: {
    marginBottom: 24,
  },
  academicGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  academicItem: {
    width: "47%",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    elevation: 1,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  academicIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  academicLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 4,
  },
  academicValue: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontWeight: "600",
    textAlign: "center",
  },

  // Estilos para acciones rápidas
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    width: "47%",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
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
    marginBottom: 12,
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

  // Estilos para información adicional
  additionalSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ModalProfesor;
