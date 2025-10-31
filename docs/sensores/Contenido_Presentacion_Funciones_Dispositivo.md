# Contenido para Presentación: Funciones Básicas del Dispositivo
## Tema 3.1 - Llamadas, Enlaces y Contactos en React Native

---

## 📊 DIAPOSITIVA 1: PORTADA
**Título Principal:** Unidad 3.1  
**Subtítulo:** Uso de Funciones Básicas del Dispositivo  
**Elementos:** Llamadas • Enlaces • Contactos

**Elementos Visuales:**
```
[ÍCONO GRANDE DE SMARTPHONE EN EL CENTRO]
     📱
Alrededor del smartphone, 3 círculos con íconos:
- 📞 Llamadas
- 🔗 Enlaces  
- 👥 Contactos
```

**Texto inferior:**
- React Native + TypeScript
- Programación Móvil
- [Tu nombre/institución]

---

## 📊 DIAPOSITIVA 2: OBJETIVOS DE APRENDIZAJE

**Título:** 🎯 Objetivos de Aprendizaje

**Contenido en tarjetas:**

```
┌─────────────────────────────────────┐
│  1️⃣ COMPRENDER                      │
│  Las APIs nativas del dispositivo   │
│  y su integración en React Native   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  2️⃣ IMPLEMENTAR                     │
│  Funcionalidad de llamadas          │
│  telefónicas con validación         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  3️⃣ INTEGRAR                        │
│  Enlaces externos y apertura de     │
│  URLs en aplicaciones móviles       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  4️⃣ GESTIONAR                       │
│  Acceso a contactos del dispositivo │
│  con permisos adecuados             │
└─────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 3: ¿QUÉ SON LAS FUNCIONES BÁSICAS DEL DISPOSITIVO?

**Título:** 📱 Funciones Básicas del Dispositivo

**Diagrama de categorías:**

```
┌──────────────────────────────────────────────────────────┐
│                   DISPOSITIVO MÓVIL                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ COMUNICACIÓN│  │ NAVEGACIÓN  │  │   DATOS     │    │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤    │
│  │ • Llamadas  │  │ • Enlaces   │  │ • Contactos │    │
│  │ • SMS       │  │ • Web       │  │ • Calendario│    │
│  │ • Email     │  │ • Mapas     │  │ • Archivos  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Nota al pie:**
"Son capacidades nativas del sistema operativo accesibles mediante APIs"

---

## 📊 DIAPOSITIVA 4: ARQUITECTURA DE INTEGRACIÓN

**Título:** 🏗️ Arquitectura de Integración

**Diagrama en capas:**

```
┌────────────────────────────────────────────────────┐
│         CAPA DE PRESENTACIÓN (UI)                  │
│                                                    │
│  [Componente React]  →  [Botón Llamar] 📞        │
└────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────┐
│         CAPA DE LÓGICA DE NEGOCIO                  │
│                                                    │
│  [Servicios TypeScript]  →  phoneCallService      │
└────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────┐
│         CAPA DE APIs NATIVAS                       │
│                                                    │
│  [React Native Linking API]  →  tel://           │
└────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────┐
│         SISTEMA OPERATIVO (iOS/Android)            │
│                                                    │
│  [Marcador Telefónico Nativo] 📱                  │
└────────────────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 5: TEMA PRINCIPAL - LLAMADAS TELEFÓNICAS

**Título:** 📞 Implementación de Llamadas Telefónicas

**Diagrama de flujo simplificado:**

```
INICIO
  ↓
[Usuario presiona botón "Llamar"]
  ↓
¿Número válido? → NO → [Mostrar error]
  ↓ SÍ                      ↓
[Formatear número]        FIN
  ↓
[Mostrar confirmación]
  ↓
¿Usuario confirma? → NO → [Cancelar]
  ↓ SÍ                      ↓
[Abrir marcador]          FIN
  ↓
[Llamada iniciada]
  ↓
