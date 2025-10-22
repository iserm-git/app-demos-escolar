/**
 * Constantes y configuraciones globales de la aplicación escolar
 * Contiene valores fijos, configuraciones y datos estáticos utilizados en toda la app
 */

import { Carrera } from '../types';

// ==========================================
// INFORMACIÓN DE LA APLICACIÓN
// ==========================================

export const APP_INFO = {
  name: 'Sistema de Gestión Escolar',
  shortName: 'SGE',
  version: '1.0.0',
  description: 'Sistema integral para la gestión de estudiantes, profesores y materias',
  author: 'Equipo de Desarrollo Tecnológico',
  company: 'Instituto Tecnológico',
  website: 'https://www.instituto.edu.mx',
  supportEmail: 'soporte@instituto.edu.mx',
  lastUpdate: '2024-01-15',
  build: 'SGE-2024.001'
} as const;

// ==========================================
// CONFIGURACIÓN GENERAL
// ==========================================

export const APP_SETTINGS = {
  // Configuración de paginación
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
    pageSizeOptions: [10, 20, 50, 100]
  },
  
  // Configuración de archivos
  files: {
    maxUploadSize: 10 * 1024 * 1024, // 10MB
    supportedImageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    supportedDocumentFormats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'],
    maxFileNameLength: 255
  },
  
  // Configuración de validaciones
  validation: {
    minPasswordLength: 6,
    maxPasswordLength: 50,
    minNameLength: 3,
    maxNameLength: 100,
    maxEmailLength: 100,
    maxPhoneLength: 20,
    maxAddressLength: 200,
    controlNumberLength: 8
  },
  
  // Configuración de UI
  ui: {
    animationDuration: 300,
    toastDuration: 3000,
    refreshTimeout: 5000,
    debounceTime: 300,
    maxItemsPerPage: 50
  },
  
  // Configuración de cache
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutos
    maxCacheSize: 100,
    refreshInterval: 30 * 60 * 1000 // 30 minutos
  }
} as const;

// ==========================================
// DATOS ACADÉMICOS
// ==========================================

/**
 * Carreras disponibles en el sistema
 */
export const CARRERAS = {
  ISC: {
    code: 'ISC',
    name: 'Ingeniería en Sistemas Computacionales',
    shortName: 'Sistemas',
    description: 'Formación en desarrollo de software, redes y sistemas computacionales',
    duration: 9, // semestres
    color: '#2196F3',
    icon: 'computer',
    department: 'Ingeniería en Sistemas y Computación'
  },
  IGE: {
    code: 'IGE',
    name: 'Ingeniería en Gestión Empresarial',
    shortName: 'Gestión',
    description: 'Formación en administración, gestión de proyectos y emprendimiento',
    duration: 9,
    color: '#4CAF50',
    icon: 'business',
    department: 'Ciencias Económico Administrativas'
  },
  IIA: {
    code: 'IIA',
    name: 'Ingeniería en Industrias Alimentarias',
    shortName: 'Alimentarias',
    description: 'Formación en procesamiento, conservación y calidad de alimentos',
    duration: 9,
    color: '#FF9800',
    icon: 'restaurant',
    department: 'Ingeniería Química y Bioquímica'
  },
  ITICS: {
    code: 'ITICS',
    name: 'Ingeniería en Tecnologías de la Información y Comunicaciones',
    shortName: 'TIC\'s',
    description: 'Formación en telecomunicaciones, redes y tecnologías emergentes',
    duration: 9,
    color: '#9C27B0',
    icon: 'wifi',
    department: 'Ingeniería en Sistemas y Computación'
  }
} as const;

/**
 * Lista de códigos de carreras
 */
export const CARRERA_CODES: Carrera[] = ['ISC', 'IGE', 'IIA', 'ITICS'];

/**
 * Semestres disponibles
 */
