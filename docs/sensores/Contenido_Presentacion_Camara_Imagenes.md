# Contenido para Presentación: Acceso a Cámara y Manipulación de Imágenes
## Tema 3.2 - Captura, Edición y Almacenamiento de Imágenes en React Native

---

## 📊 DIAPOSITIVA 1: PORTADA
**Título Principal:** Unidad 3.2  
**Subtítulo:** Acceso a la Cámara y Manipulación de Imágenes  
**Elementos:** Captura • Edición • Almacenamiento

**Elementos Visuales:**
```
[ÍCONO GRANDE DE CÁMARA EN EL CENTRO]
     📷
Alrededor de la cámara, 4 círculos con íconos:
- 📸 Captura de Foto
- 🖼️ Galería  
- ✂️ Edición
- 💾 Almacenamiento
```

**Texto inferior:**
- React Native + TypeScript
- Programación Móvil - Tema 3.2
- [Tu nombre/institución]

---

## 📊 DIAPOSITIVA 2: OBJETIVOS DE APRENDIZAJE

**Título:** 🎯 Objetivos de Aprendizaje

**Contenido en tarjetas con gradientes:**

```
┌─────────────────────────────────────────┐
│  1️⃣ IMPLEMENTAR                         │
│  Acceso a la cámara del dispositivo     │
│  y captura de fotografías               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  2️⃣ GESTIONAR                           │
│  Selección de imágenes desde la        │
│  galería del dispositivo                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  3️⃣ MANIPULAR                           │
│  Imágenes: redimensionar, comprimir,   │
│  recortar y optimizar                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  4️⃣ ALMACENAR                           │
│  Imágenes localmente y en la nube      │
│  (Firebase Storage)                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  5️⃣ INTEGRAR                            │
│  Sistema de fotos de perfil en la      │
│  aplicación de gestión escolar          │
└─────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 3: ¿POR QUÉ IMÁGENES EN APPS MÓVILES?

**Título:** 📱 Importancia de las Imágenes en Apps

**Diagrama de casos de uso:**

```
┌──────────────────────────────────────────────────┐
│            CASOS DE USO DE IMÁGENES              │
├──────────────────────────────────────────────────┤
│                                                  │
│  👤 IDENTIFICACIÓN                               │
│  ├─ Fotos de perfil                             │
│  ├─ Credenciales digitales                      │
│  └─ Documentos de identidad                     │
│                                                  │
│  📄 DOCUMENTACIÓN                                │
│  ├─ Comprobantes                                │
│  ├─ Tareas/trabajos                             │
│  └─ Evidencias fotográficas                     │
│                                                  │
│  🎨 CONTENIDO                                    │
│  ├─ Posts de redes sociales                     │
│  ├─ Historias                                   │
│  └─ Multimedia educativo                        │
│                                                  │
│  🔍 ANÁLISIS                                     │
│  ├─ OCR (texto en imágenes)                     │
│  ├─ Reconocimiento facial                       │
│  └─ Códigos QR/Barras                           │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Estadística visual:**
```
📊 85% de las apps usan funcionalidad de cámara
📊 70% permiten selección de galería
📊 60% implementan edición básica
```

---

## 📊 DIAPOSITIVA 4: FLUJO COMPLETO DE TRABAJO CON IMÁGENES

**Título:** 🔄 Ciclo de Vida de una Imagen

**Diagrama de flujo circular:**

```
                    ┌─────────────┐
                    │   ORIGEN    │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         📷 CÁMARA                 🖼️ GALERÍA
              │                         │
              └────────────┬────────────┘
                           │
                    ┌──────▼──────┐
                    │  VALIDACIÓN │
                    │  (Tamaño,   │
                    │   Formato)  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ MANIPULACIÓN│
                    │ (Redimensión│
                    │  Compresión)│
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         💾 LOCAL                   ☁️ NUBE
         (AsyncStorage)           (Firebase)
              │                         │
              └────────────┬────────────┘
                           │
                    ┌──────▼──────┐
                    │   DISPLAY   │
                    │  (Mostrar)  │
                    └─────────────┘
```

---

## 📊 DIAPOSITIVA 5: ARQUITECTURA DE IMPLEMENTACIÓN

**Título:** 🏗️ Arquitectura en Capas

**Diagrama vertical con colores:**

```
┌────────────────────────────────────────────────────┐
│  CAPA DE PRESENTACIÓN (UI)                    🎨  │
│  ┌──────────────────────────────────────────┐     │
│  │ ProfileImagePicker Component             │     │
│  │ ├─ Botón Cámara                         │     │
│  │ ├─ Botón Galería                        │     │
│  │ └─ Vista Previa                         │     │
│  └──────────────────────────────────────────┘     │
└────────────────────────────────────────────────────┘
                       ↓ ↑
┌────────────────────────────────────────────────────┐
│  CAPA DE SERVICIOS (Business Logic)           ⚙️  │
│  ┌──────────────────────────────────────────┐     │
│  │ CameraService                            │     │
│  │ ├─ capturePhoto()                        │     │
│  │ ├─ pickFromGallery()                     │     │
│  │ └─ requestPermissions()                  │     │
│  └──────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────┐     │
│  │ ImageManipulationService                 │     │
│  │ ├─ resizeImage()                         │     │
│  │ ├─ compressImage()                       │     │
│  │ └─ cropImage()                           │     │
│  └──────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────┐     │
│  │ StorageService                           │     │
│  │ ├─ saveLocal()                           │     │
│  │ └─ uploadToCloud()                       │     │
│  └──────────────────────────────────────────┘     │
└────────────────────────────────────────────────────┘
                       ↓ ↑
┌────────────────────────────────────────────────────┐
│  CAPA DE LIBRERÍAS NATIVAS                    📦  │
│  ┌──────────────────────────────────────────┐     │
│  │ expo-image-picker                        │     │
│  │ expo-media-library                       │     │
│  │ expo-image-manipulator                   │     │
│  │ expo-file-system                         │     │
│  └──────────────────────────────────────────┘     │
└────────────────────────────────────────────────────┘
                       ↓ ↑
┌────────────────────────────────────────────────────┐
│  SISTEMA OPERATIVO (iOS/Android)              🔧  │
│  ┌──────────────────────────────────────────┐     │
│  │ Cámara Nativa                            │     │
│  │ Sistema de Archivos                      │     │
│  │ Permisos de Usuario                      │     │
│  └──────────────────────────────────────────┘     │
└────────────────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 6: LIBRERÍAS DISPONIBLES

**Título:** 📦 Ecosistema de Librerías

**Tabla comparativa visual:**

```
┌─────────────────────┬──────────┬──────────┬─────────┐
│     LIBRERÍA        │  EXPO    │ RN CLI   │ TAMAÑO  │
├─────────────────────┼──────────┼──────────┼─────────┤
│ expo-image-picker   │    ✅    │    ❌    │ Pequeño │
│ (Recomendado)       │          │          │         │
├─────────────────────┼──────────┼──────────┼─────────┤
│ react-native-       │    ⚠️    │    ✅    │ Mediano │
│ image-picker        │          │          │         │
├─────────────────────┼──────────┼──────────┼─────────┤
│ react-native-       │    ❌    │    ✅    │ Grande  │
│ image-crop-picker   │          │          │         │
├─────────────────────┼──────────┼──────────┼─────────┤
│ expo-image-         │    ✅    │    ❌    │ Pequeño │
│ manipulator         │          │          │         │
└─────────────────────┴──────────┴──────────┴─────────┘
```

**Decisión del proyecto:**

```
┌────────────────────────────────────────────────┐
│  📦 USAREMOS: expo-image-picker                │
│                                                │
│  ✅ Integrado con Expo                         │
│  ✅ Fácil configuración                        │
│  ✅ Soporta cámara y galería                   │
│  ✅ Manejo de permisos simplificado            │
│  ✅ Compresión automática                      │
│  ✅ Compatible con TypeScript                  │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 7: ESTRUCTURA DEL PROYECTO

