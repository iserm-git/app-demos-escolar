/**
 * Utilidades y funciones de ayuda para la aplicación escolar
 * Contiene funciones reutilizables para formateo, transformaciones y operaciones comunes
 */

import {
  Alumno,
  Profesor,
  Materia,
  Grupo,
  Carrera,
  COLORS,
  APP_CONFIG,
  PaginationState,
} from "../../types";

// ==========================================
// UTILIDADES DE FORMATEO
// ==========================================

/**
 * Capitaliza la primera letra de cada palabra
 */
export const capitalizeWords = (text: string): string => {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Capitaliza solo la primera letra de un texto
 */
export const capitalizeFirst = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formatea un nombre completo (capitaliza cada palabra y maneja acentos)
 */
export const formatFullName = (name: string): string => {
  if (!name) return "";

  // Remover espacios extra y capitalizar
  const cleaned = name
    .trim()
    .replace(/\s+/g, " ") // Múltiples espacios a uno solo
    .toLowerCase();

  return cleaned
    .split(" ")
    .map((word) => {
      if (word.length <= 2 && ["de", "la", "del", "y", "e"].includes(word)) {
        return word; // Mantener preposiciones en minúscula
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

/**
 * Formatea un email a minúsculas y sin espacios
 */
export const formatEmail = (email: string): string => {
  if (!email) return "";
  return email.trim().toLowerCase();
};

/**
 * Formatea un número de teléfono mexicano
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "";

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

  // Formato nacional
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
 * Formatea una fecha DD/MM/YYYY
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return "";

  let dateObj: Date;

  if (typeof date === "string") {
    // Si viene en formato DD/MM/YYYY
    if (date.includes("/")) {
      const [day, month, year] = date.split("/");
      dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      dateObj = new Date(date);
    }
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) return "";

  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Formatea una fecha en formato legible (ej: "15 de Marzo, 2024")
 */
export const formatDateReadable = (date: string | Date): string => {
  if (!date) return "";

  let dateObj: Date;

  if (typeof date === "string") {
    if (date.includes("/")) {
      const [day, month, year] = date.split("/");
      dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      dateObj = new Date(date);
    }
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) return "";

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${day} de ${month}, ${year}`;
};

/**
 * Formatea números con separadores de miles
 */
export const formatNumber = (num: number): string => {
  if (typeof num !== "number" || isNaN(num)) return "0";
  return num.toLocaleString("es-MX");
};

/**
 * Formatea un promedio con decimales específicos
 */
export const formatGrade = (grade: number, decimals: number = 2): string => {
  if (typeof grade !== "number" || isNaN(grade)) return "0.00";
  return grade.toFixed(decimals);
};

// ==========================================
// UTILIDADES DE TRANSFORMACIÓN
// ==========================================

/**
 * Convierte un string a slug (URL amigable)
 */
export const stringToSlug = (text: string): string => {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/[áàäâ]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9-]/g, "") // Remover caracteres especiales
    .replace(/-+/g, "-") // Múltiples guiones a uno
    .replace(/^-|-$/g, ""); // Remover guiones al inicio y final
};

/**
 * Trunca un texto a una longitud específica
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

/**
 * Limpia y normaliza un string para búsquedas
 */
export const normalizeForSearch = (text: string): string => {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/\s+/g, " ");
};

// ==========================================
// UTILIDADES DE DATOS
// ==========================================

/**
 * Genera un ID único simple
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Genera un número de control escolar
 */
export const generateControlNumber = (year?: number): string => {
  const currentYear = year || new Date().getFullYear();
  const randomNumber = Math.floor(Math.random() * 9999) + 1;
  return `${currentYear}${randomNumber.toString().padStart(4, "0")}`;
};

/**
 * Obtiene las iniciales de un nombre
 */
export const getInitials = (name: string): string => {
  if (!name) return "";

  const words = name.trim().split(" ");
  const initials = words
    .slice(0, 2) // Solo primeras dos palabras
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return initials;
};

/**
 * Calcula la edad a partir de una fecha de nacimiento
 */
export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;

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
 * Obtiene el color asociado a una carrera
 */
export const getCareerColor = (carrera: Carrera): string => {
  return COLORS.carreras[carrera] || COLORS.primary;
};

/**
 * Obtiene el nombre completo de una carrera
 */
export const getCareerFullName = (carrera: Carrera): string => {
  const careers = {
    ISC: "Ingeniería en Sistemas Computacionales",
    IGE: "Ingeniería en Gestión Empresarial",
    IIA: "Ingeniería en Industrias Alimentarias",
    ITICS: "Ingeniería en TIC's",
  };

  return careers[carrera] || carrera;
};

/**
 * Obtiene el semestre numérico desde el formato "7A"
 */
export const getSemesterNumber = (sem: string): number => {
  if (!sem) return 0;
  const match = sem.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

/**
 * Obtiene la sección desde el formato "7A"
 */
export const getSemesterSection = (sem: string): string => {
  if (!sem) return "";
  const match = sem.match(/([A-Z]+)/);
  return match ? match[1] : "";
};

// ==========================================
// UTILIDADES DE ORDENAMIENTO Y FILTRADO
// ==========================================

/**
 * Ordena un array de alumnos por diferentes criterios
 */
export const sortAlumnos = (
  alumnos: Alumno[],
  sortBy: "nombre" | "carrera" | "semestre" | "email" = "nombre",
  order: "asc" | "desc" = "asc"
): Alumno[] => {
  return [...alumnos].sort((a, b) => {
    let valueA: any;
    let valueB: any;

    switch (sortBy) {
      case "nombre":
        valueA = normalizeForSearch(a.nombre);
        valueB = normalizeForSearch(b.nombre);
        break;
      case "carrera":
        valueA = a.carrera || "";
        valueB = b.carrera || "";
        break;
      case "semestre":
        valueA = getSemesterNumber(a.sem || "");
        valueB = getSemesterNumber(b.sem || "");
        break;
      case "email":
        valueA = a.email || "";
        valueB = b.email || "";
        break;
      default:
        valueA = a.nombre;
        valueB = b.nombre;
    }

    if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return order === "asc" ? -1 : 1;
    if (valueA > valueB) return order === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * Filtra alumnos por múltiples criterios
 */
export const filterAlumnos = (
  alumnos: Alumno[],
  filters: {
    search?: string;
    carrera?: string;
    semestre?: string;
    active?: boolean;
  }
): Alumno[] => {
  return alumnos.filter((alumno) => {
    // Filtro por búsqueda de texto
    if (filters.search) {
      const searchTerm = normalizeForSearch(filters.search);
      const alumnoText = normalizeForSearch(
        `${alumno.nombre} ${alumno.email} ${alumno.numeroControl}`
      );

      if (!alumnoText.includes(searchTerm)) {
        return false;
      }
    }

    // Filtro por carrera
    if (filters.carrera && filters.carrera !== "Todas") {
      if (alumno.carrera !== filters.carrera) {
        return false;
      }
    }

    // Filtro por semestre
    if (filters.semestre && filters.semestre !== "Todos") {
      if (alumno.sem !== filters.semestre) {
        return false;
      }
    }

    // Filtro por estado activo
    if (filters.active !== undefined) {
      const isActive = alumno.estatus === "Activo" || !alumno.estatus;
      if (isActive !== filters.active) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Pagina un array de resultados
 */
export const paginateArray = <T>(
  items: T[],
  page: number = 1,
  pageSize: number = APP_CONFIG.defaultPageSize
): {
  items: T[];
  pagination: PaginationState;
} => {
  const total = items.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  const totalPages = Math.ceil(total / pageSize);

  return {
    items: paginatedItems,
    pagination: {
      page,
      pageSize,
      total,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

// ==========================================
// UTILIDADES DE VALIDACIÓN DE DATOS
// ==========================================

/**
 * Verifica si un email es válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Verifica si un teléfono es válido
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  const digitsOnly = phone.replace(/\D/g, "");
  return (
    phoneRegex.test(phone) && digitsOnly.length >= 10 && digitsOnly.length <= 15
  );
};

/**
 * Verifica si una fecha está en formato DD/MM/YYYY y es válida
 */
export const isValidDate = (dateString: string): boolean => {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(dateString)) return false;

  const [day, month, year] = dateString.split("/").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getDate() === day &&
    date.getMonth() === month - 1 &&
    date.getFullYear() === year
  );
};

/**
 * Verifica si un número de control es válido
 */
export const isValidControlNumber = (controlNumber: string): boolean => {
  const controlRegex = /^\d{8}$/;
  if (!controlRegex.test(controlNumber)) return false;

  const year = parseInt(controlNumber.substring(0, 4));
  const currentYear = new Date().getFullYear();

  return year >= 2000 && year <= currentYear + 1;
};

// ==========================================
// UTILIDADES DE ESTADÍSTICAS
// ==========================================

/**
 * Calcula estadísticas básicas de un array de números
 */
export const calculateStats = (numbers: number[]) => {
  if (numbers.length === 0) {
    return {
      total: 0,
      average: 0,
      min: 0,
      max: 0,
      sum: 0,
    };
  }

  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const average = sum / numbers.length;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  return {
    total: numbers.length,
    average: Math.round(average * 100) / 100,
    min,
    max,
    sum,
  };
};

/**
 * Agrupa alumnos por carrera
 */
export const groupAlumnosByCarrera = (alumnos: Alumno[]) => {
  return alumnos.reduce((groups, alumno) => {
    const carrera = alumno.carrera || "Sin carrera";
    if (!groups[carrera]) {
      groups[carrera] = [];
    }
    groups[carrera].push(alumno);
    return groups;
  }, {} as Record<string, Alumno[]>);
};

/**
 * Agrupa alumnos por semestre
 */
export const groupAlumnosBySemestre = (alumnos: Alumno[]) => {
  return alumnos.reduce((groups, alumno) => {
    const semestre = alumno.sem || "Sin semestre";
    if (!groups[semestre]) {
      groups[semestre] = [];
    }
    groups[semestre].push(alumno);
    return groups;
  }, {} as Record<string, Alumno[]>);
};

// ==========================================
// UTILIDADES DE EXPORTACIÓN/IMPORTACIÓN
// ==========================================

/**
 * Convierte array de alumnos a CSV
 */
export const alumnosToCSV = (alumnos: Alumno[]): string => {
  if (alumnos.length === 0) return "";

  const headers = [
    "ID",
    "Nombre",
    "Semestre",
    "Carrera",
    "Email",
    "Teléfono",
    "Número de Control",
    "Fecha de Nacimiento",
    "Dirección",
  ];

  const rows = alumnos.map((alumno) => [
    alumno.id.toString(),
    `"${alumno.nombre}"`,
    `"${alumno.sem || ""}"`,
    `"${alumno.carrera || ""}"`,
    `"${alumno.email || ""}"`,
    `"${alumno.telefono || ""}"`,
    `"${alumno.numeroControl || ""}"`,
    `"${alumno.fechaNacimiento || ""}"`,
    `"${alumno.direccion || ""}"`,
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
};

/**
 * Genera nombre de archivo con timestamp
 */
export const generateFileName = (
  prefix: string,
  extension: string = "csv"
): string => {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/[:-]/g, "");
  return `${prefix}_${timestamp}.${extension}`;
};

// ==========================================
// UTILIDADES DE TIEMPO
// ==========================================

/**
 * Obtiene el saludo según la hora del día
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
};

/**
 * Formatea tiempo transcurrido desde una fecha
 */
export const getTimeAgo = (date: string | Date): string => {
  const now = new Date();
  let targetDate: Date;

  if (typeof date === "string") {
    targetDate = new Date(date);
  } else {
    targetDate = date;
  }

  const diffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) return "Hace menos de un minuto";
  if (diffInSeconds < 3600)
    return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400)
    return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 2592000)
    return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
  if (diffInSeconds < 31536000)
    return `Hace ${Math.floor(diffInSeconds / 2592000)} meses`;

  return `Hace ${Math.floor(diffInSeconds / 31536000)} años`;
};

/**
 * Verifica si una fecha es hoy
 */
export const isToday = (date: string | Date): boolean => {
  const today = new Date();
  let targetDate: Date;

  if (typeof date === "string") {
    if (date.includes("/")) {
      const [day, month, year] = date.split("/");
      targetDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      targetDate = new Date(date);
    }
  } else {
    targetDate = date;
  }

  return today.toDateString() === targetDate.toDateString();
};

// ==========================================
// UTILIDADES DE COLORES Y ESTILOS
// ==========================================

/**
 * Genera un color aleatorio en formato hexadecimal
 */
export const generateRandomColor = (): string => {
  const colors = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.success,
    COLORS.warning,
    COLORS.info,
    "#E91E63", // Pink
    "#9C27B0", // Purple
    "#673AB7", // Deep Purple
    "#3F51B5", // Indigo
    "#009688", // Teal
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Convierte un color hex a rgba con opacidad
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Determina si un color es claro u oscuro
 */
export const isLightColor = (hex: string): boolean => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Fórmula de luminancia
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5;
};

// ==========================================
// UTILIDADES DE NAVEGACIÓN
// ==========================================

/**
 * Obtiene el título de pantalla según la ruta
 */
export const getScreenTitle = (routeName: string): string => {
  const titles: Record<string, string> = {
    Login: "Iniciar Sesión",
    Home: "Sistema Escolar",
    AlumnoList: "Lista de Alumnos",
    AlumnoDetails: "Detalle del Alumno",
    ProfesorList: "Lista de Profesores",
    ProfesorDetails: "Detalle del Profesor",
    MateriaList: "Lista de Materias",
    MateriaDetails: "Detalle de la Materia",
    GrupoList: "Lista de Grupos",
    GrupoDetails: "Detalle del Grupo",
  };

  return titles[routeName] || "Sistema Escolar";
};

// ==========================================
// UTILIDADES DE DEBUGGEO
// ==========================================

/**
 * Log con formato para desarrollo
 */
export const debugLog = (message: string, data?: any): void => {
  if (__DEV__) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`, data || "");
  }
};

/**
 * Log de errores con contexto
 */
export const errorLog = (error: Error, context?: string): void => {
  if (__DEV__) {
    console.error(`Error ${context ? `in ${context}` : ""}:`, error);
  }
};

// ==========================================
// EXPORTACIÓN POR DEFECTO
// ==========================================

export default {
  // Formateo
  capitalizeWords,
  capitalizeFirst,
  formatFullName,
  formatEmail,
  formatPhoneNumber,
  formatDate,
  formatDateReadable,
  formatNumber,
  formatGrade,

  // Transformación
  stringToSlug,
  truncateText,
  normalizeForSearch,

  // Datos
  generateId,
  generateControlNumber,
  getInitials,
  calculateAge,
  getCareerColor,
  getCareerFullName,
  getSemesterNumber,
  getSemesterSection,

  // Ordenamiento y filtrado
  sortAlumnos,
  filterAlumnos,
  paginateArray,

  // Validación
  isValidEmail,
  isValidPhone,
  isValidDate,
  isValidControlNumber,

  // Estadísticas
  calculateStats,
  groupAlumnosByCarrera,
  groupAlumnosBySemestre,

  // Exportación
  alumnosToCSV,
  generateFileName,

  // Tiempo
  getGreeting,
  getTimeAgo,
  isToday,

  // Colores
  generateRandomColor,
  hexToRgba,
  isLightColor,

  // Navegación
  getScreenTitle,

  // Debug
  debugLog,
  errorLog,
};
