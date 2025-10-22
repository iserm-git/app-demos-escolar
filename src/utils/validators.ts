/**
 * Utilidades de validación para formularios
 * Contiene funciones para validar diferentes tipos de datos en la aplicación escolar
 */

import {
  ValidationResult,
  ValidationRule,
  ValidationRules,
  VALIDATIONS,
} from "../../types";

// ==========================================
// INTERFACES Y TIPOS PARA VALIDACIONES
// ==========================================

/**
 * Resultado de validación de un campo específico
 */
export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Opciones para validaciones personalizadas
 */
export interface ValidationOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
  customMessage?: string;
}

// ==========================================
// VALIDADORES BÁSICOS
// ==========================================

/**
 * Valida que un campo no esté vacío
 */
export const validateRequired = (
  value: string,
  fieldName: string = "Campo"
): FieldValidationResult => {
  const trimmedValue = value?.toString().trim() || "";

  if (!trimmedValue) {
    return {
      isValid: false,
      error: `${fieldName} es requerido`,
    };
  }

  return { isValid: true };
};

/**
 * Valida la longitud mínima de un campo
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string = "Campo"
): FieldValidationResult => {
  const trimmedValue = value?.toString().trim() || "";

  if (trimmedValue.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} debe tener al menos ${minLength} caracteres`,
    };
  }

  return { isValid: true };
};

/**
 * Valida la longitud máxima de un campo
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string = "Campo"
): FieldValidationResult => {
  const trimmedValue = value?.toString().trim() || "";

  if (trimmedValue.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} no puede exceder ${maxLength} caracteres`,
    };
  }

  return { isValid: true };
};

/**
 * Valida que un valor esté dentro de un rango numérico
 */
export const validateRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string = "Valor"
): FieldValidationResult => {
  if (value < min || value > max) {
    return {
      isValid: false,
      error: `${fieldName} debe estar entre ${min} y ${max}`,
    };
  }

  return { isValid: true };
};

/**
 * Valida usando una expresión regular
 */
export const validatePattern = (
  value: string,
  pattern: RegExp,
  errorMessage: string = "Formato no válido"
): FieldValidationResult => {
  const trimmedValue = value?.toString().trim() || "";

  if (!pattern.test(trimmedValue)) {
    return {
      isValid: false,
      error: errorMessage,
    };
  }

  return { isValid: true };
};

// ==========================================
// VALIDADORES ESPECÍFICOS
// ==========================================

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): FieldValidationResult => {
  const trimmedEmail = email?.toString().trim() || "";

  // Verificar si está vacío
  const requiredCheck = validateRequired(trimmedEmail, "Email");
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }

  // Verificar formato
  if (!VALIDATIONS.email.test(trimmedEmail)) {
    return {
      isValid: false,
      error: "El formato del email no es válido",
    };
  }

  // Verificar longitud razonable
  if (trimmedEmail.length > 100) {
    return {
      isValid: false,
      error: "El email no puede exceder 100 caracteres",
    };
  }

  return { isValid: true };
};

/**
 * Valida formato de teléfono mexicano
 */
export const validatePhone = (phone: string): FieldValidationResult => {
  const trimmedPhone = phone?.toString().trim() || "";

  // Verificar si está vacío
  const requiredCheck = validateRequired(trimmedPhone, "Teléfono");
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }

  // Remover espacios y caracteres especiales para contar dígitos
  const digitsOnly = trimmedPhone.replace(/\D/g, "");

  // Verificar formato básico
  if (!VALIDATIONS.phone.test(trimmedPhone)) {
    return {
      isValid: false,
      error: "El formato del teléfono no es válido",
    };
  }

  // Verificar longitud de dígitos
  if (digitsOnly.length < 10) {
    return {
      isValid: false,
      error: "El teléfono debe tener al menos 10 dígitos",
    };
  }

  if (digitsOnly.length > 15) {
    return {
      isValid: false,
      error: "El teléfono no puede tener más de 15 dígitos",
    };
  }

  return { isValid: true };
};

/**
 * Valida número de control escolar
 */
