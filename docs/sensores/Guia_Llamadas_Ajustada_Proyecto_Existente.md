---
marp: false
---

# Guía Ajustada: Implementación de Llamadas Telefónicas

## Integración con Código Existente del Proyecto

---

## 📋 Contexto del Proyecto

**Archivos existentes identificados:**

- ✅ `types/index.ts` - Tipos e interfaces centralizadas
- ✅ `src/screens/profesores/ProfesorScreen.tsx` - Vista de profesores
- ✅ `src/screens/alumnos/AlumnoScreen.tsx` - Vista de alumnos
- ✅ Navegación con `@react-navigation/stack`
- ✅ Uso de Expo y React Native

---

## 🎯 Objetivo

Agregar funcionalidad de **llamadas telefónicas** a las pantallas existentes de Profesores y Alumnos, manteniendo la estructura actual del proyecto.

---

## PASO 1: Actualizar Types/Index.ts

### 📝 Modificar: `types/index.ts`

Agregar las siguientes interfaces al archivo existente (al final del archivo, antes de las constantes):

```typescript
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
```

**NOTA:** Las interfaces `Alumno` y `Profesor` ya tienen los campos `telefono` y `email`, por lo que NO necesitamos modificarlas.

---

## PASO 2: Configurar Permisos

### 📱 Android - Modificar: `android/app/src/main/AndroidManifest.xml`

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- ✅ AGREGAR ESTE PERMISO -->
    <uses-permission android:name="android.permission.CALL_PHONE" />

    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:theme="@style/AppTheme">

        <!-- Resto del código sin cambios -->

    </application>
</manifest>
```

### 🍎 iOS - Modificar: `ios/[NombreProyecto]/Info.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>

    <!-- ✅ AGREGAR ESTAS LÍNEAS -->
    <key>LSApplicationQueriesSchemes</key>
    <array>
        <string>tel</string>
        <string>telprompt</string>
    </array>

    <!-- Resto del código sin cambios -->

</dict>
</plist>
```

---

## PASO 3: Crear Servicios de Llamadas

### 📁 Crear carpeta: `src/services/phone/`

```bash
mkdir -p src/services/phone
```

### 📝 Crear archivo: `src/services/phone/phone.utils.ts`

```typescript
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
```

### 📝 Crear archivo: `src/services/phone/phone-call.service.ts`

```typescript
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
```

---

## PASO 4: Crear Componente de Botón de Llamada

### 📁 Crear carpeta: `src/components/phone/`

```bash
mkdir -p src/components/phone
```

### 📝 Crear archivo: `src/components/phone/CallButton.tsx`

```typescript
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
```

---

## PASO 5: Modificar AlumnoScreen.tsx

### 📝 Modificar: `src/screens/alumnos/AlumnoScreen.tsx`

**Cambios a realizar:**

#### 1. Agregar import del CallButton (después de los imports existentes):

```typescript
// Agregar después de: import ModalAlumno from "../../utils/ModalAlumno";
import { CallButton } from "../../components/phone/CallButton";
```

#### 2. Modificar el componente AlumnoItem

**BUSCAR la sección de botones (alrededor de la línea 95-120):**

```typescript
{
  /* Botones de acción */
}
<View style={styles.buttonContainer}>
  <TouchableOpacity
    style={styles.detailButton}
    onPress={() => onPress(alumno)}
    activeOpacity={0.7}
  >
    <MaterialIcons name="visibility" size={14} color={COLORS.surface} />
    <Text style={styles.buttonText}>Ver</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.editButton}
    onPress={() => onEdit(alumno)}
    activeOpacity={0.7}
  >
    <MaterialIcons name="edit" size={14} color={COLORS.surface} />
    <Text style={styles.buttonText}>Editar</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.modalButton}
    onPress={() => onShowModal(alumno)}
    activeOpacity={0.7}
  >
    <MaterialIcons name="info" size={14} color={COLORS.primary} />
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.deleteButton}
    onPress={handleDelete}
    activeOpacity={0.7}
  >
    <MaterialIcons name="delete" size={14} color={COLORS.surface} />
  </TouchableOpacity>