**Título:** 📁 Estructura de Archivos - Imágenes

**Diagrama de árbol extendido:**

```
proyecto-app/
│
├── 📂 types/
│   └── 📄 index.ts ················· (MODIFICADO) 🟡
│       └── + Interfaces de imágenes
│
├── 📂 src/
│   ├── 📂 services/ ············· (MODIFICADO) 🟡
│   │   ├── 📂 phone/ ··········· (existente)
│   │   ├── 📂 camera/ ·········· (NUEVA CARPETA) 🟢
│   │   │   ├── 📄 camera.service.ts ····· (NUEVO) 🟢
│   │   │   │   └── Captura y selección
│   │   │   ├── 📄 image-manipulation.service.ts 🟢
│   │   │   │   └── Edición y optimización
│   │   │   └── 📄 permissions.service.ts · (NUEVO) 🟢
│   │   │       └── Manejo de permisos
│   │   └── 📂 storage/ ········· (NUEVA CARPETA) 🟢
│   │       ├── 📄 local-storage.service.ts ·· 🟢
│   │       │   └── Almacenamiento local
│   │       └── 📄 cloud-storage.service.ts · 🟢
│   │           └── Firebase Storage
│   │
│   ├── 📂 components/ ··········· (MODIFICADO) 🟡
│   │   ├── 📂 phone/ ··········· (existente)
│   │   └── 📂 camera/ ·········· (NUEVA CARPETA) 🟢
│   │       ├── 📄 ImagePicker.tsx ········ (NUEVO) 🟢
│   │       │   └── Selector principal
│   │       ├── 📄 ProfileImagePicker.tsx · (NUEVO) 🟢
│   │       │   └── Para fotos de perfil
│   │       ├── 📄 ImagePreview.tsx ······· (NUEVO) 🟢
│   │       │   └── Vista previa
│   │       └── 📄 ImageEditor.tsx ········ (NUEVO) 🟢
│   │           └── Editor simple
│   │
│   ├── 📂 screens/ ··············· (MODIFICADO) 🟡
│   │   ├── 📂 alumnos/
│   │   │   └── 📄 AlumnoScreen.tsx ··· (MODIFICADO) 🟡
│   │   │   └── 📄 AlumnoFormModal.tsx · (MODIFICADO) 🟡
│   │   │       └── + ProfileImagePicker
│   │   └── 📂 profesores/
│   │       └── 📄 ProfesorScreen.tsx · (MODIFICADO) 🟡
│   │           └── + ProfileImagePicker
│   │
│   └── 📂 utils/ ················· (NUEVA CARPETA) 🟢
│       ├── 📄 image-utils.ts ·········· (NUEVO) 🟢
│       │   └── Utilidades de imagen
│       └── 📄 constants.ts ············ (NUEVO) 🟢
│           └── Constantes de configuración
│
├── 📂 assets/
│   └── 📂 placeholders/ ········· (NUEVA CARPETA) 🟢
│       ├── 📄 avatar-placeholder.png ·· (NUEVO) 🟢
│       └── 📄 no-image.png ············ (NUEVO) 🟢
│
└── 📂 android/ios/ ············· (CONFIGURACIÓN) 🟣
    └── Permisos de cámara y galería

Leyenda:
🟢 Archivo/Carpeta NUEVO
🟡 Archivo MODIFICADO
🟣 Configuración del sistema

RESUMEN:
📊 10 archivos NUEVOS
📊 5 archivos MODIFICADOS
📊 3 carpetas NUEVAS
```

---

## 📊 DIAPOSITIVA 8: INSTALACIÓN DE DEPENDENCIAS

**Título:** 📦 Paso 1: Instalación

**Comandos con explicaciones:**

```
┌────────────────────────────────────────────────┐
│  INSTALAR EXPO IMAGE PICKER                    │
├────────────────────────────────────────────────┤
│                                                │
│  $ npx expo install expo-image-picker          │
│                                                │
│  Incluye:                                      │
│  ✅ Acceso a cámara                            │
│  ✅ Acceso a galería                           │
│  ✅ Compresión básica                          │
│  ✅ Manejo de permisos                         │
│                                                │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│  INSTALAR IMAGE MANIPULATOR (Opcional)         │
├────────────────────────────────────────────────┤
│                                                │
│  $ npx expo install expo-image-manipulator     │
│                                                │
│  Para:                                         │
│  ✅ Redimensionar imágenes                     │
│  ✅ Recortar (crop)                            │
│  ✅ Rotar y voltear                            │
│  ✅ Ajustar calidad                            │
│                                                │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│  INSTALAR FILE SYSTEM (Opcional)               │
├────────────────────────────────────────────────┤
│                                                │
│  $ npx expo install expo-file-system           │
│                                                │
│  Para:                                         │
│  ✅ Guardar imágenes localmente                │
│  ✅ Leer información de archivos               │
│  ✅ Copiar/mover archivos                      │
│                                                │
└────────────────────────────────────────────────┘
```

**Verificación:**

```bash
# Verificar instalación
$ npm list expo-image-picker
$ npm list expo-image-manipulator

# Actualizar app.json (si usas Expo)
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Permite acceder a tus fotos"
        }
      ]
    ]
  }
}
```

---

## 📊 DIAPOSITIVA 9: CONFIGURACIÓN DE PERMISOS

**Título:** 🔐 Paso 2: Configuración de Permisos

**Comparativa detallada:**

```
┌────────────────────────────────────────────────────┐
│                    ANDROID                         │
├────────────────────────────────────────────────────┤
│                                                    │
│  📄 android/app/src/main/AndroidManifest.xml      │
│                                                    │
│  <manifest>                                        │
│    <!-- Permisos requeridos -->                   │
│    <uses-permission                               │
│      android:name="android.permission.CAMERA" />  │
│    <uses-permission android:name=                 │
│      "android.permission.READ_EXTERNAL_STORAGE"/> │
│    <uses-permission android:name=                 │
│      "android.permission.WRITE_EXTERNAL_STORAGE"  │
│      android:maxSdkVersion="28" />                │
│                                                    │
│    <!-- Característica opcional -->               │
│    <uses-feature                                  │
│      android:name="android.hardware.camera"       │
│      android:required="false" />                  │
│  </manifest>                                       │
│                                                    │
│  ✅ Android 6.0+: Solicitar en runtime            │
│  ✅ Android 10+: Scoped Storage automático        │
│                                                    │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│                      iOS                           │
├────────────────────────────────────────────────────┤
│                                                    │
│  📄 ios/[Proyecto]/Info.plist                     │
│                                                    │
│  <dict>                                            │
│    <key>NSCameraUsageDescription</key>            │
│    <string>Necesitamos acceso a tu cámara        │
│    para tomar fotos de perfil</string>            │
│                                                    │
│    <key>NSPhotoLibraryUsageDescription</key>      │
│    <string>Necesitamos acceso a tu galería       │
│    para seleccionar fotos</string>                │
│                                                    │
│    <key>NSPhotoLibraryAddUsageDescription</key>   │
│    <string>Necesitamos guardar fotos en tu       │
│    galería</string>                               │
│  </dict>                                           │
│                                                    │
│  ✅ Mensajes claros y específicos                 │
│  ✅ Revisión obligatoria de App Store             │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Flujo de permisos:**

```
App solicita permiso
         ↓
   ┌─────────────┐
   │ iOS/Android │
   │   muestra   │
   │   diálogo   │
   └─────────────┘
         ↓
    [Permitir] [Denegar]
         ↓           ↓
   ✅ Acceso      ❌ Sin acceso
    otorgado       (mostrar mensaje)
```

---

## 📊 DIAPOSITIVA 10: TIPOS TYPESCRIPT

**Título:** 🔤 Paso 3: Definir Tipos

**Interfaces principales:**

```typescript
// types/index.ts