export const SEMESTRES = [
  { code: '1A', number: 1, section: 'A', label: 'Primer Semestre A' },
  { code: '1B', number: 1, section: 'B', label: 'Primer Semestre B' },
  { code: '2A', number: 2, section: 'A', label: 'Segundo Semestre A' },
  { code: '2B', number: 2, section: 'B', label: 'Segundo Semestre B' },
  { code: '3A', number: 3, section: 'A', label: 'Tercer Semestre A' },
  { code: '3B', number: 3, section: 'B', label: 'Tercer Semestre B' },
  { code: '4A', number: 4, section: 'A', label: 'Cuarto Semestre A' },
  { code: '4B', number: 4, section: 'B', label: 'Cuarto Semestre B' },
  { code: '5A', number: 5, section: 'A', label: 'Quinto Semestre A' },
  { code: '5B', number: 5, section: 'B', label: 'Quinto Semestre B' },
  { code: '6A', number: 6, section: 'A', label: 'Sexto Semestre A' },
  { code: '6B', number: 6, section: 'B', label: 'Sexto Semestre B' },
  { code: '7A', number: 7, section: 'A', label: 'Séptimo Semestre A' },
  { code: '7B', number: 7, section: 'B', label: 'Séptimo Semestre B' },
  { code: '8A', number: 8, section: 'A', label: 'Octavo Semestre A' },
  { code: '8B', number: 8, section: 'B', label: 'Octavo Semestre B' },
  { code: '9A', number: 9, section: 'A', label: 'Noveno Semestre A' },
  { code: '9B', number: 9, section: 'B', label: 'Noveno Semestre B' }
] as const;

/**
 * Códigos de semestres
 */
export const SEMESTRE_CODES = SEMESTRES.map(sem => sem.code);

/**
 * Estados de alumnos
 */
export const STUDENT_STATUS = {
  ACTIVE: {
    code: 'Activo',
    label: 'Activo',
    description: 'Estudiante inscrito y cursando materias',
    color: '#4CAF50',
    icon: 'check-circle'
  },
  INACTIVE: {
    code: 'Inactivo',
    label: 'Inactivo',
    description: 'Estudiante temporalmente sin actividad académica',
    color: '#FF9800',
    icon: 'pause-circle'
  },
  GRADUATED: {
    code: 'Egresado',
    label: 'Egresado',
    description: 'Estudiante que completó sus estudios',
    color: '#2196F3',
    icon: 'school'
  },
  TEMPORARY_LEAVE: {
    code: 'Baja temporal',
    label: 'Baja Temporal',
    description: 'Estudiante con suspensión temporal de estudios',
    color: '#F44336',
    icon: 'remove-circle'
  }
} as const;

/**
 * Estados de profesores
 */
export const TEACHER_STATUS = {
  ACTIVE: {
    code: 'Activo',
    label: 'Activo',
    description: 'Profesor activo impartiendo clases',
    color: '#4CAF50',
    icon: 'check-circle'
  },
  INACTIVE: {
    code: 'Inactivo',
    label: 'Inactivo',
    description: 'Profesor temporalmente sin asignaciones',
    color: '#FF9800',
    icon: 'pause-circle'
  },
  LICENSE: {
    code: 'Licencia',
    label: 'Con Licencia',
    description: 'Profesor con permiso temporal',
    color: '#9C27B0',
    icon: 'event-busy'
  }
} as const;

/**
 * Estados de materias
 */
export const SUBJECT_STATUS = {
  ACTIVE: {
    code: 'Activa',
    label: 'Activa',
    description: 'Materia disponible para ser cursada',
    color: '#4CAF50',
    icon: 'check-circle'
  },
  INACTIVE: {
    code: 'Inactiva',
    label: 'Inactiva',
    description: 'Materia temporalmente no disponible',
    color: '#FF9800',
    icon: 'pause-circle'
  },
  DEVELOPMENT: {
    code: 'En Desarrollo',
    label: 'En Desarrollo',
    description: 'Materia en proceso de creación o actualización',
    color: '#2196F3',
    icon: 'build'
  }
} as const;

/**
 * Modalidades de materias
 */