export const validateControlNumber = (
  controlNumber: string
): FieldValidationResult => {
  const trimmedNumber = controlNumber?.toString().trim() || "";

  // Verificar si está vacío
  const requiredCheck = validateRequired(trimmedNumber, "Número de control");
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }

  // Verificar que sean exactamente 8 dígitos
  if (!VALIDATIONS.controlNumber.test(trimmedNumber)) {
    return {
      isValid: false,
      error: "El número de control debe tener exactamente 8 dígitos",
    };
  }

  // Verificar que el año sea válido (primeros 4 dígitos)
  const year = parseInt(trimmedNumber.substring(0, 4));
  const currentYear = new Date().getFullYear();

  if (year < 2000 || year > currentYear + 1) {
    return {
      isValid: false,
      error: "El año en el número de control no es válido",
    };
  }

  return { isValid: true };
};

/**
 * Valida nombre completo
 */
export const validateName = (name: string): FieldValidationResult => {
  const trimmedName = name?.toString().trim() || "";

  // Verificar si está vacío
  const requiredCheck = validateRequired(trimmedName, "Nombre");
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }

  // Verificar longitud mínima
  const minLengthCheck = validateMinLength(trimmedName, 3, "Nombre");
  if (!minLengthCheck.isValid) {
    return minLengthCheck;
  }

  // Verificar longitud máxima
  const maxLengthCheck = validateMaxLength(trimmedName, 100, "Nombre");
  if (!maxLengthCheck.isValid) {
    return maxLengthCheck;
  }

  // Verificar que contenga solo letras, espacios y acentos
  if (!VALIDATIONS.lettersOnly.test(trimmedName)) {
    return {
      isValid: false,
      error: "El nombre solo puede contener letras y espacios",
    };
  }

  // Verificar que tenga al menos un nombre y un apellido
  const words = trimmedName.split(" ").filter((word) => word.length > 0);
  if (words.length < 2) {
    return {
      isValid: false,
      error: "Debe incluir al menos nombre y apellido",
    };
  }

  return { isValid: true };
};

/**
 * Valida fecha de nacimiento
 */
export const validateBirthDate = (birthDate: string): FieldValidationResult => {
  const trimmedDate = birthDate?.toString().trim() || "";

  // Si está vacío, es válido (campo opcional)
  if (!trimmedDate) {
    return { isValid: true };
  }

  // Verificar formato DD/MM/YYYY
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(trimmedDate)) {
    return {
      isValid: false,
      error: "Use el formato DD/MM/YYYY",
    };
  }

  // Verificar si es una fecha válida
  const [day, month, year] = trimmedDate.split("/").map(Number);
  const date = new Date(year, month - 1, day);

  // Verificar que la fecha sea válida
  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    return {
      isValid: false,
      error: "Fecha no válida",
    };
  }

  // Verificar que no sea una fecha futura
  const now = new Date();
  if (date >= now) {
    return {
      isValid: false,
      error: "La fecha debe ser anterior a hoy",
    };
  }

  // Verificar rango de años razonable
  if (year < 1950) {
    return {
      isValid: false,
      error: "Año no válido",
    };
  }

  // Verificar que no sea demasiado joven (al menos 15 años)
  const age = now.getFullYear() - year;
  if (age < 15) {
    return {
      isValid: false,
      error: "Debe tener al menos 15 años",
    };
  }

  return { isValid: true };
};

/**
 * Valida dirección
 */
export const validateAddress = (address: string): FieldValidationResult => {
  const trimmedAddress = address?.toString().trim() || "";

  // Si está vacío, es válido (campo opcional)
  if (!trimmedAddress) {
    return { isValid: true };
  }

  // Verificar longitud máxima
  const maxLengthCheck = validateMaxLength(trimmedAddress, 200, "Dirección");
  if (!maxLengthCheck.isValid) {
    return maxLengthCheck;
  }

  // Verificar longitud mínima si se proporciona
  const minLengthCheck = validateMinLength(trimmedAddress, 10, "Dirección");
  if (!minLengthCheck.isValid) {
    return minLengthCheck;
  }

  return { isValid: true };
};

// ==========================================
// VALIDADOR UNIVERSAL
// ==========================================

/**
 * Valida un campo usando opciones personalizadas
 */
