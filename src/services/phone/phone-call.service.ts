// src/services/phone/phone-call.service.ts

import { Linking, Alert, Platform } from "react-native";
import { CallOptions, CallResult, CallStatus } from "../../../types";
import { PhoneUtils } from "./phone.utils";

/**
 * Servicio para realizar llamadas telefónicas
 */
export class PhoneCallService {
  private static instance: PhoneCallService;
  private currentStatus: CallStatus = CallStatus.IDLE;

  private constructor() {}

  public static getInstance(): PhoneCallService {
    if (!PhoneCallService.instance) {
      PhoneCallService.instance = new PhoneCallService();
    }
    return PhoneCallService.instance;
  }

  /**
   * Realiza una llamada telefónica
   */
  public async makeCall(options: CallOptions): Promise<CallResult> {
    const { phoneNumber, prompt = true } = options;

    try {
      // Validar número
      if (!PhoneUtils.isValidPhone(phoneNumber)) {
        return {
          success: false,
          error: "Número telefónico inválido",
          phoneNumber,
        };
      }

      const dialableNumber = PhoneUtils.getDialableNumber(phoneNumber);
      const formattedNumber = PhoneUtils.formatMexicanPhone(phoneNumber);

      // Mostrar confirmación si está habilitada
      if (prompt) {
        const confirmed = await this.showCallConfirmation(formattedNumber);
        if (!confirmed) {
          this.currentStatus = CallStatus.CANCELLED;
          return {
            success: false,
            error: "Llamada cancelada por el usuario",
            phoneNumber: formattedNumber,
          };
        }
      }

      // Construir URL
      const phoneUrl = `tel:${dialableNumber}`;

      // Verificar si se puede abrir
      const canOpen = await Linking.canOpenURL(phoneUrl);
      if (!canOpen) {
        this.currentStatus = CallStatus.FAILED;
        return {
          success: false,
          error: "No se puede realizar llamadas en este dispositivo",
          phoneNumber: formattedNumber,
        };
      }

      // Realizar llamada
      this.currentStatus = CallStatus.DIALING;
      await Linking.openURL(phoneUrl);
      this.currentStatus = CallStatus.CONNECTED;

      return {
        success: true,
        phoneNumber: formattedNumber,
      };
    } catch (error) {
      this.currentStatus = CallStatus.FAILED;
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      return {
        success: false,
        error: errorMessage,
        phoneNumber,
      };
    }
  }

  /**
   * Muestra confirmación antes de llamar
   */
  private showCallConfirmation(phoneNumber: string): Promise<boolean> {
    return new Promise((resolve) => {
      Alert.alert(
        "Realizar llamada",
        `¿Deseas llamar a ${phoneNumber}?`,
        [
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => resolve(false),
          },
          {
            text: "Llamar",
            onPress: () => resolve(true),
          },
        ],
        { cancelable: true, onDismiss: () => resolve(false) }
      );
    });
  }

  /**
   * Verifica si el dispositivo puede hacer llamadas
   */
  public async canMakeCall(): Promise<boolean> {
    try {
      return await Linking.canOpenURL("tel:1234567890");
    } catch (error) {
      return false;
    }
  }
}

// Exportar instancia única
export const phoneCallService = PhoneCallService.getInstance();