export const SUBJECT_MODALITIES = {
  PRESENTIAL: {
    code: 'Presencial',
    label: 'Presencial',
    description: 'Clases impartidas en aulas físicas',
    icon: 'school'
  },
  VIRTUAL: {
    code: 'Virtual',
    label: 'Virtual',
    description: 'Clases impartidas en línea',
    icon: 'computer'
  },
  HYBRID: {
    code: 'Híbrida',
    label: 'Híbrida',
    description: 'Combinación de clases presenciales y virtuales',
    icon: 'merge-type'
  }
} as const;

/**
 * Grados académicos
 */
export const ACADEMIC_DEGREES = {
  BACHELOR: {
    code: 'Licenciatura',
    label: 'Licenciatura',
    shortLabel: 'Lic.',
    level: 1
  },
  MASTER: {
    code: 'Maestría',
    label: 'Maestría',
    shortLabel: 'M.C.',
    level: 2
  },
  DOCTORATE: {
    code: 'Doctorado',
    label: 'Doctorado',
    shortLabel: 'Dr.',
    level: 3
  }
} as const;

// ==========================================
// CONFIGURACIÓN DE HORARIOS
// ==========================================

/**
 * Días de la semana
 */
export const WEEKDAYS = {
  MONDAY: {
    code: 'Lunes',
    label: 'Lunes',
    shortLabel: 'Lun',
    order: 1
  },
  TUESDAY: {
    code: 'Martes',
    label: 'Martes',
    shortLabel: 'Mar',
    order: 2
  },
  WEDNESDAY: {
    code: 'Miércoles',
    label: 'Miércoles',
    shortLabel: 'Mié',
    order: 3
  },
  THURSDAY: {
    code: 'Jueves',
    label: 'Jueves',
    shortLabel: 'Jue',
    order: 4
  },
  FRIDAY: {
    code: 'Viernes',
    label: 'Viernes',
    shortLabel: 'Vie',
    order: 5
  },
  SATURDAY: {
    code: 'Sábado',
    label: 'Sábado',
    shortLabel: 'Sáb',
    order: 6
  }
} as const;

/**
 * Horarios de clase disponibles
 */
export const CLASS_SCHEDULES = [
  { start: '07:00', end: '08:00', period: 'Matutino' },
  { start: '08:00', end: '09:00', period: 'Matutino' },
  { start: '09:00', end: '10:00', period: 'Matutino' },
  { start: '10:00', end: '11:00', period: 'Matutino' },
  { start: '11:00', end: '12:00', period: 'Matutino' },
  { start: '12:00', end: '13:00', period: 'Matutino' },
  { start: '13:00', end: '14:00', period: 'Vespertino' },
  { start: '14:00', end: '15:00', period: 'Vespertino' },
  { start: '15:00', end: '16:00', period: 'Vespertino' },
  { start: '16:00', end: '17:00', period: 'Vespertino' },
  { start: '17:00', end: '18:00', period: 'Vespertino' },
  { start: '18:00', end: '19:00', period: 'Vespertino' },
  { start: '19:00', end: '20:00', period: 'Nocturno' },
  { start: '20:00', end: '21:00', period: 'Nocturno' },
  { start: '21:00', end: '22:00', period: 'Nocturno' }
] as const;

// ==========================================
// MENSAJES DEL SISTEMA
// ==========================================