┌──────────────────────────────────────────────┐
│ // Opciones de selección de imagen          │
│ export interface ImagePickerOptions {        │
│   mediaTypes: 'Images' | 'Videos' | 'All';  │
│   allowsEditing: boolean; ← Recortar        │
│   aspect?: [number, number]; ← Ratio        │
│   quality: number; ← 0-1 (compresión)       │
│   base64?: boolean; ← Incluir base64        │
│ }                                            │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ // Resultado de selección                   │
│ export interface ImagePickerResult {         │
│   success: boolean;                          │
│   uri?: string; ← Ruta local                │
│   base64?: string; ← Dato en base64         │
│   width?: number;                            │
│   height?: number;                           │
│   fileSize?: number; ← Tamaño en bytes      │
│   cancelled?: boolean;                       │
│   error?: string;                            │
│ }                                            │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ // Información de imagen                     │
│ export interface ImageInfo {                 │
│   uri: string;                               │
│   width: number;                             │
│   height: number;                            │
│   format: 'jpeg' | 'png' | 'gif' | 'webp'; │
│   fileSize: number;                          │
│   exif?: any; ← Metadatos                   │
│   base64?: string;                           │
│ }                                            │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ // Opciones de manipulación                 │
│ export interface ImageManipulation {         │
│   resize?: { width: number; height: number };│
│   compress?: number; ← 0-1                  │
│   format?: 'jpeg' | 'png';                  │
│   crop?: {                                   │
│     originX: number;                         │
│     originY: number;                         │
│     width: number;                           │
│     height: number;                          │
│   };                                         │
│ }                                            │
└──────────────────────────────────────────────┘
```

**Extensión de interfaces existentes:**

```typescript
┌──────────────────────────────────────────────┐
│ // Actualizar interfaz Alumno               │
│ export interface Alumno extends BaseEntity { │
│   // ... campos existentes                  │
│   fotoPerfil?: string; ← URI o URL          │
│   fotoPerfilThumb?: string; ← Thumbnail     │
│   credencialFoto?: string; ← Credencial     │
│   documentos?: ImageInfo[]; ← Varios docs   │
│ }                                            │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ // Actualizar interfaz Profesor             │
│ export interface Profesor extends BaseEntity{│
│   // ... campos existentes                  │
│   fotoPerfil?: string;                       │
│   fotoPerfilThumb?: string;                  │
│ }                                            │
└──────────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 11: SERVICIO DE PERMISOS

**Título:** 🔐 Paso 4: Servicio de Permisos

**Código del servicio:**

```typescript
// src/services/camera/permissions.service.ts

┌────────────────────────────────────────────────┐
│ import * as ImagePicker from 'expo-image-picker';│
│                                                │
│ export class PermissionsService {              │
│                                                │
│   // Solicitar permisos de cámara            │
│   static async requestCameraPermission() {    │
│     const { status } = await ImagePicker      │
│       .requestCameraPermissionsAsync();       │
│     return status === 'granted';              │
│   }                                            │
│                                                │
│   // Solicitar permisos de galería           │
│   static async requestGalleryPermission() {   │
│     const { status } = await ImagePicker      │
│       .requestMediaLibraryPermissionsAsync(); │
│     return status === 'granted';              │
│   }                                            │
│                                                │
│   // Verificar permisos                      │
│   static async checkCameraPermission() {      │
│     const { status } = await ImagePicker      │
│       .getCameraPermissionsAsync();           │
│     return status === 'granted';              │
│   }                                            │
│                                                │
│   // Solicitar todos los permisos            │
│   static async requestAllPermissions() {      │
│     const camera = await this                 │
│       .requestCameraPermission();             │
│     const gallery = await this                │
│       .requestGalleryPermission();            │
│     return { camera, gallery };               │
│   }                                            │
│ }                                              │
└────────────────────────────────────────────────┘
```

**Diagrama de flujo de permisos:**

```
Usuario intenta usar cámara
         ↓
¿Permiso ya otorgado?
    ↓ NO        ↓ SÍ
Solicitar    Proceder
    ↓            ↓
¿Otorga?     Abrir cámara
    ↓ SÍ
Proceder
    ↓ NO
Mostrar mensaje explicativo
    ↓
Ofrecer ir a configuración
```

---

## 📊 DIAPOSITIVA 12: SERVICIO DE CÁMARA

**Título:** 📷 Paso 5: Servicio de Cámara

**Implementación completa:**

```typescript
// src/services/camera/camera.service.ts

export class CameraService {
  
  ┌─────────────────────────────────────────┐
  │ // 📸 CAPTURAR FOTO CON CÁMARA         │
  └─────────────────────────────────────────┘
  static async capturePhoto(
    options?: Partial<ImagePickerOptions>
  ): Promise<ImagePickerResult> {
    
    // 1. Verificar permisos
    const hasPermission = await PermissionsService
      .requestCameraPermission();
    
    if (!hasPermission) {
      return {
        success: false,
        error: 'Permiso de cámara denegado',
      };
    }
    
    // 2. Configurar opciones por defecto
    const defaultOptions: ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Cuadrado para perfil
      quality: 0.8,   // 80% de calidad
      base64: false,
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    // 3. Lanzar cámara
    const result = await ImagePicker
      .launchCameraAsync(finalOptions);
    
    // 4. Procesar resultado
    if (result.cancelled) {
      return { success: false, cancelled: true };
    }
    
    return {
      success: true,
      uri: result.uri,
      width: result.width,
      height: result.height,
    };
  }
  
  ┌─────────────────────────────────────────┐
  │ // 🖼️ SELECCIONAR DE GALERÍA           │
  └─────────────────────────────────────────┘
  static async pickFromGallery(
    options?: Partial<ImagePickerOptions>
  ): Promise<ImagePickerResult> {
    
    // Similar a capturePhoto pero con
    // launchImageLibraryAsync()
    
    const hasPermission = await PermissionsService
      .requestGalleryPermission();
    
    if (!hasPermission) {
      return {
        success: false,
        error: 'Permiso de galería denegado',
      };
    }
    
    const result = await ImagePicker
      .launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        ...options,
      });
    
    if (result.cancelled) {
      return { success: false, cancelled: true };
    }
    
    return {
      success: true,
      uri: result.uri,
      width: result.width,
      height: result.height,
    };
  }
}
```

---

## 📊 DIAPOSITIVA 13: SERVICIO DE MANIPULACIÓN

**Título:** ✂️ Paso 6: Manipulación de Imágenes

**Operaciones disponibles:**

```
┌──────────────────────────────────────────────┐
│  OPERACIONES DE MANIPULACIÓN                 │
├──────────────────────────────────────────────┤
│                                              │
│  📏 REDIMENSIONAR                            │
│     ├─ Por ancho/alto fijo                  │
│     ├─ Por porcentaje                       │
│     └─ Mantener aspecto                     │
│                                              │
│  🗜️ COMPRIMIR                               │
│     ├─ Calidad JPEG (0-1)                   │
│     ├─ PNG lossless                         │
│     └─ Convertir formato                    │
│                                              │
│  ✂️ RECORTAR                                │
│     ├─ Coordenadas manuales                 │
│     ├─ Área seleccionada                    │
│     └─ Aspectos predefinidos                │
│                                              │
│  🔄 ROTAR/VOLTEAR                           │
│     ├─ Rotar 90°, 180°, 270°               │
│     ├─ Voltear horizontal                   │
│     └─ Voltear vertical                     │
│                                              │
└──────────────────────────────────────────────┘
```

**Implementación del servicio:**