FIN
```

**Características clave:**
- ✅ Validación automática
- ✅ Formateo mexicano (+52)
- ✅ Confirmación de usuario
- ✅ Manejo de errores

---

## 📊 DIAPOSITIVA 6: ESTRUCTURA DEL PROYECTO

**Título:** 📁 Estructura de Archivos del Proyecto

**Diagrama de árbol con colores:**

```
proyecto-app/
│
├── 📂 types/
│   └── 📄 index.ts ················· (MODIFICADO) 🟡
│       └── + Interfaces de llamadas
│
├── 📂 src/
│   ├── 📂 services/ ············· (NUEVA CARPETA) 🟢
│   │   └── 📂 phone/
│   │       ├── 📄 phone.utils.ts ······ (NUEVO) 🟢
│   │       │   └── Utilidades de formato
│   │       └── 📄 phone-call.service.ts · (NUEVO) 🟢
│   │           └── Lógica de llamadas
│   │
│   ├── 📂 components/ ··········· (MODIFICADO) 🟡
│   │   └── 📂 phone/ ·········· (NUEVA CARPETA) 🟢
│   │       └── 📄 CallButton.tsx ······ (NUEVO) 🟢
│   │           └── Componente de botón
│   │
│   └── 📂 screens/ ··············· (MODIFICADO) 🟡
│       ├── 📂 alumnos/
│       │   └── 📄 AlumnoScreen.tsx ··· (MODIFICADO) 🟡
│       │       └── + CallButton integrado
│       └── 📂 profesores/
│           └── 📄 ProfesorScreen.tsx · (MODIFICADO) 🟡
│               └── + CallButton integrado
│
└── 📂 android/ios/ ············· (CONFIGURACIÓN) 🟣
    └── Permisos del sistema

Leyenda:
🟢 Archivo NUEVO
🟡 Archivo MODIFICADO
🟣 Configuración del sistema
```

---

## 📊 DIAPOSITIVA 7: PASO 1 - TIPOS Y INTERFACES

**Título:** 🔤 Paso 1: Definir Tipos TypeScript

**Código visual con anotaciones:**

```typescript
// types/index.ts

┌─────────────────────────────────────────────────┐
│ export interface CallOptions {                  │
│   phoneNumber: string;  ← Número a marcar      │
│   prompt?: boolean;     ← Mostrar confirmación │
│ }                                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ export interface CallResult {                   │
│   success: boolean;     ← ¿Llamada exitosa?    │
│   error?: string;       ← Mensaje de error     │
│   phoneNumber: string;  ← Número marcado       │
│ }                                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ export enum CallStatus {                        │
│   IDLE = 'idle',        ← En espera            │
│   DIALING = 'dialing',  ← Marcando             │
│   CONNECTED = 'connected' ← Conectado          │
│ }                                               │
└─────────────────────────────────────────────────┘
```

**Beneficios:**
- ✅ Autocompletado en IDE
- ✅ Detección de errores
- ✅ Documentación automática

---

## 📊 DIAPOSITIVA 8: PASO 2 - UTILIDADES DE FORMATO

**Título:** 🔧 Paso 2: Utilidades de Formato

**Ejemplo visual de transformación:**

```
┌──────────────────────────────────────────────────┐
│         TRANSFORMACIÓN DE NÚMEROS                │
├──────────────────────────────────────────────────┤
│                                                  │
│  ENTRADA (raw)          PROCESO         SALIDA   │
│                                                  │
│  4431234567      →  [cleanPhoneNumber]  →       │
│                  →  [formatMexicanPhone] →       │
│                  →  [getDialableNumber]  →       │
│                                                  │
│                     +52 443 123 4567             │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Funciones principales:**

```typescript
PhoneUtils
├── cleanPhoneNumber()     // Quita caracteres especiales
├── formatMexicanPhone()   // Formato visual bonito
├── isValidPhone()         // Valida el número
└── getDialableNumber()    // Listo para marcar
```

**Ejemplo real:**
```
Input:  "(443) 123-4567"
Clean:  "4431234567"
Format: "+52 443 123 4567"
Dial:   "+524431234567"
```

---

## 📊 DIAPOSITIVA 9: PASO 3 - SERVICIO DE LLAMADAS

**Título:** ⚙️ Paso 3: Servicio de Llamadas

**Diagrama de clase (simplificado):**

```
┌────────────────────────────────────────┐
│     PhoneCallService (Singleton)       │
├────────────────────────────────────────┤
│ Properties:                            │
│ - currentStatus: CallStatus            │
│                                        │
│ Methods:                               │
│ + makeCall(options) → CallResult       │
│ + showCallConfirmation() → Promise     │
│ + canMakeCall() → Promise<boolean>     │
└────────────────────────────────────────┘
```

**Flujo del método makeCall():**

```
makeCall(options)
    ↓
[1] Validar número
    ↓
[2] Formatear número
    ↓
[3] Mostrar confirmación (si prompt=true)
    ↓
[4] Construir URL: tel:+524431234567
    ↓
[5] Verificar canOpenURL()
    ↓
[6] Abrir con Linking.openURL()
    ↓
[7] Retornar CallResult
```