export const SYSTEM_MESSAGES = {
  // Mensajes de éxito
  SUCCESS: {
    SAVE: '✅ Guardado exitosamente',
    UPDATE: '✅ Actualizado correctamente',
    DELETE: '✅ Eliminado exitosamente',
    CREATE: '✅ Creado correctamente',
    LOGIN: '✅ Inicio de sesión exitoso',
    LOGOUT: '✅ Sesión cerrada correctamente',
    UPLOAD: '✅ Archivo subido correctamente',
    EXPORT: '✅ Exportación completada',
    IMPORT: '✅ Importación completada'
  },
  
  // Mensajes de error
  ERROR: {
    GENERIC: '❌ Ha ocurrido un error inesperado',
    NETWORK: '🌐 Error de conexión a internet',
    SERVER: '🔧 Error del servidor, intenta más tarde',
    VALIDATION: '⚠️ Por favor, corrige los errores en el formulario',
    PERMISSION: '🔒 No tienes permisos para realizar esta acción',
    NOT_FOUND: '🔍 No se encontró la información solicitada',
    DUPLICATE: '📋 El registro ya existe',
    FILE_SIZE: '📁 El archivo es demasiado grande',
    FILE_TYPE: '📄 Tipo de archivo no permitido',
    REQUIRED_FIELD: '⚠️ Este campo es obligatorio',
    INVALID_FORMAT: '📝 Formato no válido',
    LOGIN_FAILED: '🔐 Usuario o contraseña incorrectos',
    SESSION_EXPIRED: '⏰ La sesión ha expirado'
  },
  
  // Mensajes informativos
  INFO: {
    LOADING: '⏳ Cargando...',
    SAVING: '💾 Guardando...',
    DELETING: '🗑️ Eliminando...',
    UPLOADING: '📤 Subiendo archivo...',
    PROCESSING: '⚙️ Procesando...',
    NO_DATA: '📭 No hay datos disponibles',
    EMPTY_LIST: '📋 La lista está vacía',
    SEARCH_NO_RESULTS: '🔍 No se encontraron resultados',
    COMING_SOON: '🚧 Funcionalidad próximamente disponible'
  },
  
  // Mensajes de confirmación
  CONFIRM: {
    DELETE: '⚠️ ¿Estás seguro de que deseas eliminar este elemento?',
    LOGOUT: '🚪 ¿Deseas cerrar sesión?',
    CANCEL: '❌ ¿Deseas cancelar los cambios no guardados?',
    OVERWRITE: '📝 ¿Deseas sobrescribir el archivo existente?',
    RESET: '🔄 ¿Deseas restablecer los valores?'
  },
  
  // Mensajes de advertencia
  WARNING: {
    UNSAVED_CHANGES: '⚠️ Tienes cambios sin guardar',
    LOW_STORAGE: '💾 Espacio de almacenamiento bajo',
    LARGE_FILE: '📁 El archivo es muy grande y podría tardar en procesarse',
    OFFLINE: '📶 Sin conexión a internet',
    MAINTENANCE: '🔧 El sistema está en mantenimiento'
  }
} as const;

// ==========================================
// CONFIGURACIÓN DE FORMATOS
// ==========================================

export const FORMATS = {
  // Formatos de fecha
  DATE: {
    SHORT: 'DD/MM/YYYY',
    LONG: 'DD de MMMM, YYYY',
    TIME: 'HH:mm',
    DATETIME: 'DD/MM/YYYY HH:mm',
    ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ'
  },
  
  // Formatos de números
  NUMBER: {
    DECIMAL_PLACES: 2,
    THOUSAND_SEPARATOR: ',',
    DECIMAL_SEPARATOR: '.',
    CURRENCY: 'MXN',
    CURRENCY_SYMBOL: '$'
  },
  
  // Formatos de archivos
  FILE: {
    MAX_NAME_LENGTH: 255,
    ALLOWED_CHARACTERS: /^[a-zA-Z0-9._-]+$/,
    DATE_PREFIX: 'YYYYMMDD_HHmmss'
  }
} as const;

// ==========================================
// EXPRESIONES REGULARES
// ==========================================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  NUMBERS_ONLY: /^\d+$/,
  LETTERS_ONLY: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s]+$/,
  CONTROL_NUMBER: /^\d{8}$/,
  DATE_DD_MM_YYYY: /^\d{2}\/\d{2}\/\d{4}$/,
  TIME_HH_MM: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
} as const;

// ==========================================
// CONFIGURACIÓN DE API
// ==========================================

export const API_CONFIG = {
  // URLs base
  BASE_URL: 'https://api.instituto.edu.mx/v1',
  BASE_URL_DEV: 'http://localhost:3000/api/v1',
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile'
    },
    STUDENTS: {
      LIST: '/students',
      DETAIL: '/students/:id',
      CREATE: '/students',
      UPDATE: '/students/:id',
      DELETE: '/students/:id',
      EXPORT: '/students/export',
      IMPORT: '/students/import'
    },
    TEACHERS: {
      LIST: '/teachers',
      DETAIL: '/teachers/:id',
      CREATE: '/teachers',
      UPDATE: '/teachers/:id',
      DELETE: '/teachers/:id'
    },
    SUBJECTS: {
      LIST: '/subjects',
      DETAIL: '/subjects/:id',
      CREATE: '/subjects',
      UPDATE: '/subjects/:id',
      DELETE: '/subjects/:id'
    },
    GROUPS: {
      LIST: '/groups',
      DETAIL: '/groups/:id',
      CREATE: '/groups',
      UPDATE: '/groups/:id',
      DELETE: '/groups/:id'
    }
  },
  
  // Configuración de requests
  TIMEOUT: 30000, // 30 segundos
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
} as const;