```typescript
// src/services/camera/image-manipulation.service.ts

import * as ImageManipulator from 'expo-image-manipulator';

export class ImageManipulationService {
  
  ┌─────────────────────────────────────────┐
  │ // 📏 Redimensionar imagen             │
  └─────────────────────────────────────────┘
  static async resizeImage(
    uri: string,
    width: number,
    height: number
  ): Promise<string> {
    const result = await ImageManipulator
      .manipulateAsync(
        uri,
        [{ resize: { width, height } }],
        { compress: 0.8, format: 'jpeg' }
      );
    
    return result.uri;
  }
  
  ┌─────────────────────────────────────────┐
  │ // 🗜️ Comprimir y optimizar            │
  └─────────────────────────────────────────┘
  static async optimizeForProfile(
    uri: string
  ): Promise<ImageInfo> {
    // Tamaño para foto de perfil: 400x400
    const result = await ImageManipulator
      .manipulateAsync(
        uri,
        [{ resize: { width: 400, height: 400 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
    
    return {
      uri: result.uri,
      width: result.width,
      height: result.height,
      format: 'jpeg',
    };
  }
  
  ┌─────────────────────────────────────────┐
  │ // 📐 Crear thumbnail                  │
  └─────────────────────────────────────────┘
  static async createThumbnail(
    uri: string,
    size: number = 150
  ): Promise<string> {
    const result = await ImageManipulator
      .manipulateAsync(
        uri,
        [{ resize: { width: size, height: size } }],
        { compress: 0.5, format: 'jpeg' }
      );
    
    return result.uri;
  }
}
```

**Comparativa de tamaños:**

```
┌──────────────┬──────────┬────────────┬────────┐
│   TIPO       │ TAMAÑO   │ COMPRESIÓN │  USO   │
├──────────────┼──────────┼────────────┼────────┤
│ Original     │ Variado  │    100%    │  Cache │
│ Perfil       │ 400x400  │    70%     │ Display│
│ Thumbnail    │ 150x150  │    50%     │  Lista │
│ Credencial   │ 800x600  │    80%     │  Docs  │
└──────────────┴──────────┴────────────┴────────┘
```

---

## 📊 DIAPOSITIVA 14: COMPONENTE IMAGE PICKER

**Título:** 🎨 Paso 7: Componente Principal

**Anatomía del componente:**

```
┌────────────────────────────────────────────┐
│        ProfileImagePicker                   │
├────────────────────────────────────────────┤
│                                            │
│     ┌──────────────────────┐              │
│     │                      │              │
│     │   [Foto Actual o]    │              │
│     │   [Placeholder]      │              │
│     │                      │              │
│     └──────────────────────┘              │
│                                            │
│     ┌──────────┐  ┌──────────┐           │
│     │ 📷 Cámara│  │🖼️ Galería│           │
│     └──────────┘  └──────────┘           │
│                                            │
│     ┌──────────────────────┐              │
│     │   🗑️ Eliminar Foto   │ (opcional)  │
│     └──────────────────────┘              │
│                                            │
└────────────────────────────────────────────┘

Props:
├─ currentImage?: string
├─ onImageSelected: (uri: string) => void
├─ onImageRemoved?: () => void
├─ size?: number
├─ shape?: 'circle' | 'square'
└─ editable?: boolean
```

**Código del componente:**

```typescript
// src/components/camera/ProfileImagePicker.tsx

export const ProfileImagePicker: React.FC<Props> = ({
  currentImage,
  onImageSelected,
  onImageRemoved,
  size = 150,
  shape = 'circle',
  editable = true,
}) => {
  const [imageUri, setImageUri] = useState(currentImage);
  const [loading, setLoading] = useState(false);
  
  ┌─────────────────────────────────────────┐
  │ // Capturar con cámara                 │
  └─────────────────────────────────────────┘
  const handleCameraCapture = async () => {
    setLoading(true);
    
    const result = await CameraService
      .capturePhoto({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    
    if (result.success && result.uri) {
      // Optimizar imagen
      const optimized = await ImageManipulationService
        .optimizeForProfile(result.uri);
      
      setImageUri(optimized.uri);
      onImageSelected(optimized.uri);
    }
    
    setLoading(false);
  };
  
  ┌─────────────────────────────────────────┐
  │ // Seleccionar de galería              │
  └─────────────────────────────────────────┘
  const handleGalleryPick = async () => {
    setLoading(true);
    
    const result = await CameraService
      .pickFromGallery({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    
    if (result.success && result.uri) {
      const optimized = await ImageManipulationService
        .optimizeForProfile(result.uri);
      
      setImageUri(optimized.uri);
      onImageSelected(optimized.uri);
    }
    
    setLoading(false);
  };
  
  ┌─────────────────────────────────────────┐
  │ // Mostrar opciones                    │
  └─────────────────────────────────────────┘
  const showOptions = () => {
    Alert.alert(
      'Seleccionar foto',
      'Elige una opción',
      [
        {
          text: '📷 Tomar foto',
          onPress: handleCameraCapture,
        },
        {
          text: '🖼️ Elegir de galería',
          onPress: handleGalleryPick,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Vista previa de imagen */}
      <TouchableOpacity 
        onPress={editable ? showOptions : undefined}
      >
        <Image
          source={
            imageUri 
              ? { uri: imageUri }
              : require('../../../assets/avatar-placeholder.png')
          }
          style={[
            styles.image,
            { width: size, height: size },
            shape === 'circle' && styles.circle,
          ]}
        />
        {loading && (
          <ActivityIndicator style={styles.loader} />
        )}
      </TouchableOpacity>
      
      {/* Botones de acción */}
      {editable && (
        <View style={styles.buttons}>
          <TouchableOpacity onPress={handleCameraCapture}>
            <MaterialIcons name="camera" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGalleryPick}>
            <MaterialIcons name="photo-library" size={24} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
```

---

## 📊 DIAPOSITIVA 15: ALMACENAMIENTO LOCAL

**Título:** 💾 Paso 8: Almacenamiento Local

**Estrategias de almacenamiento:**

```
┌──────────────────────────────────────────────┐
│  ESTRATEGIA 1: URI Local                     │
├──────────────────────────────────────────────┤
│                                              │
│  ✅ Más simple y rápido                      │
│  ✅ Automático con ImagePicker               │
│  ❌ Se pierde al reinstalar app              │
│  ❌ No sincroniza entre dispositivos         │
│                                              │
│  Uso: Prototipos, apps offline              │
│                                              │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  ESTRATEGIA 2: File System                   │
├──────────────────────────────────────────────┤
│                                              │
│  ✅ Control total del almacenamiento         │
│  ✅ Persiste entre sesiones                  │
│  ⚠️ Requiere manejo manual                   │
│  ❌ No sincroniza entre dispositivos         │
│                                              │
│  Uso: Apps con almacenamiento local fuerte   │
│                                              │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  ESTRATEGIA 3: Nube (Firebase Storage)       │
├──────────────────────────────────────────────┤
│                                              │
│  ✅ Sincronización automática                │
│  ✅ Acceso desde múltiples dispositivos      │
│  ✅ Backups automáticos                      │
│  ⚠️ Requiere conexión a internet             │
│  ⚠️ Costos de almacenamiento                 │
│                                              │
│  Uso: Apps de producción (RECOMENDADO)      │
│                                              │
└──────────────────────────────────────────────┘
```

**Implementación File System:**

```typescript
// src/services/storage/local-storage.service.ts

import * as FileSystem from 'expo-file-system';

export class LocalStorageService {
  
  private static readonly IMAGES_DIR = 
    `${FileSystem.documentDirectory}images/`;
  
  ┌─────────────────────────────────────────┐
  │ // Inicializar directorio              │
  └─────────────────────────────────────────┘
  static async initialize(): Promise<void> {
    const dirInfo = await FileSystem
      .getInfoAsync(this.IMAGES_DIR);
    
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(
        this.IMAGES_DIR,
        { intermediates: true }
      );
    }
  }
  
  ┌─────────────────────────────────────────┐
  │ // Guardar imagen                      │
  └─────────────────────────────────────────┘
  static async saveImage(
    uri: string,
    filename: string
  ): Promise<string> {
    await this.initialize();
    
    const destination = `${this.IMAGES_DIR}${filename}`;
    
    await FileSystem.copyAsync({
      from: uri,
      to: destination,
    });
    
    return destination;
  }
  
  ┌─────────────────────────────────────────┐
  │ // Eliminar imagen                     │
  └─────────────────────────────────────────┘
  static async deleteImage(
    filename: string
  ): Promise<void> {
    const path = `${this.IMAGES_DIR}${filename}`;
    await FileSystem.deleteAsync(path);
  }
  
  ┌─────────────────────────────────────────┐
  │ // Obtener información                 │
  └─────────────────────────────────────────┘
  static async getImageInfo(
    uri: string
  ): Promise<FileSystem.FileInfo> {
    return await FileSystem.getInfoAsync(uri);
  }
}
```