---

## 📊 DIAPOSITIVA 10: PASO 4 - COMPONENTE UI

**Título:** 🎨 Paso 4: Componente CallButton

**Anatomía del componente:**

```
┌──────────────────────────────────────────────┐
│           CallButton Component               │
├──────────────────────────────────────────────┤
│                                              │
│  Props:                                      │
│  ├─ phoneNumber: string  (requerido)        │
│  ├─ label?: string       (opcional)         │
│  ├─ compact?: boolean    (opcional)         │
│  └─ showPrompt?: boolean (opcional)         │
│                                              │
│  Estado:                                     │
│  └─ isLoading: boolean                      │
│                                              │
│  Renderizado:                                │
│                                              │
│  Modo Normal:        Modo Compacto:         │
│  ┌──────────┐        ┌────┐                 │
│  │ 📞 Llamar│        │ 📞 │                 │
│  └──────────┘        └────┘                 │
│                                              │
└──────────────────────────────────────────────┘
```

**Estados visuales:**

```
Estado Idle:     [📞 Llamar]  ← Verde
Estado Loading:  [⏳ ...]     ← Verde con spinner
Estado Disabled: [📞 Llamar]  ← Gris
```

---

## 📊 DIAPOSITIVA 11: PASO 5 - INTEGRACIÓN EN PANTALLAS

**Título:** 🔌 Paso 5: Integración en Pantallas

**Antes y Después:**

```
╔════════════════════════════════════════╗
║            ANTES                       ║
╠════════════════════════════════════════╣
║  [Foto] Dr. Juan Pérez                ║
║         ISC - IA                       ║
║         📧 juan@escuela.mx             ║
║         📱 443 123 4567                ║
║                                        ║
║  [👁️ Ver] [✏️ Editar] [🗑️ Eliminar]   ║
╚════════════════════════════════════════╝

              ↓ MODIFICACIÓN

╔════════════════════════════════════════╗
║            DESPUÉS                     ║
╠════════════════════════════════════════╣
║  [Foto] Dr. Juan Pérez                ║
║         ISC - IA                       ║
║         📧 juan@escuela.mx             ║
║         📱 443 123 4567                ║
║                                        ║
║  [📞] [👁️ Ver] [✏️ Editar] [🗑️ Eliminar] ║
║   ↑                                    ║
║   NUEVO BOTÓN                          ║
╚════════════════════════════════════════╝
```

**Código de integración:**

```typescript
// Agregar import
import { CallButton } from '../../components/phone/CallButton';

// En el render del item
{profesor.telefono && (
  <CallButton
    phoneNumber={profesor.telefono}
    compact={true}
    showPrompt={true}
  />
)}
```

---

## 📊 DIAPOSITIVA 12: PERMISOS DEL SISTEMA

**Título:** 🔐 Configuración de Permisos

**Comparativa Android vs iOS:**

```
┌─────────────────────────┬─────────────────────────┐
│       ANDROID           │         iOS             │
├─────────────────────────┼─────────────────────────┤
│                         │                         │
│ AndroidManifest.xml     │ Info.plist              │
│                         │                         │
│ <uses-permission        │ <key>LSApplication      │
│   android:name=         │   QueriesSchemes</key>  │
│   "android.permission.  │ <array>                 │
│   CALL_PHONE" />        │   <string>tel</string>  │
│                         │   <string>telprompt     │
│                         │   </string>             │
│ ✅ Solicitar en runtime │ </array>                │
│ ✅ Android 6.0+         │                         │
│                         │ ✅ Automático           │
│                         │ ✅ Todas las versiones  │
└─────────────────────────┴─────────────────────────┘
```

**Proceso de solicitud (Android):**

```
Usuario abre app por primera vez
         ↓
App solicita permiso CALL_PHONE
         ↓
    ┌────────────────┐
    │  [Permitir]    │
    │  [Denegar]     │
    └────────────────┘
         ↓
Permiso guardado para futuras llamadas
```

---

## 📊 DIAPOSITIVA 13: FLUJO COMPLETO DE LLAMADA

**Título:** 🔄 Flujo Completo de una Llamada

**Diagrama de secuencia:**

```
Usuario          CallButton       Service          Sistema
  │                  │               │                │
  ├─[Click]──────────►               │                │
  │                  │               │                │
  │                  ├─makeCall()────►                │
  │                  │               │                │
  │                  │               ├─validate()     │
  │                  │               ├─format()       │
  │                  │               │                │
  │◄─────────────────┴─[Diálogo]────┤                │
  │                                  │                │
  ├─[Confirmar]─────────────────────►                │
  │                                  │                │
  │                                  ├─openURL()─────►
  │                                  │                │
  │                                  │    [Marcador]  │
  │◄─────────────────────────────────┴────Abierto────┤
  │                                                   │
  └───────────────────────────────────────────────────┘
```