</View>;
```

**REEMPLAZAR CON:**

```typescript
{
  /* Botones de acción */
}
<View style={styles.buttonContainer}>
  {/* ✅ NUEVO: Botón de llamada si tiene teléfono */}
  {alumno.telefono && (
    <CallButton
      phoneNumber={alumno.telefono}
      compact={true}
      showPrompt={true}
    />
  )}

  <TouchableOpacity
    style={styles.detailButton}
    onPress={() => onPress(alumno)}
    activeOpacity={0.7}
  >
    <MaterialIcons name="visibility" size={14} color={COLORS.surface} />
    <Text style={styles.buttonText}>Ver</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.editButton}
    onPress={() => onEdit(alumno)}
    activeOpacity={0.7}
  >
    <MaterialIcons name="edit" size={14} color={COLORS.surface} />
    <Text style={styles.buttonText}>Editar</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.modalButton}
    onPress={() => onShowModal(alumno)}
    activeOpacity={0.7}
  >
    <MaterialIcons name="info" size={14} color={COLORS.primary} />
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.deleteButton}
    onPress={handleDelete}
    activeOpacity={0.7}
  >
    <MaterialIcons name="delete" size={14} color={COLORS.surface} />
  </TouchableOpacity>
</View>;
```

---

## PASO 6: Modificar ProfesorScreen.tsx

### 📝 Modificar: `src/screens/profesores/ProfesorScreen.tsx`

**Cambios a realizar:**

#### 1. Agregar import del CallButton (después de los imports existentes):

```typescript
// Agregar después de: import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { CallButton } from "../../components/phone/CallButton";
```

#### 2. Modificar el componente ProfesorItem

**BUSCAR la sección de botones en ProfesorItem:**

```typescript
{
  /* Botones de acción */
}
<View style={styles.buttonContainer}>
  <TouchableOpacity
    style={styles.detailButton}
    onPress={() => onPress(profesor)}
    activeOpacity={0.7}
  >
    <MaterialIcons name="visibility" size={16} color={COLORS.surface} />
    <Text style={styles.buttonText}>Ver</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.editButton}
    onPress={() => onEdit(profesor)}
    activeOpacity={0.7}
  >
    <MaterialIcons name="edit" size={16} color={COLORS.surface} />
    <Text style={styles.buttonText}>Editar</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.deleteButton}
    onPress={handleDelete}
    activeOpacity={0.7}
  >
    <MaterialIcons name="delete" size={16} color={COLORS.surface} />
  </TouchableOpacity>
</View>;
```

**REEMPLAZAR CON:**

```typescript
{
  /* Botones de acción */
}
<View style={styles.buttonContainer}>
  {/* ✅ NUEVO: Botón de llamada si tiene teléfono */}
  {profesor.telefono && (
    <CallButton
      phoneNumber={profesor.telefono}
      compact={true}
      showPrompt={true}
    />
  )}

  <TouchableOpacity
    style={styles.detailButton}
    onPress={() => onPress(profesor)}
    activeOpacity={0.7}
  >
    <MaterialIcons name="visibility" size={16} color={COLORS.surface} />
    <Text style={styles.buttonText}>Ver</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.editButton}
    onPress={() => onEdit(profesor)}
    activeOpacity={0.7}
  >
    <MaterialIcons name="edit" size={16} color={COLORS.surface} />
    <Text style={styles.buttonText}>Editar</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.deleteButton}
    onPress={handleDelete}
    activeOpacity={0.7}
  >
    <MaterialIcons name="delete" size={16} color={COLORS.surface} />
  </TouchableOpacity>
</View>;
```

---

## PASO 7: Actualizar los Datos Mock (Opcional)

Para asegurar que los datos de prueba tengan números telefónicos, verifica que en ambas pantallas los datos mock incluyan el campo `telefono`.

### En AlumnoScreen.tsx - Verificar mockAlumnos:

```typescript
const mockAlumnos: Alumno[] = [
  {
    id: 1,
    nombre: "Juan Pérez García",
    sem: "7A",
    carrera: "ISC",
    email: "juan.perez@alumno.edu.mx",
    telefono: "+52 443 123 4567", // ✅ Asegurar que existe
  },
  // ... resto de alumnos
];
```

### En ProfesorScreen.tsx - Verificar mockProfesores:

```typescript
const mockProfesores: Profesor[] = [
  {
    id: 1,
    nombre: "Dr. Antonio Suárez Zinzun",
    carrera: "ISC",
    especialidad: "Inteligencia Artificial",
    email: "antonio.suarez@escuela.edu.mx",
    telefono: "+52 443 234 5678", // ✅ Ya existe en el código actual
  },
  // ... resto de profesores
];
```

---

## PASO 8: Compilar y Probar

### Compilar el proyecto:

```bash
# Limpiar caché
npm start -- --clear

# O si usas Expo
expo start --clear

# Para Android
npm run android
# O
expo run:android

