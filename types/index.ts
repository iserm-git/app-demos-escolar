/**
 * Archivo central para todos los tipos TypeScript de la aplicación
 * Aquí definimos las interfaces y tipos que se usarán en toda la app
 */

// ==========================================
// TIPOS BÁSICOS DE LA APLICACIÓN
// ==========================================

/**
 * Tipo para identificadores únicos
 */
export type ID = number;

/**
 * Carreras disponibles en el sistema
 */
export type Carrera = "ISC" | "IGE" | "IIA" | "ITICS";

// ==========================================
// INTERFACES DE ENTIDADES PRINCIPALES
// ==========================================

/**
 * Interfaz base para entidades que tienen ID
 */
export interface BaseEntity {
  id: ID;
}

/**
 * Interfaz para un Alumno - ACTUALIZADA para compatibilidad con el CRUD
 */
export interface Alumno extends BaseEntity {
  id: number;
  nombre: string;
  sem?: string; // Semestre (ej: "7A", "8B")
  carrera?: Carrera;
  email?: string;
  telefono?: string;
  // Campos adicionales para el formulario completo
  fechaNacimiento?: string; // Formato DD/MM/YYYY
  direccion?: string;
  numeroControl?: string; // Número de control único
  fechaIngreso?: string;
  estatus?: "Activo" | "Inactivo" | "Egresado" | "Baja temporal";
  promedio?: number;
  creditosAcumulados?: number;
  observaciones?: string;
  fotoPerfil?: string;
  fotoPerfilThumb?: string;
}

/**
 * Interfaz para un Profesor - ACTUALIZADA para CRUD completo
 */
export interface Profesor extends BaseEntity {
  nombre: string;
  carrera: Carrera;
  email?: string;
  telefono?: string;
  especialidad?: string;
  gradoAcademico?: "Licenciatura" | "Maestría" | "Doctorado";
  estatus?: "Activo" | "Inactivo" | "Licencia";
  fechaIngreso?: string;
  numeroEmpleado?: string;
  departamento?: string;
  materiasImpartidas?: ID[];
  gruposAsignados?: ID[];
  // Campos adicionales para información académica
  experienciaAnios?: number;
  publicaciones?: number;
  evaluacionPromedio?: number;
  cedula?: string;
  curp?: string;
  rfc?: string;
  direccion?: string;
  fechaNacimiento?: string;
  nacionalidad?: string;
  estadoCivil?: "Soltero" | "Casado" | "Divorciado" | "Viudo" | "Unión libre";
  fotoPerfil?: string;
  fotoPerfilThumb?: string;
}

/**
 * Interfaz para una Materia
 */
export interface Materia extends BaseEntity {
  nombre: string;
  carrera: Carrera;
  creditos?: number;
  semestre?: number;
  descripcion?: string;
  prerrequisitos?: string[];
  modalidad?: "Presencial" | "Virtual" | "Híbrida";
  estado?: "Activa" | "Inactiva" | "En Desarrollo";
  profesorId?: ID;
  horasTeoricas?: number;
  horasPracticas?: number;
}

/**
 * Interfaz para un Grupo
 */
export interface Grupo extends BaseEntity {
  nombre: string;
  carrera: Carrera;
  profesorId?: ID;
  materiaId?: ID;
  semestre?: number;
  capacidadMaxima?: number;
  estudiantesInscritos?: ID[];
  horario?: string;
  estatus?: "Activo" | "Inactivo" | "Finalizado";
  periodo?: string;
  aula?: string;
}

/**
 * Interfaz para horarios de clase
 */
export interface HorarioClase {
  id: ID;
  dia: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado";
  horaInicio: string;
  horaFin: string;
  materiaId: ID;
  profesorId: ID;
  grupoId: ID;
  aula: string;
}

// ==========================================
// TIPOS PARA COMPONENTES UI
// ==========================================

/**
 * Props para componentes de Card/Tarjeta
 */
export interface CardProps {
  titulo: string;
  subtitulo?: string;
  onPress?: () => void;
  icono?: string;
  imagen?: any; // Para require() de imágenes
}

/**
 * Props para componentes de Modal
 */
export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  titulo?: string;
  children?: React.ReactNode;
}