export const validateField = (
  value: any,
  options: ValidationOptions,
  fieldName: string = "Campo"
): FieldValidationResult => {
  const stringValue = value?.toString().trim() || "";

  // Verificar requerido
  if (options.required) {
    const requiredCheck = validateRequired(stringValue, fieldName);
    if (!requiredCheck.isValid) {
      return requiredCheck;
    }
  }

  // Si está vacío y no es requerido, es válido
  if (!stringValue && !options.required) {
    return { isValid: true };
  }

  // Verificar longitud mínima
  if (options.minLength !== undefined) {
    const minLengthCheck = validateMinLength(
      stringValue,
      options.minLength,
      fieldName
    );
    if (!minLengthCheck.isValid) {
      return minLengthCheck;
    }
  }

  // Verificar longitud máxima
  if (options.maxLength !== undefined) {
    const maxLengthCheck = validateMaxLength(
      stringValue,
      options.maxLength,
      fieldName
    );
    if (!maxLengthCheck.isValid) {
      return maxLengthCheck;
    }
  }

  // Verificar rango numérico
  if (options.min !== undefined || options.max !== undefined) {
    const numValue = parseFloat(stringValue);
    if (isNaN(numValue)) {
      return {
        isValid: false,
        error: `${fieldName} debe ser un número válido`,
      };
    }

    if (options.min !== undefined && options.max !== undefined) {
      const rangeCheck = validateRange(
        numValue,
        options.min,
        options.max,
        fieldName
      );
      if (!rangeCheck.isValid) {
        return rangeCheck;
      }
    }
  }

  // Verificar patrón
  if (options.pattern) {
    const patternCheck = validatePattern(
      stringValue,
      options.pattern,
      options.customMessage || "Formato no válido"
    );
    if (!patternCheck.isValid) {
      return patternCheck;
    }
  }

  // Verificar validador personalizado
  if (options.customValidator) {
    if (!options.customValidator(value)) {
      return {
        isValid: false,
        error: options.customMessage || "Valor no válido",
      };
    }
  }

  return { isValid: true };
};

// ==========================================
// VALIDADOR DE FORMULARIOS COMPLETOS
// ==========================================

/**
 * Valida un formulario completo usando reglas de validación
 */
export const validateForm = (
  data: Record<string, any>,
  rules: ValidationRules
): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  // Validar cada campo según sus reglas
  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const fieldValue = data[fieldName];

    // Aplicar cada regla del campo
    for (const rule of fieldRules) {
      const options: ValidationOptions = {
        required: rule.required,
        minLength: rule.minLength,
        maxLength: rule.maxLength,
        pattern: rule.pattern,
        customValidator: rule.custom,
        customMessage: rule.message,
      };

      const fieldResult = validateField(fieldValue, options, fieldName);

      if (!fieldResult.isValid) {
        errors[fieldName] = fieldResult.error || rule.message;
        isValid = false;
        break; // Solo mostrar el primer error por campo
      }
    }
  }

  return {
    isValid,
    errors,
  };
};

// ==========================================
// VALIDADORES ESPECÍFICOS PARA ALUMNOS
// ==========================================

/**
 * Valida datos completos de un alumno
 */
export const validateAlumnoData = (alumnoData: any): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  // Validar nombre
  const nameResult = validateName(alumnoData.nombre);
  if (!nameResult.isValid) {
    errors.nombre = nameResult.error!;
    isValid = false;
  }

  // Validar email
  const emailResult = validateEmail(alumnoData.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error!;
    isValid = false;
  }

  // Validar teléfono
  const phoneResult = validatePhone(alumnoData.telefono);
  if (!phoneResult.isValid) {
    errors.telefono = phoneResult.error!;
    isValid = false;
  }

  // Validar número de control (solo para creación)
  if (alumnoData.numeroControl) {
    const controlResult = validateControlNumber(alumnoData.numeroControl);
    if (!controlResult.isValid) {
      errors.numeroControl = controlResult.error!;
      isValid = false;
    }
  }

  // Validar fecha de nacimiento (opcional)
  if (alumnoData.fechaNacimiento) {
    const birthDateResult = validateBirthDate(alumnoData.fechaNacimiento);
    if (!birthDateResult.isValid) {
      errors.fechaNacimiento = birthDateResult.error!;
      isValid = false;
    }
  }

  // Validar dirección (opcional)
  if (alumnoData.direccion) {
    const addressResult = validateAddress(alumnoData.direccion);
    if (!addressResult.isValid) {
      errors.direccion = addressResult.error!;
      isValid = false;
    }
  }

  // Validar carrera
  const carrerasValidas = ["ISC", "IGE", "IIA", "ITICS"];
  if (!carrerasValidas.includes(alumnoData.carrera)) {
    errors.carrera = "Carrera no válida";
    isValid = false;
  }

  // Validar semestre
  const semestresValidos = [
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
  if (!semestresValidos.includes(alumnoData.sem)) {
    errors.sem = "Semestre no válido";
    isValid = false;
  }

  return {
    isValid,
    errors,
  };
};