# Para iOS (solo Mac)
npm run ios
# O
expo run:ios
```

### Pruebas a realizar:

#### ✅ Prueba 1: Visualización del botón

1. Abrir la app
2. Navegar a "Lista de Profesores"
3. Verificar que aparece el botón verde de llamada en cada card

#### ✅ Prueba 2: Llamada con confirmación

1. Presionar el botón de llamada
2. Verificar que aparece el diálogo "¿Deseas llamar a...?"
3. Presionar "Llamar"
4. Verificar que se abre el marcador del teléfono

#### ✅ Prueba 3: Cancelar llamada

1. Presionar el botón de llamada
2. Presionar "Cancelar" en el diálogo
3. Verificar que no se realiza la llamada

#### ✅ Prueba 4: Alumno sin teléfono

1. Navegar a "Lista de Alumnos"
2. Si algún alumno NO tiene teléfono, verificar que NO aparece el botón

---

## 📊 Resumen de Cambios Realizados

### ✅ Archivos Nuevos Creados:

```
src/
├── services/
│   └── phone/
│       ├── phone.utils.ts (NUEVO)
│       └── phone-call.service.ts (NUEVO)
└── components/
    └── phone/
        └── CallButton.tsx (NUEVO)
```

### ✅ Archivos Modificados:

```
types/index.ts (agregadas interfaces de llamadas)
src/screens/alumnos/AlumnoScreen.tsx (agregado CallButton)
src/screens/profesores/ProfesorScreen.tsx (agregado CallButton)
android/app/src/main/AndroidManifest.xml (permisos)
ios/[Proyecto]/Info.plist (configuración)
```

### ✅ Ningún archivo eliminado o código roto

---

## 🎨 Características Implementadas

✅ **Botón compacto** que se integra perfectamente con el diseño existente
✅ **Validación de números** telefónicos mexicanos
✅ **Confirmación antes de llamar** para evitar llamadas accidentales
✅ **Formateo automático** de números (+52 XXX XXX XXXX)
✅ **Manejo de errores** robusto
✅ **Compatibilidad** con Android e iOS
✅ **Conditional rendering** - solo muestra botón si hay teléfono
✅ **Integración transparente** con el código existente

---

## 🐛 Solución de Problemas

### Problema 1: "CallButton is not exported"

**Solución:** Verificar que el archivo `CallButton.tsx` tiene `export` en la declaración del componente

### Problema 2: No aparece el botón

**Solución:** Verificar que los datos mock tienen el campo `telefono` con un valor válido

### Problema 3: Error de permisos en Android

**Solución:**

1. Desinstalar la app del dispositivo
2. Volver a compilar con `npm run android`
3. Aceptar permisos cuando se soliciten

### Problema 4: TypeScript muestra errores

**Solución:**

```bash
# Reiniciar el servidor de TypeScript
npm start -- --reset-cache
```

---

## 📱 Vista Previa del Resultado

**Antes:**

```
[Foto] Nombre del Profesor
       Carrera | Especialidad
       [Ver] [Editar] [Eliminar]
```

**Después:**

```
[Foto] Nombre del Profesor
       Carrera | Especialidad
       [📞] [Ver] [Editar] [Eliminar]
        ↑ NUEVO
```

---

## 📚 Próximos Pasos Sugeridos

Una vez que esta funcionalidad esté funcionando correctamente:

1. ✅ **Enlaces/Links** - Agregar enlaces a recursos externos
2. ✅ **Selector de Contactos** - Importar contactos del dispositivo
3. ✅ **Cámara** - Captura de fotos de perfil
4. ✅ **Geolocalización** - Registro de asistencias con ubicación

---

## ✅ Checklist de Implementación

- [ ] Actualizar `types/index.ts` con nuevas interfaces
- [ ] Configurar permisos en `AndroidManifest.xml`
- [ ] Configurar permisos en `Info.plist` (iOS)
- [ ] Crear `phone.utils.ts`
- [ ] Crear `phone-call.service.ts`
- [ ] Crear `CallButton.tsx`
- [ ] Modificar `AlumnoScreen.tsx` (agregar import y botón)
- [ ] Modificar `ProfesorScreen.tsx` (agregar import y botón)
- [ ] Verificar datos mock tienen teléfonos
- [ ] Compilar y probar en dispositivo real
- [ ] Probar llamadas con confirmación
- [ ] Probar cancelación de llamadas
- [ ] Verificar botón NO aparece si no hay teléfono

---

**✅ Guía Completa - Lista para Implementar**

Esta guía mantiene la estructura existente de tu proyecto y agrega las llamadas telefónicas de forma modular y limpia, sin romper ningún código existente.