/**
 * Props para componentes de Lista
 */
export interface ListItemProps<T> {
  item: T;
  onPress?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

// ==========================================
// TIPOS PARA FORMULARIOS
// ==========================================

/**
 * Datos del formulario de Login
 */
export interface LoginFormData {
  username: string;
  password: string;
}

/**
 * Datos del formulario de Alumno - ACTUALIZADO para el modal
 */
export interface AlumnoFormData {
  nombre: string;
  sem: string;
  carrera: Carrera;
  email: string;
  telefono: string;
  fechaNacimiento?: string;
  direccion?: string;
  numeroControl?: string;
}

/**
 * Datos del formulario de Profesor - ACTUALIZADO para CRUD completo
 */
export interface ProfesorFormData {
  nombre: string;
  carrera: Carrera;
  email: string;
  telefono: string;
  especialidad: string;
  gradoAcademico: "Licenciatura" | "Maestría" | "Doctorado";
  numeroEmpleado?: string;
  departamento?: string;
  fechaIngreso?: string;
  estatus: "Activo" | "Inactivo" | "Licencia";
  // Campos adicionales opcionales
  cedula?: string;
  curp?: string;
  rfc?: string;
  direccion?: string;
  fechaNacimiento?: string;
  nacionalidad?: string;
  estadoCivil?: "Soltero" | "Casado" | "Divorciado" | "Viudo" | "Unión libre";
}

// ==========================================
// TIPOS PARA GESTIÓN DE ESTADOS
// ==========================================

/**
 * Estados de carga para operaciones asíncronas
 */
export type LoadingState = "idle" | "loading" | "success" | "error";

/**
 * Estructura para manejo de errores
 */
export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}

/**
 * Estado general de una pantalla con datos
 */
export interface ScreenState<T> {
  data: T[];
  loading: LoadingState;
  error: ErrorState;
}

// ==========================================
// TIPOS PARA NAVEGACIÓN (Complementarios)
// ==========================================

/**
 * Props que reciben las pantallas de navegación
 */
export interface ScreenProps<T = any> {
  navigation: any; // Tipo básico, se puede mejorar después
  route: {
    params?: T;
  };
}

/**
 * Parámetros específicos para pantallas de detalle
 */
export interface DetailScreenParams {
  id: ID;
  nombre: string;
}

// ==========================================
// TIPOS UTILITARIOS
// ==========================================

/**
 * Hace todas las propiedades opcionales excepto el ID
 */
export type PartialExceptId<T extends BaseEntity> = {
  id: ID;
} & Partial<Omit<T, "id">>;

/**
 * Omite el ID para crear nuevos elementos
 */
export type CreateEntity<T extends BaseEntity> = Omit<T, "id">;

/**
 * Para operaciones CRUD
 */
export type CRUDOperation = "create" | "read" | "update" | "delete";

/**
 * Tipos para diferentes modos de formulario
 */
export type FormMode = "create" | "edit" | "view";

// ==========================================
// TIPOS PARA VALIDACIÓN
// ==========================================

/**
 * Reglas de validación para formularios
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message: string;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule[];
}

/**
 * Resultado de validación
 */
export interface ValidationResult {
  isValid: boolean;
  errors: { [fieldName: string]: string };
}

// ==========================================
// TIPOS PARA FILTROS Y BÚSQUEDA
// ==========================================

/**
 * Filtros de búsqueda para alumnos
 */
