import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Alumno, COLORS, FONT_SIZES } from "../../types";
import { ProfileImagePicker } from "../components/camera/ProfileImagePicker";

interface AlumnoFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (alumno: Partial<Alumno>) => void;
  alumno?: Alumno | null;
  mode: "create" | "edit";
}

interface FormData {
  nombre: string;
  sem: string;
  carrera: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
  numeroControl: string;
  fotoPerfil: string; //
}

const AlumnoFormModal: React.FC<AlumnoFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  alumno,
  mode,
}) => {
  const initialFormData: FormData = {
    nombre: "",
    sem: "1A",
    carrera: "ISC",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    direccion: "",
    numeroControl: "",
    fotoPerfil: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const semestres = [
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

  const carreras = [
    { value: "ISC", label: "Ingeniería en Sistemas Computacionales" },
    { value: "IGE", label: "Ingeniería en Gestión Empresarial" },
    { value: "IIA", label: "Ingeniería en Industrias Alimentarias" },
    { value: "ITICS", label: "Ingeniería en TIC's" },
  ];

  const [showCarreraSelector, setShowCarreraSelector] = useState(false);
  const [showSemestreSelector, setShowSemestreSelector] = useState(false);

  useEffect(() => {
    if (mode === "edit" && alumno) {
      setFormData({
        nombre: alumno.nombre || "",
        sem: alumno.sem || "1A",
        carrera: alumno.carrera || "ISC",
        email: alumno.email || "",
        telefono: alumno.telefono || "",
        fechaNacimiento: alumno.fechaNacimiento || "",
        direccion: alumno.direccion || "",
        numeroControl: alumno.numeroControl || "",
        fotoPerfil: alumno.fotoPerfil || "",
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [visible, mode, alumno]);

  const handleImageSelected = (uri: string): void => {
    setFormData((prev) => ({
      ...prev,
      fotoPerfil: uri,
    }));
  };

  const handleImageRemoved = (): void => {
    setFormData((prev) => ({
      ...prev,
      fotoPerfil: "",
    }));
  };

  const updateField = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.telefono)) {
      newErrors.telefono = "El formato del teléfono no es válido";
    }

    if (mode === "create" && !formData.numeroControl.trim()) {
      newErrors.numeroControl = "El número de control es requerido";
    } else if (
      formData.numeroControl &&
      !/^\d{8}$/.test(formData.numeroControl)
    ) {
      newErrors.numeroControl = "El número de control debe tener 8 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      Alert.alert("Error", "Por favor, corrige los errores en el formulario.");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const submitData: Partial<Alumno> = {
        nombre: formData.nombre.trim(),
        sem: formData.sem,
        carrera: formData.carrera as any,
        email: formData.email.trim().toLowerCase(),
        telefono: formData.telefono.trim(),
        fotoPerfil: formData.fotoPerfil,
      };

      if (formData.direccion.trim()) {
        submitData.direccion = formData.direccion.trim();
      }
      if (formData.fechaNacimiento.trim()) {
        submitData.fechaNacimiento = formData.fechaNacimiento.trim();
      }
      if (formData.numeroControl.trim()) {
        submitData.numeroControl = formData.numeroControl.trim();
      }

      if (mode === "edit" && alumno) {
        submitData.id = alumno.id;
      }

      onSubmit(submitData);
      handleClose();
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al guardar el alumno.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (): void => {
    if (!isSubmitting) {
      setFormData(initialFormData);
      setErrors({});
      onClose();
    }
  };

  const formatPhoneNumber = (text: string): string => {
    const cleaned = text.replace(/[^\d+]/g, "").replace(/\+(?!^)/g, "");
    if (cleaned.startsWith("+52")) {
      const numbers = cleaned.substring(3);
      if (numbers.length <= 3) return `+52 ${numbers}`;
      if (numbers.length <= 6)
        return `+52 ${numbers.substring(0, 3)} ${numbers.substring(3)}`;
      return `+52 ${numbers.substring(0, 3)} ${numbers.substring(
        3,
        6
      )} ${numbers.substring(6, 10)}`;
    }
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6)
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3)}`;
    if (cleaned.length <= 10)
      return `${cleaned.substring(0, 3)} ${cleaned.substring(
        3,
        6
      )} ${cleaned.substring(6)}`;
    return cleaned.substring(0, 15);
  };

  const renderTextInput = (
    field: keyof FormData,
    label: string,
    placeholder: string,
    options?: {
      keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
      autoCapitalize?: "none" | "sentences" | "words" | "characters";
      multiline?: boolean;
      maxLength?: number;
    }
  ): JSX.Element => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label}
        {(field === "nombre" ||
          field === "email" ||
          field === "telefono" ||
          (field === "numeroControl" && mode === "create")) && (
          <Text style={styles.required}> *</Text>
        )}
      </Text>
      <TextInput
        style={[
          styles.input,
          errors[field] && styles.inputError,
          options?.multiline && styles.inputMultiline,
        ]}
        value={formData[field]}
        onChangeText={(text) => {
          if (field === "telefono") {
            updateField(field, formatPhoneNumber(text));
          } else {
            updateField(field, text);
          }
        }}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        editable={!isSubmitting}
        maxLength={
          options?.maxLength || (field === "numeroControl" ? 8 : undefined)
        }
        {...options}
      />
      {errors[field] && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={16} color={COLORS.error} />
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      )}
    </View>
  );

  const renderCarreraSelector = (): JSX.Element => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        Carrera <Text style={styles.required}>*</Text>
      </Text>
      <TouchableOpacity
        style={[styles.input, styles.selectorButton]}
        onPress={() => setShowCarreraSelector(true)}
        disabled={isSubmitting}
      >
        <Text style={styles.selectorText}>
          {carreras.find((c) => c.value === formData.carrera)?.label ||
            "Seleccionar carrera"}
        </Text>
        <MaterialIcons
          name="arrow-drop-down"
          size={24}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>
      <Modal
        visible={showCarreraSelector}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCarreraSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.selectorModal}>
            <Text style={styles.selectorTitle}>Seleccionar Carrera</Text>
            {carreras.map((carrera) => (
              <TouchableOpacity
                key={carrera.value}
                style={styles.selectorOption}
                onPress={() => {
                  updateField("carrera", carrera.value);
                  setShowCarreraSelector(false);
                }}
              >
                <Text style={styles.selectorOptionText}>{carrera.label}</Text>
                {formData.carrera === carrera.value && (
                  <MaterialIcons
                    name="check"
                    size={24}
                    color={COLORS.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.selectorCancel}
              onPress={() => setShowCarreraSelector(false)}
            >
              <Text style={styles.selectorCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  const renderSemestreSelector = (): JSX.Element => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        Semestre <Text style={styles.required}>*</Text>
      </Text>
      <TouchableOpacity
        style={[styles.input, styles.selectorButton]}
        onPress={() => setShowSemestreSelector(true)}
        disabled={isSubmitting}
      >
        <Text style={styles.selectorText}>{formData.sem}</Text>
        <MaterialIcons
          name="arrow-drop-down"
          size={24}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>
      <Modal
        visible={showSemestreSelector}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSemestreSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.selectorModal}>
            <Text style={styles.selectorTitle}>Seleccionar Semestre</Text>
            <ScrollView style={styles.selectorScroll}>
              {semestres.map((sem) => (
                <TouchableOpacity
                  key={sem}
                  style={styles.selectorOption}
                  onPress={() => {
                    updateField("sem", sem);
                    setShowSemestreSelector(false);
                  }}
                >
                  <Text style={styles.selectorOptionText}>{sem}</Text>
                  {formData.sem === sem && (
                    <MaterialIcons
                      name="check"
                      size={24}
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.selectorCancel}
              onPress={() => setShowSemestreSelector(false)}
            >
              <Text style={styles.selectorCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            disabled={isSubmitting}
            style={styles.headerButton}
          >
            <MaterialIcons
              name="close"
              size={24}
              color={isSubmitting ? COLORS.textSecondary : COLORS.text}
            />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {mode === "create" ? "Nuevo Alumno" : "Editar Alumno"}
            </Text>
            {mode === "edit" && alumno && (
              <Text style={styles.headerSubtitle}>{alumno.nombre}</Text>
            )}
          </View>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={[
              styles.saveButton,
              isSubmitting && styles.saveButtonDisabled,
            ]}
          >
            <MaterialIcons
              name={isSubmitting ? "hourglass-empty" : "save"}
              size={20}
              color={isSubmitting ? COLORS.background : COLORS.surface}
            />
            <Text
              style={[
                styles.saveButtonText,
                isSubmitting && styles.saveButtonTextDisabled,
              ]}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.form}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContent}>
            {/* SECCIÓN: Foto de Perfil */}
            <View style={styles.photoSection}>
              <Text style={styles.sectionTitle}>📷 Foto de Perfil</Text>
              <ProfileImagePicker
                currentImage={formData.fotoPerfil}
                onImageSelected={handleImageSelected}
                onImageRemoved={handleImageRemoved}
                size={120}
                shape="circle"
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📝 Información Personal</Text>
              {renderTextInput(
                "nombre",
                "Nombre completo",
                "Ej: Juan Pérez García",
                {
                  autoCapitalize: "words",
                  maxLength: 100,
                }
              )}
              {renderTextInput(
                "email",
                "Correo electrónico",
                "estudiante@escuela.edu.mx",
                {
                  keyboardType: "email-address",
                  autoCapitalize: "none",
                  maxLength: 100,
                }
              )}
              {renderTextInput("telefono", "Teléfono", "+52 443 123 4567", {
                keyboardType: "phone-pad",
                maxLength: 20,
              })}
              {renderTextInput(
                "fechaNacimiento",
                "Fecha de Nacimiento",
                "DD/MM/YYYY",
                {
                  maxLength: 10,
                }
              )}
              {renderTextInput(
                "direccion",
                "Dirección",
                "Calle, Colonia, Ciudad",
                {
                  multiline: true,
                  autoCapitalize: "words",
                  maxLength: 200,
                }
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎓 Información Académica</Text>
              {renderCarreraSelector()}
              {renderSemestreSelector()}
              {mode === "create" &&
                renderTextInput(
                  "numeroControl",
                  "Número de Control",
                  "Ej: 20210001",
                  { keyboardType: "numeric", maxLength: 8 }
                )}
            </View>

            <View style={styles.infoSection}>
              <MaterialIcons
                name="info-outline"
                size={20}
                color={COLORS.primary}
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Información Importante</Text>
                <Text style={styles.infoText}>
                  {mode === "create"
                    ? "• Los campos marcados con (*) son obligatorios\n• El número de control debe ser único\n• Verifica que el email sea correcto\n• La foto de perfil es opcional"
                    : "• Los campos marcados con (*) son obligatorios\n• Puedes modificar la información del estudiante\n• Los cambios se guardarán inmediatamente\n• Puedes actualizar la foto de perfil"}
                </Text>
              </View>
            </View>

            <View style={{ height: 50 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  saveButtonText: {
    color: COLORS.surface,
    fontWeight: "600",
    fontSize: FONT_SIZES.medium,
  },
  saveButtonTextDisabled: {
    color: COLORS.background,
  },
  form: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    elevation: 1,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary + "20",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  required: {
    color: COLORS.error,
    fontSize: FONT_SIZES.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: FONT_SIZES.medium,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    elevation: 1,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  selectorButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  selectorModal: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxHeight: "70%",
  },
  selectorTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
    textAlign: "center",
  },
  selectorScroll: {
    maxHeight: 300,
  },
  selectorOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  selectorOptionText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    flex: 1,
  },
  selectorCancel: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  selectorCancelText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.small,
    marginLeft: 4,
    flex: 1,
  },
  infoSection: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 1,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 6,
  },
  infoText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default AlumnoFormModal;