**Tiempos estimados:**
- Validación: ~10ms
- Confirmación: Variable (usuario)
- Apertura marcador: ~100-300ms

---

## 📊 DIAPOSITIVA 14: ESTRUCTURA DE CAMBIOS VISUAL

**Título:** 📊 Resumen Visual de Cambios

**Diagrama de impacto:**

```
┌───────────────────────────────────────────────────┐
│           IMPACTO EN EL PROYECTO                  │
├───────────────────────────────────────────────────┤
│                                                   │
│  📁 3 Archivos NUEVOS          🟢 🟢 🟢          │
│     (Servicios + Componente)                      │
│                                                   │
│  📝 5 Archivos MODIFICADOS     🟡 🟡 🟡 🟡 🟡    │
│     (Pantallas + Config)                          │
│                                                   │
│  🗑️ 0 Archivos ELIMINADOS                        │
│                                                   │
│  ⚠️ 0 Breaking Changes                           │
│                                                   │
├───────────────────────────────────────────────────┤
│  IMPACTO: BAJO ✅                                 │
│  RIESGO:  MÍNIMO ✅                               │
│  TIEMPO:  ~2 horas ✅                             │
└───────────────────────────────────────────────────┘
```

**Mapa de dependencias:**

```
        types/index.ts
             ↓
    phone-call.service.ts
             ↓
        CallButton.tsx
         ↙        ↘
AlumnoScreen  ProfesorScreen
```

---

## 📊 DIAPOSITIVA 15: DEMO EN VIVO - PASO A PASO

**Título:** 🎬 Demostración en Vivo

**Pasos de la demo:**

```
┌────────────────────────────────────────────────┐
│  DEMO: Realizar una Llamada                    │
├────────────────────────────────────────────────┤
│                                                │
│  1️⃣ Abrir app y navegar a "Profesores"        │
│     Mostrar lista de profesores                │
│                                                │
│  2️⃣ Identificar botón verde de llamada 📞     │
│     Señalar ubicación en la card               │
│                                                │
│  3️⃣ Presionar botón de llamada                │
│     Observar diálogo de confirmación           │
│                                                │
│  4️⃣ Confirmar llamada                         │
│     Ver número formateado                      │
│                                                │
│  5️⃣ Verificar apertura del marcador           │
│     Mostrar marcador con número listo          │
│                                                │
│  6️⃣ Cancelar desde marcador                   │
│     Regresar a la app                          │
│                                                │
└────────────────────────────────────────────────┘
```

**Puntos a destacar:**
- Validación automática ✅
- Formateo visual ✅
- Experiencia fluida ✅

---

## 📊 DIAPOSITIVA 16: VALIDACIÓN Y PRUEBAS

**Título:** 🧪 Estrategia de Pruebas

**Matriz de pruebas:**

```
┌─────────────────┬──────────┬──────────┬─────────┐
│ Caso de Prueba  │ Android  │   iOS    │ Estado  │
├─────────────────┼──────────┼──────────┼─────────┤
│ Número válido   │    ✅    │    ✅    │   OK    │
│ Número inválido │    ✅    │    ✅    │   OK    │
│ Sin número      │    ✅    │    ✅    │   OK    │
│ Cancelar        │    ✅    │    ✅    │   OK    │
│ Sin permisos    │    ✅    │    N/A   │   OK    │
│ Sin conexión    │    ✅    │    ✅    │   OK    │
└─────────────────┴──────────┴──────────┴─────────┘
```

**Checklist de validación:**

```
□ El botón aparece solo si hay teléfono
□ El número se formatea correctamente
□ La confirmación se muestra
□ El marcador se abre
□ Los errores se manejan adecuadamente
□ Funciona en ambas pantallas (Alumnos/Profesores)
□ Los permisos están configurados
□ No hay crashes ni errores en consola
```

---

## 📊 DIAPOSITIVA 17: MANEJO DE ERRORES

**Título:** ⚠️ Manejo de Errores

**Tipos de errores y soluciones:**