export interface AlumnoSearchFilters {
  text?: string;
  carrera?: Carrera | "Todas";
  semestre?: string;
  estatus?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

/**
 * Filtros de búsqueda para profesores - NUEVO
 */
export interface ProfesorSearchFilters {
  text?: string;
  carrera?: Carrera | "Todas";
  especialidad?: string;
  gradoAcademico?: "Licenciatura" | "Maestría" | "Doctorado" | "Todos";
  estatus?: "Activo" | "Inactivo" | "Licencia" | "Todos";
  departamento?: string;
  experienciaMinima?: number;
}

/**
 * Filtros generales del sistema
 */
export interface SearchFilters {
  text?: string;
  carrera?: Carrera | "Todas";
  semestre?: string;
  estatus?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

/**
 * Opciones de ordenamiento
 */
export interface SortOption {
  field: string;
  direction: "asc" | "desc";
  label: string;
}

/**
 * Estado de paginación
 */
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ==========================================
// TIPOS PARA API
// ==========================================

/**
 * Respuesta estándar de API
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: PaginationState;
}

/**
 * Respuesta de API para operaciones CRUD
 */
export interface CRUDApiResponse<T> extends ApiResponse<T> {
  operation: CRUDOperation;
  timestamp: string;
  affectedRows?: number;
}

// ==========================================
// TIPOS ADICIONALES PARA EL SISTEMA
// ==========================================

/**
 * Configuración de notificaciones
 */
export interface NotificationSettings {
  enabled: boolean;
  types: {
    asistencias: boolean;
    calificaciones: boolean;
    avisos: boolean;
    eventos: boolean;
  };
}

/**
 * Perfil de usuario
 */
export interface UserProfile {
  id: ID;
  username: string;
  nombre: string;
  email: string;
  rol: "Administrador" | "Profesor" | "Alumno";
  avatar?: string;
  ultimoAcceso?: string;
  configuraciones: NotificationSettings;
}

/**
 * Información académica detallada para profesores - NUEVO
 */
export interface ProfesorAcademicInfo {
  materiasImpartidas: Materia[];
  gruposAsignados: Grupo[];
  estudiantesTotales: number;
  experienciaAnios: number;
  promedioEvaluacion: number;
  publicaciones: number;
  certificaciones?: string[];
  proyectosInvestigacion?: string[];
}

/**
 * Información académica detallada para alumnos
 */
export interface AlumnoAcademicInfo {
  promedio: number;
  creditos: number;
  materiasAprobadas: number;
  materiasEnCurso: number;
  semestreActual: string;
  materiasPendientes?: string[];
  historialAcademico?: any[];
}

// ==========================================
// INTERFACES PARA LLAMADAS TELEFÓNICAS (NUEVAS)
// ==========================================

/**
 * Información de contacto para llamadas
 */
export interface ContactInfo {
  phone: string;
  email?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  relationship?: string;
}

/**
 * Tipo de llamada telefónica
 */
export type CallType = "direct" | "prompt";

/**
 * Opciones para realizar llamada
 */
export interface CallOptions {
  phoneNumber: string;
  type?: CallType;
  prompt?: boolean;
}

/**
 * Resultado de intento de llamada
 */
export interface CallResult {
  success: boolean;
  error?: string;
  phoneNumber: string;
}

/**
 * Estados de llamada
 */
export enum CallStatus {
  IDLE = "idle",
  DIALING = "dialing",
  CONNECTED = "connected",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

/**
 * Formato de número telefónico
 */
export interface PhoneNumber {
  raw: string;
  formatted: string;
  dialable: string;
  countryCode?: string;
  areaCode?: string;
  localNumber?: string;
}

// ==========================================
// TIPOS DE UTILIDAD AVANZADOS
// ==========================================

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ==========================================
// CONSTANTES DE TIPO
// ==========================================

/**
 * Colores principales de la aplicación - ACTUALIZADOS
 */
export const COLORS = {
  primary: "#6200ea",
  primaryDark: "#4527a0",
  secondary: "#03dac6",
  background: "#f5f5f5",
  surface: "#ffffff",
  error: "#b00020",
  success: "#4caf50",
  warning: "#ff9800",
  info: "#2196f3",
  text: "#212121",
  textSecondary: "#757575",
  textDisabled: "#bdbdbd",
  onPrimary: "#ffffff",
  onSecondary: "#000000",
  onBackground: "#000000",
  onSurface: "#000000",
  onError: "#ffffff",
  divider: "#e0e0e0",
  overlay: "rgba(0, 0, 0, 0.5)",
  shadow: "#000000",

  // Colores por carrera
  carreras: {
    ISC: "#2196f3",
    IGE: "#4caf50",
    IIA: "#ff9800",
    ITICS: "#9c27b0",
  },

  // Colores por estatus de profesores - NUEVO
  estatusProfesores: {
    Activo: "#4caf50",
    Inactivo: "#f44336",
    Licencia: "#ff9800",
  },

  // Colores por grado académico - NUEVO
  gradosAcademicos: {
    Licenciatura: "#2196f3",
    Maestría: "#ff9800",
    Doctorado: "#9c27b0",
  },
};

/**
 * Tamaños de fuente estándar
 */
export const FONT_SIZES = {
  tiny: 10,
  small: 12,
  medium: 14,
  large: 18,
  xlarge: 24,
  xxlarge: 32,
};

/**
 * Espaciados estándar
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Tiempos de animación
 */
export const ANIMATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};

/**
 * Dimensiones comunes
 */
export const DIMENSIONS = {
  buttonHeight: 48,
  inputHeight: 48,
  headerHeight: 56,
  borderRadius: 8,
  iconSize: 24,
};

/**
 * Configuración de la aplicación
 */
export const APP_CONFIG = {
  name: "Sistema Escolar",
  version: "1.0.0",
  defaultPageSize: 20,
  maxUploadSize: 10 * 1024 * 1024, // 10MB
  supportedImageFormats: ["jpg", "jpeg", "png", "gif"],
  supportedDocumentFormats: ["pdf", "doc", "docx", "xls", "xlsx"],
  dateFormat: "DD/MM/YYYY",
  timeFormat: "HH:mm",
  currency: "MXN",
  defaultLanguage: "es",
} as const;

/**
 * Validaciones comunes - ACTUALIZADAS
 */
export const VALIDATIONS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  numbersOnly: /^\d+$/,
  lettersOnly: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
  controlNumber: /^\d{8}$/,
  empleadoNumber: /^\d{4,8}$/, // NUEVO: Validación para número de empleado
  curp: /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/, // NUEVO: Validación para CURP
  rfc: /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, // NUEVO: Validación para RFC
  cedula: /^\d{7,8}$/, // NUEVO: Validación para cédula profesional
} as const;

/**
 * Mensajes del sistema - ACTUALIZADOS
 */
export const MESSAGES = {
  loading: "Cargando...",
  error: "Ha ocurrido un error",
  success: "Operación exitosa",
  confirmation: "¿Estás seguro?",
  noData: "No hay datos disponibles",
  saved: "Guardado exitosamente",
  deleted: "Eliminado exitosamente",
  updated: "Actualizado exitosamente",
  created: "Creado exitosamente",

  // Mensajes específicos para profesores - NUEVO
  profesores: {
    created: "Profesor creado exitosamente",
    updated: "Información del profesor actualizada",
    deleted: "Profesor eliminado del sistema",
    notFound: "Profesor no encontrado",
    loadingError: "Error al cargar información del profesor",
  },

  // Mensajes de validación - NUEVO
  validation: {
    required: "Este campo es requerido",
    email: "Formato de email inválido",
    phone: "Formato de teléfono inválido",
    minLength: "Debe tener al menos {min} caracteres",
    maxLength: "No puede exceder {max} caracteres",
    invalidFormat: "Formato inválido",
  },
} as const;

/**
 * Configuraciones específicas para módulos - NUEVO
 */
export const MODULE_CONFIG = {
  profesores: {
    maxProfesoresPorDepartamento: 50,
    maxMateriasPersona: 6,
    maxGruposPersona: 4,
    experienciaMinima: 0,
    experienciaMaxima: 50,
    evaluacionMinima: 1.0,
    evaluacionMaxima: 5.0,
  },
  alumnos: {
    maxAlumnosPorGrupo: 40,
    maxMateriasSimultaneas: 8,
    promedioMinimo: 6.0,
    creditosMaximosSemestre: 30,
  },
} as const;

// ==========================================
// INTERFACES PARA IMÁGENES
// ==========================================

export interface ImagePickerOptions {
  mediaTypes: "Images" | "Videos" | "All";
  allowsEditing: boolean;
  aspect?: [number, number];
  quality: number;
  base64?: boolean;
}

export interface ImagePickerResult {
  success: boolean;
  uri?: string;
  base64?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  cancelled?: boolean;
  error?: string;
}

export interface ImageInfo {
  uri: string;
  width: number;
  height: number;
  format: "jpeg" | "png" | "gif" | "webp";
  fileSize: number;
}

export interface ImageManipulation {
  resize?: { width: number; height: number };
  compress?: number;
  format?: "jpeg" | "png";
}