// ==========================================
// CONFIGURACIÓN DE STORAGE
// ==========================================

export const STORAGE_KEYS = {
  // Autenticación
  AUTH_TOKEN: '@SGE:auth_token',
  REFRESH_TOKEN: '@SGE:refresh_token',
  USER_PROFILE: '@SGE:user_profile',
  
  // Configuración de usuario
  USER_PREFERENCES: '@SGE:user_preferences',
  THEME: '@SGE:theme',
  LANGUAGE: '@SGE:language',
  
  // Cache de datos
  STUDENTS_CACHE: '@SGE:students_cache',
  TEACHERS_CACHE: '@SGE:teachers_cache',
  SUBJECTS_CACHE: '@SGE:subjects_cache',
  GROUPS_CACHE: '@SGE:groups_cache',
  
  // Configuración de la app
  APP_VERSION: '@SGE:app_version',
  LAST_SYNC: '@SGE:last_sync',
  ONBOARDING_COMPLETED: '@SGE:onboarding_completed'
} as const;

// ==========================================
// CONFIGURACIÓN DE NOTIFICACIONES
// ==========================================

export const NOTIFICATION_TYPES = {
  SUCCESS: {
    type: 'success',
    duration: 3000,
    backgroundColor: '#4CAF50',
    textColor: '#FFFFFF'
  },
  ERROR: {
    type: 'error',
    duration: 5000,
    backgroundColor: '#F44336',
    textColor: '#FFFFFF'
  },
  WARNING: {
    type: 'warning',
    duration: 4000,
    backgroundColor: '#FF9800',
    textColor: '#FFFFFF'
  },
  INFO: {
    type: 'info',
    duration: 3000,
    backgroundColor: '#2196F3',
    textColor: '#FFFFFF'
  }
} as const;

// ==========================================
// CONFIGURACIÓN DE FILTROS
// ==========================================

export const FILTER_OPTIONS = {
  // Opciones de ordenamiento
  SORT_OPTIONS: [
    { value: 'nombre', label: 'Nombre (A-Z)', order: 'asc' },
    { value: 'nombre', label: 'Nombre (Z-A)', order: 'desc' },
    { value: 'carrera', label: 'Carrera', order: 'asc' },
    { value: 'semestre', label: 'Semestre', order: 'asc' },
    { value: 'fechaCreacion', label: 'Fecha de registro', order: 'desc' }
  ],
  
  // Opciones de filtro por estado
  STATUS_FILTER: [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'activo', label: 'Solo activos' },
    { value: 'inactivo', label: 'Solo inactivos' }
  ],
  
  // Opciones de vista
  VIEW_OPTIONS: [
    { value: 'list', label: 'Lista', icon: 'list' },
    { value: 'grid', label: 'Cuadrícula', icon: 'grid-on' },
    { value: 'card', label: 'Tarjetas', icon: 'view-agenda' }
  ]
} as const;

// ==========================================
// CONFIGURACIÓN DE TEMAS
// ==========================================

export const THEME_CONFIG = {
  LIGHT: {
    name: 'light',
    label: 'Claro',
    colors: {
      primary: '#6200ea',
      background: '#f5f5f5',
      surface: '#ffffff',
      text: '#212121',
      textSecondary: '#757575'
    }
  },
  DARK: {
    name: 'dark',
    label: 'Oscuro',
    colors: {
      primary: '#bb86fc',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#b3b3b3'
    }
  }
} as const;

// ==========================================
// DATOS MOCK PARA DESARROLLO
// ==========================================