```
┌────────────────────────────────────────────────┐
│ ERROR                │ MANEJO                  │
├────────────────────────────────────────────────┤
│                                                │
│ Número inválido      → Mensaje descriptivo    │
│                      → No intenta llamar       │
│                                                │
│ Sin permisos         → Solicita permisos       │
│   (Android)          → Guía al usuario         │
│                                                │
│ Dispositivo          → Mensaje informativo     │
│   sin capacidad      → Oculta funcionalidad    │
│                                                │
│ Usuario cancela      → Sin mensaje de error    │
│                      → Regresa a app           │
│                                                │
│ Error de sistema     → Log para debugging      │
│                      → Mensaje genérico        │
│                                                │
└────────────────────────────────────────────────┘
```

**Ejemplo de manejo:**

```typescript
try {
  const result = await phoneCallService.makeCall({
    phoneNumber: profesor.telefono
  });
  
  if (!result.success) {
    // Mostrar error amigable
    Alert.alert('Error', result.error);
  }
} catch (error) {
  // Log para desarrollador
  console.error('Error inesperado:', error);
  // Mensaje para usuario
  Alert.alert('Error', 'No se pudo realizar la llamada');
}
```

---

## 📊 DIAPOSITIVA 18: BUENAS PRÁCTICAS

**Título:** ✨ Buenas Prácticas Implementadas

**Lista con íconos:**

```
✅ SEPARACIÓN DE RESPONSABILIDADES
   UI → Componente
   Lógica → Servicio
   Datos → Tipos

✅ PATRÓN SINGLETON
   Una sola instancia del servicio
   Estado centralizado

✅ TIPADO FUERTE (TypeScript)
   Interfaces bien definidas
   Detección temprana de errores

✅ VALIDACIÓN PROACTIVA
   Verificar antes de ejecutar
   Feedback inmediato al usuario

✅ MANEJO DEFENSIVO
   Try-catch en operaciones críticas
   Valores por defecto

✅ EXPERIENCIA DE USUARIO
   Confirmaciones antes de acciones
   Estados visuales claros
   Mensajes descriptivos

✅ CÓDIGO REUTILIZABLE
   Componente parametrizable
   Utilidades genéricas

✅ DOCUMENTACIÓN
   Comentarios JSDoc
   README actualizado
```

---

## 📊 DIAPOSITIVA 19: EXTENSIBILIDAD

**Título:** 🚀 Extensiones Futuras

**Roadmap de mejoras:**

```
FASE 1 (ACTUAL)           FASE 2                FASE 3
     │                       │                     │
     ├─ Llamadas básicas     ├─ Historial         ├─ Videollamadas
     ├─ Validación           │  de llamadas       ├─ Integración
     └─ Confirmación         ├─ Llamadas          │  con CRM
                             │  favoritas         └─ Analytics
                             └─ Compartir
                                contacto
```

**Posibles mejoras:**

```
┌──────────────────────────────────────────┐
│ 📊 Estadísticas de llamadas              │
│    - Duración                            │
│    - Frecuencia                          │
│    - Contactos más llamados              │
│                                          │
│ 🔔 Notificaciones                        │
│    - Recordatorios de llamadas           │
│    - Llamadas perdidas                   │
│                                          │
│ 💾 Almacenamiento local                  │
│    - Cache de contactos                  │
│    - Preferencias de usuario             │
│                                          │
│ 🌐 Integración con servicios             │
│    - WhatsApp                            │
│    - Telegram                            │
│    - Skype                               │
└──────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 20: COMPARATIVA CON OTRAS FUNCIONALIDADES

**Título:** 📊 Llamadas vs Enlaces vs Contactos

**Tabla comparativa:**

```
┌───────────────┬─────────┬─────────┬──────────┐
│ Característica│ Llamadas│ Enlaces │ Contactos│
├───────────────┼─────────┼─────────┼──────────┤
│ Complejidad   │  Media  │  Baja   │   Alta   │
│ Permisos      │   Sí    │   No    │    Sí    │
│ APIs Nativas  │ Linking │ Linking │ Contacts │
│ Confirmación  │   Sí    │   No    │    Sí    │
│ Validación    │   Sí    │   Sí    │    No    │
│ Offline       │   Sí    │   No    │    Sí    │
└───────────────┴─────────┴─────────┴──────────┘
```

**Similitudes:**

```
Todas usan:
├── APIs nativas de React Native
├── TypeScript para tipos
├── Patrones similares de implementación
└── Principios de UX consistentes
```

---

## 📊 DIAPOSITIVA 21: TROUBLESHOOTING COMÚN

**Título:** 🔧 Solución de Problemas Comunes

**Guía de diagnóstico:**

```
PROBLEMA → DIAGNÓSTICO → SOLUCIÓN