---

## 📊 DIAPOSITIVA 16: ALMACENAMIENTO EN FIREBASE

**Título:** ☁️ Paso 9: Firebase Storage

**Arquitectura de Firebase Storage:**

```
┌────────────────────────────────────────────┐
│           FIREBASE STORAGE                  │
│                                            │
│  /images/                                  │
│    ├── /profiles/                         │
│    │   ├── /professors/                   │
│    │   │   ├── prof_1_400x400.jpg        │
│    │   │   ├── prof_1_thumb.jpg          │
│    │   │   └── prof_2_400x400.jpg        │
│    │   └── /students/                     │
│    │       ├── student_1_400x400.jpg     │
│    │       └── student_1_thumb.jpg       │
│    └── /documents/                         │
│        ├── student_1_credencial.jpg       │
│        └── student_2_comprobante.jpg      │
└────────────────────────────────────────────┘
```

**Implementación:**

```typescript
// src/services/storage/cloud-storage.service.ts

import storage from '@react-native-firebase/storage';

export class CloudStorageService {
  
  ┌─────────────────────────────────────────┐
  │ // Subir imagen de perfil              │
  └─────────────────────────────────────────┘
  static async uploadProfileImage(
    uri: string,
    userId: string,
    type: 'professor' | 'student'
  ): Promise<string> {
    
    // 1. Generar ruta en Firebase
    const filename = `${userId}_${Date.now()}.jpg`;
    const path = `images/profiles/${type}s/${filename}`;
    
    // 2. Crear referencia
    const reference = storage().ref(path);
    
    // 3. Subir archivo
    await reference.putFile(uri);
    
    // 4. Obtener URL de descarga
    const downloadURL = await reference.getDownloadURL();
    
    return downloadURL;
  }
  
  ┌─────────────────────────────────────────┐
  │ // Subir con progreso                  │
  └─────────────────────────────────────────┘
  static async uploadWithProgress(
    uri: string,
    path: string,
    onProgress: (progress: number) => void
  ): Promise<string> {
    
    const reference = storage().ref(path);
    const task = reference.putFile(uri);
    
    // Escuchar progreso
    task.on('state_changed', (snapshot) => {
      const progress = 
        (snapshot.bytesTransferred / 
         snapshot.totalBytes) * 100;
      onProgress(progress);
    });
    
    await task;
    return await reference.getDownloadURL();
  }
  
  ┌─────────────────────────────────────────┐
  │ // Eliminar imagen                     │
  └─────────────────────────────────────────┘
  static async deleteImage(
    path: string
  ): Promise<void> {
    const reference = storage().ref(path);
    await reference.delete();
  }
}
```

**Flujo completo con Firebase:**

```
Usuario selecciona imagen
         ↓
Optimizar localmente
         ↓
Mostrar vista previa
         ↓
Usuario confirma
         ↓
Subir a Firebase Storage
    (mostrar progreso)
         ↓
Obtener URL de descarga
         ↓
Guardar URL en Firestore
         ↓
Actualizar UI
```

---

## 📊 DIAPOSITIVA 17: INTEGRACIÓN EN FORMULARIOS

**Título:** 🔌 Paso 10: Integración en Pantallas

**Modificación de AlumnoFormModal:**

```typescript
// src/utils/AlumnoFormModal.tsx

export const AlumnoFormModal: React.FC<Props> = ({
  visible,
  alumno,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    nombre: alumno?.nombre || '',
    sem: alumno?.sem || '',
    carrera: alumno?.carrera || 'ISC',
    email: alumno?.email || '',
    telefono: alumno?.telefono || '',
    fotoPerfil: alumno?.fotoPerfil || '', // ← NUEVO
  });
  
  ┌─────────────────────────────────────────┐
  │ // Manejar selección de imagen         │
  └─────────────────────────────────────────┘
  const handleImageSelected = async (uri: string) => {
    // Opción 1: Solo guardar URI local
    setFormData(prev => ({
      ...prev,
      fotoPerfil: uri,
    }));
    
    // Opción 2: Subir a Firebase inmediatamente
    if (alumno?.id) {
      const downloadURL = await CloudStorageService
        .uploadProfileImage(
          uri,
          alumno.id.toString(),
          'student'
        );
      
      setFormData(prev => ({
        ...prev,
        fotoPerfil: downloadURL,
      }));
    }
  };
  
  return (
    <Modal visible={visible}>
      <ScrollView>
        {/* Campo de foto de perfil - NUEVO */}
        <View style={styles.photoSection}>
          <Text style={styles.label}>
            Foto de Perfil
          </Text>
          
          <ProfileImagePicker
            currentImage={formData.fotoPerfil}
            onImageSelected={handleImageSelected}
            size={120}
            shape="circle"
          />
        </View>
        
        {/* Resto de campos existentes */}
        <TextInput
          label="Nombre completo"
          value={formData.nombre}
          onChangeText={(text) => 
            setFormData({ ...formData, nombre: text })
          }
        />
        
        {/* ... más campos ... */}
        
        <Button title="Guardar" onPress={handleSave} />
      </ScrollView>
    </Modal>
  );
};
```

**Vista en AlumnoScreen:**

```typescript
// Modificar el componente AlumnoItem

const AlumnoItem: React.FC<Props> = ({ alumno }) => {
  return (
    <View style={styles.card}>
      {/* Mostrar foto de perfil */}
      <Image
        source={
          alumno.fotoPerfil
            ? { uri: alumno.fotoPerfil }
            : require('../../../assets/avatar-placeholder.png')
        }
        style={styles.profileImage}
      />
      
      {/* Resto del contenido */}
      <Text>{alumno.nombre}</Text>
      {/* ... */}
    </View>
  );
};
```

---

## 📊 DIAPOSITIVA 18: FLUJO COMPLETO VISUAL

**Título:** 🔄 Flujo Completo de Trabajo

**Diagrama de secuencia detallado:**

```
Usuario       UI           Service       Firebase      Firestore
  │            │              │             │            │
  ├─[Abrir]───►              │             │            │
  │   Modal    │              │             │            │
  │            │              │             │            │
  ├─[Click]───►              │             │            │
  │  Cámara    │              │             │            │
  │            │              │             │            │
  │            ├─capturePhoto►             │            │
  │            │              │             │            │
  │            │◄─────────────┤             │            │
  │            │   {uri}       │             │            │
  │            │              │             │            │
  │◄───────────┤              │             │            │
  │ [Preview]  │              │             │            │
  │            │              │             │            │
  ├─[Confirma]►              │             │            │
  │            │              │             │            │
  │            ├─optimize────►             │            │
  │            │              │             │            │
  │            ├─upload───────────────────►            │
  │            │              │             │            │
  │            │              │   [Upload  │            │
  │            │              │   Progress]│            │
  │            │              │             │            │
  │            │◄─────────────────────────┤            │
  │            │        {downloadURL}      │            │
  │            │              │             │            │
  │            ├─saveAlumno──────────────────────────►
  │            │              │             │  {alumno} │
  │            │              │             │            │
  │◄───────────┤              │             │            │
  │ [Éxito]    │              │             │            │
  │            │              │             │            │
```

---

## 📊 DIAPOSITIVA 19: OPTIMIZACIÓN Y MEJORES PRÁCTICAS