// ==========================================
// UTILIDADES ADICIONALES
// ==========================================

/**
 * Limpia y formatea un número de teléfono
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remover caracteres no numéricos excepto + al inicio
  const cleaned = phone.replace(/[^\d+]/g, "").replace(/\+(?!^)/g, "");

  // Si empieza con +52, formatear como mexicano
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

  // Formato básico
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6)
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3)}`;
  if (cleaned.length <= 10)
    return `${cleaned.substring(0, 3)} ${cleaned.substring(
      3,
      6
    )} ${cleaned.substring(6)}`;

  return cleaned.substring(0, 15); // Máximo 15 caracteres
};

/**
 * Verifica si una fecha es válida
 */
export const isValidDate = (dateString: string): boolean => {
  const result = validateBirthDate(dateString);
  return result.isValid;
};

/**
 * Calcula la edad a partir de una fecha de nacimiento
 */
export const calculateAge = (birthDate: string): number => {
  if (!isValidDate(birthDate)) return 0;

  const [day, month, year] = birthDate.split("/").map(Number);
  const birth = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Genera un número de control sugerido
 */
export const generateControlNumber = (year?: number): string => {
  const currentYear = year || new Date().getFullYear();
  const randomNumber = Math.floor(Math.random() * 9999) + 1;
  return `${currentYear}${randomNumber.toString().padStart(4, "0")}`;
};

/**
 * Valida que un email sea único en una lista
 */
export const validateUniqueEmail = (
  email: string,
  existingEmails: string[],
  currentId?: number | string
): FieldValidationResult => {
  const trimmedEmail = email?.toString().trim().toLowerCase() || "";

  const emailResult = validateEmail(email);
  if (!emailResult.isValid) {
    return emailResult;
  }

  // Verificar si el email ya existe (excluyendo el registro actual)
  const isDuplicate = existingEmails.some((existingEmail, index) => {
    if (currentId !== undefined && index === currentId) return false;
    return existingEmail.toLowerCase() === trimmedEmail;
  });

  if (isDuplicate) {
    return {
      isValid: false,
      error: "Este email ya está registrado",
    };
  }

  return { isValid: true };
};

/**
 * Valida que un número de control sea único
 */
export const validateUniqueControlNumber = (
  controlNumber: string,
  existingNumbers: string[],
  currentId?: number | string
): FieldValidationResult => {
  const trimmedNumber = controlNumber?.toString().trim() || "";

  const controlResult = validateControlNumber(controlNumber);
  if (!controlResult.isValid) {
    return controlResult;
  }

  // Verificar si el número ya existe (excluyendo el registro actual)
  const isDuplicate = existingNumbers.some((existingNumber, index) => {
    if (currentId !== undefined && index === currentId) return false;
    return existingNumber === trimmedNumber;
  });

  if (isDuplicate) {
    return {
      isValid: false,
      error: "Este número de control ya está registrado",
    };
  }

  return { isValid: true };
};

// ==========================================
// EXPORTACIONES
// ==========================================

export default {
  // Validadores básicos
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateRange,
  validatePattern,

  // Validadores específicos
  validateEmail,
  validatePhone,
  validateControlNumber,
  validateName,
  validateBirthDate,
  validateAddress,

  // Validadores universales
  validateField,
  validateForm,
  validateAlumnoData,

  // Validadores únicos
  validateUniqueEmail,
  validateUniqueControlNumber,

  // Utilidades
  formatPhoneNumber,
  isValidDate,
  calculateAge,
  generateControlNumber,
};