❌ Botón no aparece
   └─ ¿El contacto tiene teléfono?
      ├─ No → Agregar campo telefono
      └─ Sí → Verificar render condicional

❌ Error al llamar
   └─ ¿Qué error muestra?
      ├─ "Inválido" → Verificar formato
      ├─ "No se puede" → Verificar permisos
      └─ Otro → Revisar logs

❌ Permisos denegados (Android)
   └─ ¿Configurado AndroidManifest?
      ├─ No → Agregar permiso
      └─ Sí → Solicitar en runtime

❌ No abre marcador (iOS)
   └─ ¿Configurado Info.plist?
      ├─ No → Agregar esquemas
      └─ Sí → Verificar URL format

❌ TypeScript muestra errores
   └─ ¿Tipos importados correctamente?
      ├─ No → Revisar imports
      └─ Sí → Limpiar caché
```

---

## 📊 DIAPOSITIVA 22: EJERCICIO PRÁCTICO

**Título:** 💪 Ejercicio Práctico

**Reto para estudiantes:**

```
┌────────────────────────────────────────────────┐
│  EJERCICIO: Agregar Botón de WhatsApp          │
├────────────────────────────────────────────────┤
│                                                │
│  Objetivo:                                     │
│  Crear un botón que abra WhatsApp con          │
│  el número del contacto                        │
│                                                │
│  Requisitos:                                   │
│  1. Usar Linking API                           │
│  2. Formato: whatsapp://send?phone=...         │
│  3. Validar que WhatsApp está instalado        │
│  4. Componente reutilizable                    │
│  5. Integrar en las pantallas existentes       │
│                                                │
│  Tiempo estimado: 45 minutos                   │
│                                                │
│  Pistas:                                       │
│  - Reutilizar PhoneUtils                       │
│  - Similar a CallButton                        │
│  - URL: whatsapp://send?phone=524431234567     │
│                                                │
└────────────────────────────────────────────────┘
```

**Esqueleto de código:**

```typescript
export const WhatsAppButton: React.FC<Props> = ({
  phoneNumber
}) => {
  const handlePress = async () => {
    // TODO: Implementar lógica
    const url = `whatsapp://send?phone=${...}`;
    // ...
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      {/* TODO: Agregar ícono de WhatsApp */}
    </TouchableOpacity>
  );
};
```

---

## 📊 DIAPOSITIVA 23: RECURSOS Y DOCUMENTACIÓN

**Título:** 📚 Recursos Adicionales

**Enlaces importantes:**

```
┌────────────────────────────────────────────┐
│ 📖 DOCUMENTACIÓN OFICIAL                   │
├────────────────────────────────────────────┤
│                                            │
│ React Native Linking API                  │
│ → reactnative.dev/docs/linking            │
│                                            │
│ TypeScript con React Native               │
│ → reactnative.dev/docs/typescript         │
│                                            │
│ Android Permissions                        │
│ → reactnative.dev/docs/permissionsandroid │
│                                            │
│ iOS Info.plist Configuration              │
│ → developer.apple.com/documentation       │
│                                            │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 💻 REPOSITORIO DEL PROYECTO                │
├────────────────────────────────────────────┤
│                                            │
│ GitHub: [tu-usuario]/app-gestion-escolar  │
│                                            │
│ Incluye:                                   │
│ - Código completo                          │
│ - Documentación                            │
│ - Ejemplos adicionales                     │
│ - Issues y discusiones                     │
│                                            │
└────────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 24: SIGUIENTES TEMAS

**Título:** ⏭️ Próximos Temas de la Unidad 3

**Roadmap visual:**

```
UNIDAD 3: Funciones Avanzadas del Dispositivo

✅ 3.1 Funciones Básicas
    ├─ Llamadas ✅ (ACTUAL)
    ├─ Enlaces (próximo)
    └─ Contactos (próximo)

⏭️ 3.2 Cámara e Imágenes
    ├─ Captura de fotos
    ├─ Selección de galería
    └─ Manipulación de imágenes

⏭️ 3.3 Sensores
    ├─ Acelerómetro
    └─ Giroscopio

⏭️ 3.4 Geolocalización
    ├─ GPS
    └─ Mapas

⏭️ 3.5 Realidad Aumentada
    └─ Demo AR

⏭️ 3.6-3.7 APIs y Servicios
    ├─ Firebase
    └─ APIs REST
```

---

## 📊 DIAPOSITIVA 25: PREGUNTAS Y RESPUESTAS

**Título:** ❓ Preguntas Frecuentes

