// src/components/phone/CallButton.tsx

import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { phoneCallService } from "../../services/phone/phone-call.service";
import { COLORS } from "../../../types";

interface CallButtonProps {
  phoneNumber: string;
  label?: string;
  showPrompt?: boolean;
  disabled?: boolean;
  style?: any;
  compact?: boolean; // Modo compacto para cards pequeñas
}

/**
 * Botón para realizar llamadas telefónicas
 */
export const CallButton: React.FC<CallButtonProps> = ({
  phoneNumber,
  label = "Llamar",
  showPrompt = true,
  disabled = false,
  style,
  compact = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);

    try {
      const result = await phoneCallService.makeCall({
        phoneNumber,
        prompt: showPrompt,
      });

      if (!result.success && result.error) {
        console.error("Error al llamar:", result.error);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    // Modo compacto: solo ícono
    return (
      <TouchableOpacity
        style={[styles.compactButton, disabled && styles.buttonDisabled, style]}
        onPress={handlePress}
        disabled={disabled || isLoading}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <MaterialIcons name="phone" size={16} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    );
  }

  // Modo normal: ícono + texto
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <View style={styles.content}>
          <MaterialIcons name="phone" size={16} color="#FFFFFF" />
          <Text style={styles.text}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  compactButton: {
    backgroundColor: "#4CAF50",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: "#CCCCCC",
    elevation: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
