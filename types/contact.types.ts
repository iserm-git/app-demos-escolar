/**
 * Información de contacto básica
 */
export interface ContactInfo {
  phone: string;
  email?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  relationship?: string; // Relación con contacto de emergencia
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
  prompt?: boolean; // Mostrar confirmación antes de llamar
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
  raw: string; // Número como se ingresó
  formatted: string; // Número formateado para mostrar
  dialable: string; // Número limpio para marcar
  countryCode?: string;
  areaCode?: string;
  localNumber?: string;
}