**Título:** ⚡ Optimización de Imágenes

**Tabla de optimizaciones:**

```
┌──────────────────┬─────────┬──────────┬──────────┐
│   ESCENARIO      │ORIGINAL │OPTIMIZADO│ AHORRO   │
├──────────────────┼─────────┼──────────┼──────────┤
│ Foto alta res    │ 4-8 MB  │ 200-400KB│   95%    │
│ Foto de perfil   │ 2-3 MB  │ 100-150KB│   95%    │
│ Thumbnail        │ 2-3 MB  │  20-30KB │   99%    │
│ Documento scan   │ 3-5 MB  │ 300-500KB│   90%    │
└──────────────────┴─────────┴──────────┴──────────┘
```

**Mejores prácticas:**

```
┌────────────────────────────────────────────────┐
│ ✅ HACER                                       │
├────────────────────────────────────────────────┤
│                                                │
│ • Comprimir imágenes antes de subir           │
│ • Crear thumbnails para listas                │
│ • Usar formato JPEG para fotos                │
│ • Limitar resolución máxima (2048px)          │
│ • Implementar lazy loading                    │
│ • Cachear imágenes descargadas                │
│ • Mostrar placeholders mientras carga         │
│ • Validar tamaño antes de subir              │
│                                                │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ ❌ EVITAR                                      │
├────────────────────────────────────────────────┤
│                                                │
│ • Subir imágenes sin comprimir                │
│ • Usar PNG para fotos (muy pesado)           │
│ • No validar tipo de archivo                  │
│ • Cargar imágenes originales en listas        │
│ • No manejar errores de carga                 │
│ • No implementar retry logic                  │
│ • No optimizar para diferentes pantallas      │
│                                                │
└────────────────────────────────────────────────┘
```

**Código de optimización recomendado:**

```typescript
const OPTIMIZATION_CONFIG = {
  profile: {
    width: 400,
    height: 400,
    quality: 0.8,
    format: 'jpeg',
  },
  thumbnail: {
    width: 150,
    height: 150,
    quality: 0.6,
    format: 'jpeg',
  },
  document: {
    width: 1200,
    height: 1600,
    quality: 0.85,
    format: 'jpeg',
  },
};
```

---

## 📊 DIAPOSITIVA 20: MANEJO DE ERRORES

**Título:** ⚠️ Manejo de Errores y Edge Cases

**Tipos de errores:**

```
┌────────────────────────────────────────────────┐
│ ERROR                  │ CAUSA    │ SOLUCIÓN   │
├────────────────────────────────────────────────┤
│                                                │
│ Permiso denegado       │ Usuario  │ Explicar   │
│                        │ rechaza  │ necesidad  │
│                        │          │ + Settings │
│                                                │
│ Imagen muy grande      │ >10MB    │ Validar y  │
│                        │          │ rechazar   │
│                                                │
│ Formato no soportado   │ HEIC,    │ Convertir  │
│                        │ TIFF     │ o rechazar │
│                                                │
│ Sin espacio            │ Storage  │ Limpiar o  │
│                        │ lleno    │ avisar     │
│                                                │
│ Error de red           │ Sin WiFi │ Retry +    │
│                        │          │ Queue      │
│                                                │
│ Timeout de upload      │ Imagen   │ Comprimir  │
│                        │ pesada   │ más        │
│                                                │
└────────────────────────────────────────────────┘
```

**Implementación de manejo de errores:**

```typescript
export class ImageErrorHandler {
  
  static handleImageError(error: any): string {
    if (error.code === 'E_PERMISSION_MISSING') {
      return 'Se requieren permisos de cámara';
    }
    
    if (error.code === 'E_PICKER_CANCELLED') {
      return 'Selección cancelada';
    }
    
    if (error.code === 'E_NO_IMAGE_DATA') {
      return 'No se pudo cargar la imagen';
    }
    
    if (error.message?.includes('size')) {
      return 'Imagen demasiado grande (máx 10MB)';
    }
    
    return 'Error al procesar imagen';
  }
  
  static validateImage(
    uri: string,
    maxSize: number = 10 * 1024 * 1024 // 10MB
  ): ValidationResult {
    // Validar tamaño
    // Validar formato
    // Validar dimensiones
    return { valid: true };
  }
}
```

---

## 📊 DIAPOSITIVA 21: CACHING Y PERFORMANCE

**Título:** 🚀 Performance y Caching

**Estrategia de caching:**

```
┌────────────────────────────────────────────────┐
│           ESTRATEGIA DE CACHE                   │
├────────────────────────────────────────────────┤
│                                                │
│  NIVEL 1: Memoria (RAM)                        │
│  ├─ Imágenes recién cargadas                  │
│  ├─ Duración: Sesión actual                   │
│  └─ Tamaño: ~50 imágenes                      │
│                                                │
│  NIVEL 2: Disco (File System)                 │
│  ├─ Thumbnails                                │
│  ├─ Duración: 7 días                          │
│  └─ Tamaño: ~500 imágenes                     │
│                                                │
│  NIVEL 3: Nube (Firebase)                     │
│  ├─ Imágenes originales                       │
│  ├─ Duración: Permanente                      │
│  └─ Tamaño: Ilimitado                         │
│                                                │
└────────────────────────────────────────────────┘
```

**Librería recomendada:**

```typescript
// Usar react-native-fast-image para caching
import FastImage from 'react-native-fast-image';

<FastImage
  source={{
    uri: alumno.fotoPerfil,
    priority: FastImage.priority.high,
  }}
  style={styles.image}
  resizeMode={FastImage.resizeMode.cover}
/>
```

**Métricas de performance:**

```
SIN OPTIMIZACIÓN:
├─ Carga inicial: 3-5 segundos
├─ Uso de datos: 50-100 MB
└─ Crashes: Frecuentes (OOM)

CON OPTIMIZACIÓN:
├─ Carga inicial: 0.5-1 segundo
├─ Uso de datos: 5-10 MB
└─ Crashes: Raros
```

---

## 📊 DIAPOSITIVA 22: DEMO EN VIVO

**Título:** 🎬 Demostración Completa

**Script de demo:**

```
┌────────────────────────────────────────────────┐
│  DEMO: Agregar Foto de Perfil a Alumno        │
├────────────────────────────────────────────────┤
│                                                │
│  1️⃣ Abrir app → Lista de Alumnos              │
│     Mostrar lista actual (sin fotos)           │
│                                                │
│  2️⃣ Tap en "Agregar Alumno"                   │
│     Abrir modal de formulario                  │
│                                                │
│  3️⃣ Tap en placeholder de foto                │
│     Mostrar opciones: Cámara/Galería           │
│                                                │
│  4️⃣ Seleccionar "Cámara"                       │
│     Solicitar permisos si es primera vez       │
│                                                │
│  5️⃣ Tomar foto                                 │
│     Usar cámara nativa                         │
│                                                │
│  6️⃣ Editar/Recortar                            │
│     Ajustar encuadre si allowsEditing=true     │
│                                                │
│  7️⃣ Confirmar foto                             │
│     Ver preview en el formulario               │
│                                                │
│  8️⃣ Completar datos del alumno                │
│     Nombre, semestre, etc.                     │
│                                                │
│  9️⃣ Guardar alumno                             │
│     Ver barra de progreso de upload            │
│                                                │
│  🔟 Verificar en lista                         │
│     Alumno aparece con su foto                 │
│                                                │
│  EXTRA: Editar alumno existente                │
│     Cambiar foto de perfil                     │
│                                                │
└────────────────────────────────────────────────┘
```

**Puntos a destacar durante la demo:**
- ✅ Solicitud de permisos
- ✅ UI responsiva durante carga
- ✅ Compresión automática
- ✅ Vista previa antes de guardar
- ✅ Barra de progreso
- ✅ Manejo de errores

---

## 📊 DIAPOSITIVA 23: TESTING Y VALIDACIÓN