**Q&A visual:**

```
┌────────────────────────────────────────────────┐
│ Q: ¿Funciona en emuladores?                    │
│ A: Limitado. Mejor usar dispositivos reales.   │
│                                                │
│ Q: ¿Puedo llamar sin confirmación?             │
│ A: Sí, configurar showPrompt={false}          │
│                                                │
│ Q: ¿Funciona internacionalmente?               │
│ A: Sí, ajustar formateo de números            │
│                                                │
│ Q: ¿Qué pasa si no hay teléfono?              │
│ A: El botón no se renderiza (condicional)     │
│                                                │
│ Q: ¿Cuánto tiempo toma implementar?           │
│ A: ~2 horas para desarrollador junior         │
│                                                │
│ Q: ¿Es compatible con Expo?                   │
│ A: Sí, funciona con Expo y bare React Native  │
└────────────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 26: ACTIVIDAD DE CIERRE

**Título:** 🎯 Actividad de Cierre

**Quiz interactivo:**

```
┌────────────────────────────────────────────┐
│ QUIZ: Verdadero o Falso                    │
├────────────────────────────────────────────┤
│                                            │
│ 1. Linking API requiere instalación       │
│    de paquetes externos                    │
│    [ ] V  [ ] F                           │
│                                            │
│ 2. iOS requiere configuración en           │
│    Info.plist para llamadas                │
│    [ ] V  [ ] F                           │
│                                            │
│ 3. TypeScript es opcional pero             │
│    recomendado                             │
│    [ ] V  [ ] F                           │
│                                            │
│ 4. Las llamadas funcionan sin permisos     │
│    en Android                              │
│    [ ] V  [ ] F                           │
│                                            │
│ 5. El patrón Singleton asegura una         │
│    única instancia del servicio            │
│    [ ] V  [ ] F                           │
│                                            │
└────────────────────────────────────────────┘

Respuestas: 1-F, 2-V, 3-V, 4-F, 5-V
```

---

## 📊 DIAPOSITIVA 27: RESUMEN EJECUTIVO

**Título:** 📝 Resumen de la Sesión

**Puntos clave:**

```
┌────────────────────────────────────────────┐
│ ✅ APRENDIMOS                              │
├────────────────────────────────────────────┤
│                                            │
│ • Qué son las funciones básicas            │
│   del dispositivo                          │
│                                            │
│ • Arquitectura de integración              │
│   en capas                                 │
│                                            │
│ • Implementación completa de               │
│   llamadas telefónicas                     │
│                                            │
│ • Configuración de permisos                │
│   Android/iOS                              │
│                                            │
│ • Buenas prácticas y patrones              │
│                                            │
│ • Manejo de errores y validación           │
│                                            │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 🎯 LOGRAMOS                                │
├────────────────────────────────────────────┤
│                                            │
│ ✓ Funcionalidad completa de llamadas      │
│ ✓ Código modular y reutilizable           │
│ ✓ Integración con proyecto existente      │
│ ✓ Preparación para funciones similares    │
│                                            │
└────────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 28: TAREA / PROYECTO

**Título:** 📋 Tarea para la Próxima Sesión

**Descripción del proyecto:**

```
┌────────────────────────────────────────────────┐
│ PROYECTO: Implementar Enlaces Web              │
├────────────────────────────────────────────────┤
│                                                │
│ Objetivo:                                      │
│ Agregar funcionalidad para abrir enlaces      │
│ externos (sitios web, redes sociales)          │
│                                                │
│ Requisitos:                                    │
│ 1. Agregar campo 'website' a Profesor/Alumno  │
│ 2. Crear LinkButton component                 │
│ 3. Validar URLs antes de abrir                │
│ 4. Manejar esquemas: http, https, mailto      │
│ 5. Integrar en ambas pantallas                │
│                                                │
│ Entregables:                                   │
│ □ Código funcional                            │
│ □ Capturas de pantalla                        │
│ □ Documentación de cambios                    │
│ □ Video demo (opcional, +puntos)              │
│                                                │
│ Fecha de entrega: [Definir]                   │
│ Valor: [Definir puntos]                       │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 29: RETROALIMENTACIÓN

**Título:** 💭 Retroalimentación de la Sesión

**Encuesta rápida:**

```
Califica del 1-5:

😕 😐 🙂 😊 😄
1  2  3  4  5

┌─────────────────────────────────────┐
│ Claridad de la explicación    [___] │
│ Utilidad del contenido         [___] │
│ Calidad de los ejemplos        [___] │
│ Ritmo de la clase             [___] │
│ Aplicabilidad práctica        [___] │
└─────────────────────────────────────┘