export const MOCK_DATA = {
  SAMPLE_STUDENTS: [
    {
      id: 1,
      nombre: 'Juan Pérez García',
      sem: '7A',
      carrera: 'ISC' as Carrera,
      email: 'juan.perez@instituto.edu.mx',
      telefono: '+52 443 123 4567',
      numeroControl: '20180001'
    },
    {
      id: 2,
      nombre: 'Ana Gómez López',
      sem: '7A',
      carrera: 'ISC' as Carrera,
      email: 'ana.gomez@instituto.edu.mx',
      telefono: '+52 443 234 5678',
      numeroControl: '20180002'
    }
  ],
  
  SAMPLE_TEACHERS: [
    {
      id: 1,
      nombre: 'Dr. Antonio Suárez Zinzun',
      carrera: 'ISC' as Carrera,
      especialidad: 'Inteligencia Artificial',
      email: 'antonio.suarez@instituto.edu.mx'
    }
  ]
} as const;

// ==========================================
// CONFIGURACIÓN DE DESARROLLO
// ==========================================

export const DEV_CONFIG = {
  // Configuración de logs
  ENABLE_LOGGING: __DEV__,
  LOG_LEVEL: 'debug',
  
  // Configuración de mocks
  USE_MOCK_DATA: __DEV__,
  MOCK_DELAY: 1000,
  
  // Configuración de debug
  SHOW_DEBUG_INFO: __DEV__,
  ENABLE_FLIPPER: __DEV__,
  
  // URLs de desarrollo
  DEV_SERVER_URL: 'http://localhost:3000',
  STORYBOOK_URL: 'http://localhost:6006'
} as const;

// ==========================================
// CONFIGURACIÓN DE ANALYTICS
// ==========================================

export const ANALYTICS_EVENTS = {
  // Eventos de navegación
  SCREEN_VIEW: 'screen_view',
  NAVIGATION: 'navigation',
  
  // Eventos de usuario
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGN_UP: 'sign_up',
  
  // Eventos de CRUD
  CREATE_STUDENT: 'create_student',
  UPDATE_STUDENT: 'update_student',
  DELETE_STUDENT: 'delete_student',
  VIEW_STUDENT: 'view_student',
  
  // Eventos de búsqueda
  SEARCH: 'search',
  FILTER: 'filter',
  SORT: 'sort',
  
  // Eventos de exportación
  EXPORT_DATA: 'export_data',
  IMPORT_DATA: 'import_data',
  
  // Eventos de error
  ERROR: 'error',
  API_ERROR: 'api_error',
  VALIDATION_ERROR: 'validation_error'
} as const;

// ==========================================
// UTILIDADES DE CONSTANTES
// ==========================================

/**
 * Obtiene las opciones de carrera para select/picker
 */
export const getCareerOptions = () => {
  return Object.values(CARRERAS).map(carrera => ({
    value: carrera.code,
    label: carrera.name
  }));
};

/**
 * Obtiene las opciones de semestre para select/picker
 */
export const getSemesterOptions = () => {
  return SEMESTRES.map(semestre => ({
    value: semestre.code,
    label: semestre.label
  }));
};

/**
 * Obtiene las opciones de estado de estudiante
 */
export const getStudentStatusOptions = () => {
  return Object.values(STUDENT_STATUS).map(status => ({
    value: status.code,
    label: status.label
  }));
};

/**
 * Obtiene información de una carrera por código
 */
export const getCareerInfo = (code: Carrera) => {
  return CARRERAS[code];
};

/**
 * Obtiene información de un semestre por código
 */
export const getSemesterInfo = (code: string) => {
  return SEMESTRES.find(sem => sem.code === code);
};

// ==========================================
// EXPORTACIÓN POR DEFECTO
// ==========================================

export default {
  APP_INFO,
  APP_SETTINGS,
  CARRERAS,
  CARRERA_CODES,
  SEMESTRES,
  SEMESTRE_CODES,
  STUDENT_STATUS,
  TEACHER_STATUS,
  SUBJECT_STATUS,
  SUBJECT_MODALITIES,
  ACADEMIC_DEGREES,
  