**Título:** 🧪 Pruebas y Validación

**Matriz de pruebas:**

```
┌───────────────────┬─────────┬─────────┬────────┐
│  CASO DE PRUEBA   │ Android │   iOS   │ Estado │
├───────────────────┼─────────┼─────────┼────────┤
│ Captura cámara    │   ✅    │   ✅    │   OK   │
│ Selección galería │   ✅    │   ✅    │   OK   │
│ Edición/recorte   │   ✅    │   ✅    │   OK   │
│ Compresión        │   ✅    │   ✅    │   OK   │
│ Upload Firebase   │   ✅    │   ✅    │   OK   │
│ Sin permisos      │   ✅    │   ✅    │   OK   │
│ Cancelar          │   ✅    │   ✅    │   OK   │
│ Imagen muy grande │   ✅    │   ✅    │   OK   │
│ Sin conexión      │   ✅    │   ✅    │   OK   │
│ Formato inválido  │   ✅    │   ✅    │   OK   │
└───────────────────┴─────────┴─────────┴────────┘
```

**Checklist de validación:**

```
□ La foto se captura correctamente
□ La galería se abre sin errores
□ El recorte funciona (si está habilitado)
□ La imagen se comprime automáticamente
□ Se muestra vista previa antes de guardar
□ El upload a Firebase funciona
□ Se muestra progreso de upload
□ Los thumbnails se generan
□ Las imágenes se cachean
□ El placeholder se muestra si no hay foto
□ Los permisos se solicitan correctamente
□ Los errores se manejan apropiadamente
□ No hay memory leaks
□ La app no crashea con imágenes grandes
```

---

## 📊 DIAPOSITIVA 24: COMPARATIVA DE IMPLEMENTACIONES

**Título:** 📊 Comparativa: Expo vs React Native CLI

**Tabla exhaustiva:**

```
┌──────────────────┬─────────────┬─────────────────┐
│  CARACTERÍSTICA  │    EXPO     │   RN CLI        │
├──────────────────┼─────────────┼─────────────────┤
│ Setup            │  🟢 Fácil   │  🟡 Complejo    │
│ Tamaño app       │  🟡 Grande  │  🟢 Pequeño     │
│ Permisos         │  🟢 Auto    │  🟡 Manual      │
│ Dependencias     │  🟢 Incluido│  🔴 Instalar    │
│ Configuración    │  🟢 Mínima  │  🟡 Extensa     │
│ Flexibilidad     │  🟡 Limitada│  🟢 Total       │
│ Actualizaciones  │  🟢 OTA     │  🟡 Store       │
│ Documentación    │  🟢 Excelente│ 🟢 Buena       │
│ Comunidad        │  🟢 Grande  │  🟢 Grande      │
│ Tiempo desarrollo│  🟢 Rápido  │  🟡 Moderado    │
└──────────────────┴─────────────┴─────────────────┘

🟢 Mejor  🟡 Moderado  🔴 Peor
```

**Recomendación del proyecto:**

```
┌────────────────────────────────────────────────┐
│  ✅ USAMOS EXPO                                │
│                                                │
│  Razones:                                      │
│  • Proyecto educativo (prototipado rápido)    │
│  • Equipo con experiencia variada             │
│  • Necesidad de iterar rápidamente            │
│  • Sin requerimientos nativos especiales      │
│  • Facilita deployment y testing              │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 25: EJERCICIO PRÁCTICO

**Título:** 💪 Ejercicio: Implementar Galería de Documentos

**Descripción del ejercicio:**

```
┌────────────────────────────────────────────────┐
│  EJERCICIO: Galería de Documentos del Alumno  │
├────────────────────────────────────────────────┤
│                                                │
│  Objetivo:                                     │
│  Permitir que cada alumno pueda adjuntar      │
│  múltiples documentos (credencial,            │
│  comprobante de domicilio, acta, etc.)        │
│                                                │
│  Requisitos:                                   │
│  1. Crear componente DocumentGallery          │
│  2. Permitir agregar múltiples fotos          │
│  3. Mostrar thumbnails en grid                │
│  4. Permitir eliminar documentos              │
│  5. Permitir ver en tamaño completo          │
│  6. Etiquetar tipo de documento               │
│                                                │
│  Entregables:                                  │
│  □ Código del componente                      │
│  □ Integración en AlumnoFormModal            │
│  □ Almacenamiento en Firebase                │
│  □ Screenshots de funcionamiento              │
│                                                │
│  Tiempo estimado: 90 minutos                   │
│                                                │
│  Pistas:                                       │
│  - Usar FlatList para el grid                │
│  - Array de documentos en el state           │
│  - Modal para vista completa                  │
│                                                │
└────────────────────────────────────────────────┘
```

**Mockup esperado:**

```
┌────────────────────────────────────────┐
│  Documentos del Alumno                 │
├────────────────────────────────────────┤
│                                        │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐ │
│  │ 📄  │  │ 📄  │  │ 📄  │  │  +  │ │
│  │Créd.│  │Acta │  │Comp.│  │Nuevo│ │
│  │  ❌ │  │  ❌ │  │  ❌ │  │     │ │
│  └─────┘  └─────┘  └─────┘  └─────┘ │
│                                        │
└────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 26: RECURSOS Y DOCUMENTACIÓN

**Título:** 📚 Recursos Adicionales

**Enlaces organizados:**

```
┌────────────────────────────────────────────────┐
│ 📖 DOCUMENTACIÓN OFICIAL                       │
├────────────────────────────────────────────────┤
│                                                │
│ Expo Image Picker                              │
│ → docs.expo.dev/versions/latest/               │
│   sdk/imagepicker/                             │
│                                                │
│ Expo Image Manipulator                         │
│ → docs.expo.dev/versions/latest/               │
│   sdk/imagemanipulator/                        │
│                                                │
│ Firebase Storage                                │
│ → rnfirebase.io/storage/usage                  │
│                                                │
│ React Native Image                             │
│ → reactnative.dev/docs/image                   │
│                                                │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ 🎥 TUTORIALES RECOMENDADOS                     │
├────────────────────────────────────────────────┤
│                                                │
│ • "Image Picker en React Native" - YouTube    │
│ • "Firebase Storage Tutorial" - Fireship      │
│ • "Image Optimization" - React Native School  │
│                                                │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ 🛠️ HERRAMIENTAS ÚTILES                         │
├────────────────────────────────────────────────┤
│                                                │
│ • TinyPNG - Comprimir imágenes online         │
│ • ImageOptim - Optimizador de imágenes        │
│ • Postman - Testing de APIs                   │
│ • Firebase Console - Gestión de Storage       │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 27: EXTENSIONES Y MEJORAS FUTURAS

**Título:** 🚀 Roadmap de Mejoras

**Funcionalidades futuras:**

```
FASE 2: Mejoras Básicas
├─ Filtros de imagen (B&N, Sepia)
├─ Stickers y texto sobre imagen
├─ Múltiples fotos en una publicación
└─ Compartir en redes sociales

FASE 3: Funcionalidades Avanzadas
├─ Reconocimiento facial
├─ OCR (texto en imágenes)
├─ Códigos QR integrados
├─ Realidad aumentada con cámara
└─ Video recording

FASE 4: Integraciones
├─ Integración con Google Photos
├─ Backup automático en Drive
├─ Sincronización entre dispositivos
└─ APIs de IA para análisis de imágenes
```

**Tecnologías emergentes:**

```
┌────────────────────────────────────────┐
│ 🤖 IA y Machine Learning               │
│ ├─ Detección de rostros               │
│ ├─ Clasificación de imágenes          │
│ └─ Mejora automática de calidad       │
│                                        │
│ 📊 Análisis de Contenido              │
│ ├─ Moderación automática              │
│ ├─ Detección de contenido inapropiado│
│ └─ Extracción de información          │
│                                        │
│ 🎨 Edición Avanzada                   │
│ ├─ Eliminar fondo automático          │
│ ├─ Efectos profesionales              │
│ └─ HDR y mejoras de color             │
└────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 28: TROUBLESHOOTING

