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
import { Picker } from "@react-native-picker/picker";
import { Profesor, COLORS, FONT_SIZES, Carrera } from "../../types";

/**
 * Props para el modal de formulario de profesor
 */
interface ProfesorFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (profesor: Partial<Profesor>) => void;
  profesor?: Profesor | null; // Para edición
  mode: "create" | "edit";
}

/**
 * Datos del formulario
 */
interface FormData {
  nombre: string;
  carrera: Carrera;
  email: string;
  telefono: string;
  especialidad: string;
  gradoAcademico: string;
  numeroEmpleado: string;
  departamento: string;
  fechaIngreso: string;
  estatus: string;
}

/**
 * Modal para crear o editar un profesor
 */
const ProfesorFormModal: React.FC<ProfesorFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  profesor,
  mode,
}) => {
  // Estado inicial del formulario
  const initialFormData: FormData = {
    nombre: "",
    carrera: "ISC",
    email: "",
    telefono: "",
    especialidad: "",
    gradoAcademico: "Licenciatura",
    numeroEmpleado: "",
    departamento: "",
    fechaIngreso: "",
    estatus: "Activo",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Opciones para los select
  const carreras: Array<{ value: Carrera; label: string }> = [
    { value: "ISC", label: "Ingeniería en Sistemas Computacionales" },
    { value: "IGE", label: "Ingeniería en Gestión Empresarial" },
    { value: "IIA", label: "Ingeniería en Industrias Alimentarias" },
    { value: "ITICS", label: "Ingeniería en TIC's" },
  ];

  const gradosAcademicos = [
    { value: "Licenciatura", label: "Licenciatura" },
    { value: "Maestría", label: "Maestría" },
    { value: "Doctorado", label: "Doctorado" },
  ];

  const estatusOptions = [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
    { value: "Licencia", label: "En Licencia" },
  ];

  const departamentos = [
    { value: "Sistemas", label: "Departamento de Sistemas" },
    { value: "Gestión", label: "Departamento de Gestión" },
    { value: "Industrias", label: "Departamento de Industrias Alimentarias" },
    { value: "TICs", label: "Departamento de TIC's" },
    { value: "Ciencias Básicas", label: "Ciencias Básicas" },
    { value: "Desarrollo Académico", label: "Desarrollo Académico" },
  ];

  /**
   * Efecto para llenar el formulario cuando se edita
   */
  useEffect(() => {
    if (mode === "edit" && profesor) {
      setFormData({
        nombre: profesor.nombre || "",
        carrera: profesor.carrera || "ISC",
        email: profesor.email || "",
        telefono: profesor.telefono || "",
        especialidad: profesor.especialidad || "",
        gradoAcademico: profesor.gradoAcademico || "Licenciatura",
        numeroEmpleado: profesor.numeroEmpleado || "",
        departamento: profesor.departamento || "",
        fechaIngreso: profesor.fechaIngreso || "",
        estatus: profesor.estatus || "Activo",
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [visible, mode, profesor]);

  /**
   * Actualiza un campo del formulario
   */
  const updateField = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  /**
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Validaciones requeridas
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = "El nombre no puede exceder 100 caracteres";
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
    } else if (formData.telefono.replace(/\D/g, "").length < 10) {
      newErrors.telefono = "El teléfono debe tener al menos 10 dígitos";
    }

    if (!formData.especialidad.trim()) {
      newErrors.especialidad = "La especialidad es requerida";
    } else if (formData.especialidad.length < 3) {
      newErrors.especialidad = "La especialidad debe tener al menos 3 caracteres";
    }

    if (mode === "create" && !formData.numeroEmpleado.trim()) {
      newErrors.numeroEmpleado = "El número de empleado es requerido";
    } else if (
      formData.numeroEmpleado &&
      !/^\d{4,8}$/.test(formData.numeroEmpleado)
    ) {
      newErrors.numeroEmpleado = "El número de empleado debe tener entre 4 y 8 dígitos";
    }

    // Validar fecha de ingreso si se proporciona
    if (formData.fechaIngreso) {
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(formData.fechaIngreso)) {
        newErrors.fechaIngreso = "Use el formato DD/MM/YYYY";
      } else {
        const [day, month, year] = formData.fechaIngreso
          .split("/")
          .map(Number);
        const date = new Date(year, month - 1, day);
        const now = new Date();

        if (
          date.getDate() !== day ||
          date.getMonth() !== month - 1 ||
          date.getFullYear() !== year
        ) {
          newErrors.fechaIngreso = "Fecha no válida";
        } else if (date >= now) {
          newErrors.fechaIngreso = "La fecha debe ser anterior a hoy";
        } else if (year < 1970) {
          newErrors.fechaIngreso = "Año no válido";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      Alert.alert(
        "Error de Validación",
        "Por favor, corrige los errores en el formulario antes de continuar."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular delay de envío
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Preparar datos para envío
      const submitData: Partial<Profesor> = {
        nombre: formData.nombre.trim(),
        carrera: formData.carrera,
        email: formData.email.trim().toLowerCase(),
        telefono: formData.telefono.trim(),
        especialidad: formData.especialidad.trim(),
        gradoAcademico: formData.gradoAcademico as any,
        estatus: formData.estatus as any,
      };

      // Campos opcionales
      if (formData.numeroEmpleado.trim()) {
        submitData.numeroEmpleado = formData.numeroEmpleado.trim();
      }
      if (formData.departamento.trim()) {
        submitData.departamento = formData.departamento.trim();
      }
      if (formData.fechaIngreso.trim()) {
        submitData.fechaIngreso = formData.fechaIngreso.trim();
      }

      // Si estamos editando, incluir el ID
      if (mode === "edit" && profesor) {
        submitData.id = profesor.id;
      }

      onSubmit(submitData);
      handleClose();
    } catch (error) {
      Alert.alert(
        "Error",
        "Ocurrió un error al guardar el profesor. Por favor, intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Cierra el modal y limpia el formulario
   */
  const handleClose = (): void => {
    if (!isSubmitting) {
      setFormData(initialFormData);
      setErrors({});
      onClose();
    }
  };

  /**
   * Confirma el cierre del modal si hay cambios
   */
  const confirmClose = (): void => {
    const hasChanges =
      mode === "edit"
        ? profesor &&
          Object.keys(formData).some(
            (key) =>
              formData[key as keyof FormData] !==
              (profesor[key as keyof Profesor] || "")
          )
        : Object.values(formData).some(
            (value) => 
              value.trim() !== "" && 
              value !== "ISC" && 
              value !== "Licenciatura" && 
              value !== "Activo"
          );

    if (hasChanges && !isSubmitting) {
      Alert.alert(
        "Confirmar Cierre",
        "¿Estás seguro de que deseas cerrar? Se perderán los cambios no guardados.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Cerrar", onPress: handleClose, style: "destructive" },
        ]
      );
    } else {
      handleClose();
    }
  };

  /**
   * Formatea el número de teléfono mientras se escribe
   */
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

  /**
   * Renderiza un campo de texto
   */
  const renderTextInput = (
    field: keyof FormData,
    label: string,
    placeholder: string,
    options?: {
      keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
      autoCapitalize?: "none" | "sentences" | "words" | "characters";
      multiline?: boolean;
      maxLength?: number;
      required?: boolean;
    }
  ): JSX.Element => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label}
        {options?.required && <Text style={styles.required}> *</Text>}
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
        maxLength={options?.maxLength}
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

  /**
   * Renderiza un picker
   */
  const renderPicker = (
    field: keyof FormData,
    label: string,
    options: Array<{ value: string; label: string }>,
    required: boolean = false
  ): JSX.Element => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View
        style={[styles.pickerContainer, errors[field] && styles.inputError]}
      >
        <Picker
          selectedValue={formData[field]}
          onValueChange={(value) => updateField(field, value)}
          style={styles.picker}
          enabled={!isSubmitting}
        >
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              color={COLORS.text}
            />
          ))}
        </Picker>
      </View>
      {errors[field] && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={16} color={COLORS.error} />
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={confirmClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={confirmClose}
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
              {mode === "create" ? "Nuevo Profesor" : "Editar Profesor"}
            </Text>
            {mode === "edit" && profesor && (
              <Text style={styles.headerSubtitle}>{profesor.nombre}</Text>
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

        {/* Formulario */}
        <ScrollView
          style={styles.form}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.formContent}
        >
          {/* Sección: Información Personal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Información Personal</Text>

            {renderTextInput(
              "nombre",
              "Nombre completo",
              "Ej: Dr. Antonio Suárez Zinzun",
              {
                autoCapitalize: "words",
                maxLength: 100,
                required: true,
              }
            )}

            {renderTextInput(
              "email",
              "Correo electrónico",
              "profesor@escuela.edu.mx",
              {
                keyboardType: "email-address",
                autoCapitalize: "none",
                maxLength: 100,
                required: true,
              }
            )}

            {renderTextInput("telefono", "Teléfono", "+52 443 123 4567", {
              keyboardType: "phone-pad",
              maxLength: 20,
              required: true,
            })}

            {renderTextInput(
              "fechaIngreso",
              "Fecha de Ingreso",
              "DD/MM/YYYY",
              {
                maxLength: 10,
              }
            )}
          </View>

          {/* Sección: Información Académica */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎓 Información Académica</Text>

            {renderPicker("carrera", "Carrera", carreras, true)}

            {renderTextInput(
              "especialidad",
              "Especialidad",
              "Ej: Inteligencia Artificial",
              {
                autoCapitalize: "words",
                maxLength: 100,
                required: true,
              }
            )}

            {renderPicker("gradoAcademico", "Grado Académico", gradosAcademicos, true)}
          </View>

          {/* Sección: Información Laboral */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💼 Información Laboral</Text>

            {mode === "create" &&
              renderTextInput(
                "numeroEmpleado",
                "Número de Empleado",
                "Ej: 12345",
                { 
                  keyboardType: "numeric", 
                  maxLength: 8,
                  required: true 
                }
              )}

            {renderPicker("departamento", "Departamento", departamentos)}

            {renderPicker("estatus", "Estatus", estatusOptions, true)}
          </View>

          {/* Información adicional */}
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
                  ? "• Los campos marcados con (*) son obligatorios\n• El número de empleado debe ser único\n• Verifica que el email sea correcto\n• La especialidad debe ser específica del área"
                  : "• Los campos marcados con (*) son obligatorios\n• Puedes modificar la información del profesor\n• Los cambios se guardarán inmediatamente\n• Verifica los datos antes de guardar"}
              </Text>
            </View>
          </View>

          {/* Espacio adicional para el teclado */}
          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    elevation: 1,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  picker: {
    height: 50,
    color: COLORS.text,
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

export default ProfesorFormModal;