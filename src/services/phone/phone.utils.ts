// src/services/phone/phone.utils.ts

import { PhoneNumber } from "../../../types";

/**
 * Utilidades para manejo de números telefónicos
 */
export class PhoneUtils {
  /**
   * Limpia un número telefónico
   */
  static cleanPhoneNumber(phone: string): string {
    return phone.replace(/[^\d+]/g, "");
  }

  /**
   * Formatea número para México
   */
  static formatMexicanPhone(phone: string): string {
    const cleaned = this.cleanPhoneNumber(phone);

    if (cleaned.startsWith("+52") && cleaned.length === 13) {
      const number = cleaned.substring(3);
      return `+52 ${number.substring(0, 3)} ${number.substring(
        3,
        6
      )} ${number.substring(6)}`;
    }

    if (cleaned.length === 10) {
      return `+52 ${cleaned.substring(0, 3)} ${cleaned.substring(
        3,
        6
      )} ${cleaned.substring(6)}`;
    }

    return cleaned;
  }

  /**
   * Valida número telefónico
   */
  static isValidPhone(phone: string): boolean {
    const cleaned = this.cleanPhoneNumber(phone);
    if (cleaned.length < 10 || cleaned.length > 15) {
      return false;
    }
    const digitsOnly = cleaned.replace(/\+/g, "");
    return /^\d{10,}$/.test(digitsOnly);
  }

  /**
   * Obtiene número dialable
   */
  static getDialableNumber(phone: string): string {
    const cleaned = this.cleanPhoneNumber(phone);
    if (!cleaned.startsWith("+") && cleaned.length === 10) {
      return `+52${cleaned}`;
    }
    return cleaned;
  }

  /**
   * Parsea número telefónico
   */
  static parsePhoneNumber(phone: string): PhoneNumber {
    const cleaned = this.cleanPhoneNumber(phone);
    const formatted = this.formatMexicanPhone(phone);

    return {
      raw: phone,
      formatted: formatted,
      dialable: cleaned,
      countryCode: "+52",
    };
  }
}