**Título:** 🔧 Solución de Problemas Comunes

**Guía de diagnóstico:**

```
❌ PROBLEMA: "No permissions to access camera"
└─ SOLUCIÓN:
   1. Verificar AndroidManifest.xml / Info.plist
   2. Llamar requestCameraPermission()
   3. Verificar respuesta del usuario
   4. Si denegado, mostrar Settings link

❌ PROBLEMA: "Image upload fails"
└─ SOLUCIÓN:
   1. Verificar conexión a internet
   2. Verificar configuración de Firebase
   3. Revisar reglas de Storage
   4. Verificar tamaño de imagen (<10MB)
   5. Implementar retry logic

❌ PROBLEMA: "Out of memory error"
└─ SOLUCIÓN:
   1. Comprimir imágenes antes de cargar
   2. Liberar imágenes no usadas
   3. Usar thumbnails en listas
   4. Implementar lazy loading

❌ PROBLEMA: "Image appears rotated"
└─ SOLUCIÓN:
   1. Leer EXIF orientation
   2. Aplicar rotación correcta
   3. Usar allowsEditing para auto-fix

❌ PROBLEMA: "Slow performance"
└─ SOLUCIÓN:
   1. Implementar caching
   2. Usar react-native-fast-image
   3. Optimizar tamaños de imagen
   4. Lazy load fuera de viewport
```

---

## 📊 DIAPOSITIVA 29: PREGUNTAS FRECUENTES

**Título:** ❓ Preguntas y Respuestas

**Q&A estructurado:**

```
┌────────────────────────────────────────────────┐
│ Q: ¿Funciona con videos también?               │
│ A: Sí, ImagePicker soporta videos. Cambiar    │
│    mediaTypes a 'Videos' o 'All'               │
│                                                │
│ Q: ¿Cuánto cuesta Firebase Storage?           │
│ A: 5GB gratis, luego $0.026/GB/mes            │
│                                                │
│ Q: ¿Puedo usar sin Firebase?                  │
│ A: Sí, guardar localmente con FileSystem      │
│    o usar otro servicio cloud                  │
│                                                │
│ Q: ¿Cómo limitar tamaño de imagen?           │
│ A: Validar antes de subir con getInfoAsync    │
│                                                │
│ Q: ¿Funciona en web (React Native Web)?      │
│ A: Limitado. Mejor usar input file HTML5      │
│                                                │
│ Q: ¿Cómo implementar crop personalizado?     │
│ A: Usar react-native-image-crop-picker        │
│    para más control                            │
│                                                │
│ Q: ¿Necesito Expo o funciona con CLI?        │
│ A: Funciona con ambos, pero Expo es más fácil│
└────────────────────────────────────────────────┘
```

---

## 📊 DIAPOSITIVA 30: RESUMEN Y CIERRE

**Título:** 📝 Resumen de la Sesión

**Puntos clave cubiertos:**

```
┌────────────────────────────────────────────┐
│ ✅ LO QUE APRENDIMOS                       │
├────────────────────────────────────────────┤
│                                            │
│ • Acceso a cámara y galería                │
│ • Manejo de permisos iOS/Android           │
│ • Manipulación de imágenes                 │
│ • Compresión y optimización                │
│ • Almacenamiento local y en nube           │
│ • Integración con Firebase Storage         │
│ • Componentes reutilizables                │
│ • Mejores prácticas de performance         │
│                                            │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 🎯 IMPLEMENTAMOS                           │
├────────────────────────────────────────────┤
│                                            │
│ ✓ Sistema completo de fotos de perfil     │
│ ✓ Captura desde cámara                    │
│ ✓ Selección de galería                    │
│ ✓ Edición y recorte                       │
│ ✓ Compresión automática                   │
│ ✓ Upload a Firebase                       │
│ ✓ Vista previa y thumbnails               │
│                                            │
└────────────────────────────────────────────┘
```

**Siguiente sesión:**
```
⏭️  PRÓXIMO TEMA: 3.3 Sensores del Dispositivo
   - Acelerómetro
   - Giroscopio
   - Detector de movimiento
```

---

## 🎨 ESPECIFICACIONES DE DISEÑO PARA CANVA

**Paleta de colores actualizada:**

```
Color Principal:    #8E24AA (Púrpura - Cámara/Fotos)
Color Secundario:   #00BCD4 (Cian - Tecnología)
Color de Éxito:     #4CAF50 (Verde - Confirmación)
Color de Alerta:    #FF9800 (Naranja - Permisos)
Color de Error:     #F44336 (Rojo - Errores)
Fondo Principal:    #FAFAFA (Gris muy claro)
Fondo Secundario:   #FFFFFF (Blanco)
Texto Principal:    #212121 (Negro suave)
Texto Secundario:   #757575 (Gris)
Acento Firebase:    #FFCA28 (Amarillo Firebase)
```

**Íconos recomendados:**
- 📷 Cámara
- 📸 Flash/Captura
- 🖼️ Galería/Imágenes
- ✂️ Recortar
- 🗜️ Comprimir
- 💾 Guardar
- ☁️ Nube/Firebase
- 👤 Perfil
- 📄 Documento
- ⚙️ Configuración
- 🔐 Permisos
- ✅ Éxito

**Elementos visuales clave:**
1. Mockups de dispositivos móviles
2. Diagramas de flujo con flechas animadas
3. Comparativas lado a lado
4. Capturas de pantalla reales
5. Iconografía consistente
6. Progress bars para uploads
7. Before/After de optimización

---

## 📏 LAYOUT RECOMENDADO

```
┌────────────────────────────────────────┐
│  [Logo] TEMA 3.2        [32/50]        │ ← Header
├────────────────────────────────────────┤
│                                        │
│         TÍTULO PRINCIPAL               │ ← 48px Bold
│         Subtítulo descriptivo          │ ← 24px Regular
│                                        │
│  ┌──────────────────────────────┐    │
│  │                               │    │
│  │   CONTENIDO PRINCIPAL         │    │
│  │   • Diagramas                 │    │
│  │   • Código                    │    │
│  │   • Imágenes                  │    │
│  │                               │    │
│  └──────────────────────────────┘    │
│                                        │
│  [Notas al pie / Referencias]         │
│                                        │
├────────────────────────────────────────┤
│  3.2 Cámara e Imágenes | @tuusuario   │ ← Footer
└────────────────────────────────────────┘
```

---

## 🎯 NOTAS PARA EL PRESENTADOR

**Timing sugerido (120 minutos):**

- Diapositivas 1-6 (15 min): Introducción y contexto
- Diapositivas 7-11 (20 min): Setup y configuración
- Diapositivas 12-16 (25 min): Servicios core
- Diapositivas 17-18 (15 min): Integración
- Diapositivas 19-21 (15 min): Optimización
- Diapositiva 22 (20 min): **DEMO EN VIVO**
- Diapositivas 23-30 (10 min): Cierre y Q&A

**Puntos críticos a enfatizar:**
1. Importancia de optimizar imágenes
2. Diferencia entre URI local y URL de Firebase
3. Manejo correcto de permisos
4. Performance y experiencia de usuario

---

## ✅ CHECKLIST PARA CANVA

□ Importar nueva paleta de colores
□ Preparar mockups de móviles
□ Preparar screenshots del código
□ Crear templates de diagrama de flujo
□ Agregar iconos de cámara y galería
□ Preparar antes/después de optimización
□ Incluir ejemplos visuales de Firebase
□ Agregar progress bars animados
□ Preparar comparativas Android/iOS
□ Crear slide de demo con anotaciones
□ Incluir códigos QR a recursos
□ Preparar versión para imprimir

---

**CONTENIDO COMPLETO PARA 30 DIAPOSITIVAS - TEMA 3.2**
**LISTO PARA IMPLEMENTAR EN CANVA**