Comentarios adicionales:
_________________________________________
_________________________________________
_________________________________________
```

---

## 📊 DIAPOSITIVA 30: CIERRE

**Título:** 🎓 ¡Gracias!

**Contenido visual:**

```
┌────────────────────────────────────────────┐
│                                            │
│          ✅ SESIÓN COMPLETADA              │
│                                            │
│     🎯 Funciones Básicas del Dispositivo   │
│                                            │
│                                            │
│         📞 Llamadas Implementadas          │
│                                            │
│                                            │
│    Próxima sesión: Enlaces y Contactos    │
│                                            │
│                                            │
│          📧 Contacto:                      │
│          [tu-email@escuela.edu.mx]         │
│                                            │
│          💻 Repositorio:                   │
│          github.com/[tu-repo]              │
│                                            │
│                                            │
│        ¡Nos vemos en la próxima clase!     │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🎨 PALETA DE COLORES SUGERIDA PARA CANVA

```
Color Principal:    #6200EA (Púrpura - para títulos)
Color Secundario:   #03DAC6 (Turquesa - para acentos)
Color de Éxito:     #4CAF50 (Verde - para checkmarks)
Color de Alerta:    #FF9800 (Naranja - para warnings)
Color de Error:     #F44336 (Rojo - para errores)
Fondo Claro:        #F5F5F5 (Gris muy claro)
Texto Principal:    #212121 (Gris oscuro)
Texto Secundario:   #757575 (Gris medio)
```

---

## 📐 ELEMENTOS VISUALES RECOMENDADOS

### Íconos a usar:
- 📱 Smartphone
- 📞 Teléfono
- 🔗 Enlace
- 👥 Contactos
- ✅ Checkmark
- ⚙️ Engranaje (configuración)
- 🎯 Objetivo
- 💡 Idea
- ⚠️ Advertencia
- 🔐 Candado (permisos)

### Diagramas:
- Diagramas de flujo con flechas
- Diagramas de capas (arquitectura)
- Árboles de archivos
- Tablas comparativas
- Líneas de tiempo

### Animaciones sugeridas:
- Transiciones de slide (fade, slide)
- Aparición progresiva de elementos
- Zoom en detalles importantes
- Resaltado de código

---

## 📏 DISEÑO Y LAYOUT

### Para cada diapositiva:

```
┌────────────────────────────────────────┐
│  [Logo]              [Número]          │ ← Header
├────────────────────────────────────────┤
│                                        │
│              TÍTULO                    │ ← 40px
│                                        │
│  ┌──────────────────────────────┐    │
│  │                               │    │
│  │      CONTENIDO PRINCIPAL      │    │ ← 80%
│  │                               │    │
│  └──────────────────────────────┘    │
│                                        │
├────────────────────────────────────────┤
│  Tema 3.1 | Funciones del Dispositivo │ ← Footer
└────────────────────────────────────────┘
```

### Tipografía recomendada:
- **Títulos:** Montserrat Bold, 32-40px
- **Subtítulos:** Montserrat SemiBold, 24-28px
- **Cuerpo:** Open Sans Regular, 16-20px
- **Código:** Fira Code, 14-16px

---

## 🎯 NOTAS PARA EL PRESENTADOR

**Diapositiva 1-5 (10 min):**
- Introducción y contexto
- Explicar objetivos claramente
- Mostrar relevancia práctica

**Diapositiva 6-12 (25 min):**
- Detalles técnicos paso a paso
- Mostrar código real
- Pausar para preguntas

**Diapositiva 13-17 (20 min):**
- DEMO EN VIVO
- Ejecutar código
- Mostrar funcionamiento real

**Diapositiva 18-25 (15 min):**
- Buenas prácticas
- Troubleshooting
- Q&A

**Diapositiva 26-30 (10 min):**
- Cierre y resumen
- Asignación de tarea
- Retroalimentación

**Tiempo total:** 80 minutos

---

## ✅ CHECKLIST PARA CANVA

□ Importar paleta de colores
□ Seleccionar fuentes consistentes
□ Preparar íconos y recursos visuales
□ Crear templates reutilizables
□ Ajustar tamaños de texto para legibilidad
□ Verificar contraste de colores
□ Agregar números de página
□ Incluir logo de la institución
□ Preparar versión en PDF
□ Preparar versión editable para alumnos

---

**CONTENIDO COMPLETO PARA 30 DIAPOSITIVAS - LISTO PARA CANVA**
