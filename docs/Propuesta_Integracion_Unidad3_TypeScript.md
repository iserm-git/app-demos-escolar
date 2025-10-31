# Propuesta de Integración - Unidad 3: Funciones Avanzadas del Dispositivo
## Aplicación de Gestión Escolar en React Native con TypeScript

---

## 📋 Resumen Ejecutivo

Esta propuesta detalla cómo incorporar las funcionalidades avanzadas del dispositivo (Unidad 3) a la aplicación de gestión escolar existente, migrándola de JSX a TypeScript y completando las funcionalidades faltantes.

**Estrategia de Implementación:**
- **Integración Directa:** Funcionalidades que se incorporan al proyecto principal
- **Demos Independientes:** Funcionalidades que requieren proyectos demostrativos separados

---

## 🎯 Análisis del Temario vs Proyecto Actual

### Temas de la Unidad 3:
1. Funciones básicas del dispositivo (llamadas, enlaces, contactos)
2. Acceso a cámara y manipulación de imágenes
3. Sensores del dispositivo (acelerómetro, giroscopio)
4. Geolocalización y mapas
5. Realidad aumentada
6. Servicios externos y APIs (Firebase, REST)
7. APIs nativas

---

## 📱 Propuesta de Integración Detallada

### **3.1 Funciones Básicas del Dispositivo**

#### **✅ INTEGRACIÓN DIRECTA AL PROYECTO**

**Implementación en la App de Gestión Escolar:**

**a) Llamadas Telefónicas**
- **Módulo:** Alumno y Profesor
- **Funcionalidad:** Agregar campo de teléfono y botón para llamar directamente
- **Paquete:** `react-native-phone-call` o `Linking` API nativa

```typescript
// types/contacts.types.ts
export interface ContactInfo {
  phone: string;
  email: string;
  emergencyContact?: string;
}

// Ejemplo de implementación
import { Linking, Alert } from 'react-native';

const makePhoneCall = (phoneNumber: string): void => {
  const phoneUrl = `tel:${phoneNumber}`;
  
  Linking.canOpenURL(phoneUrl)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'No se puede realizar la llamada');
      }
    })
    .catch((err) => console.error('Error al llamar:', err));
};
```

**b) Enlaces (Links)**
- **Módulo:** Materias
- **Funcionalidad:** Agregar enlaces a recursos educativos externos
- **Uso:** Enlaces a material de estudio, videos, documentos

```typescript
// types/material.types.ts
export interface CourseMaterial {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'document' | 'website';
}

// Función para abrir enlaces
const openExternalLink = async (url: string): Promise<void> => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  }
};
```

**c) Contactos**
- **Módulo:** Módulo de Seguridad
- **Funcionalidad:** Importar contactos para registro rápido de tutores o contactos de emergencia
- **Paquete:** `react-native-contacts`

```typescript
import Contacts from 'react-native-contacts';

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

const selectContactFromDevice = async (): Promise<EmergencyContact | null> => {
  try {
    const permission = await Contacts.requestPermission();
    if (permission === 'authorized') {
      const contact = await Contacts.openContactPicker();
      return {
        name: contact.displayName,
        phone: contact.phoneNumbers[0]?.number || '',
        relationship: ''
      };
    }
  } catch (error) {
    console.error('Error al seleccionar contacto:', error);
  }
  return null;
};
```

---

### **3.2 Acceso a Cámara y Manipulación de Imágenes**

#### **✅ INTEGRACIÓN DIRECTA AL PROYECTO**

**Implementación en Módulos:**

**a) Módulo Alumno - Foto de Perfil**
- Capturar foto de credencial escolar
- Almacenar foto de perfil del alumno
- **Paquete:** `react-native-image-picker` o `expo-camera`

```typescript
// types/student.types.ts
export interface Student {
  id: string;
  name: string;
  enrollment: string;
  profilePhoto?: string; // URI o base64
  credentialPhoto?: string;
  documents: StudentDocument[];
}

export interface StudentDocument {
  id: string;
  type: 'credencial' | 'acta' | 'comprobante';
  imageUri: string;
  uploadDate: Date;
}
```

**b) Módulo Profesor - Foto de Perfil**
```typescript
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import type { ImagePickerResponse } from 'react-native-image-picker';

const capturePhoto = async (): Promise<string | null> => {
  const result: ImagePickerResponse = await launchCamera({
    mediaType: 'photo',
    cameraType: 'front',
    quality: 0.8,
    maxWidth: 800,
    maxHeight: 800,
  });

  if (result.assets && result.assets[0]) {
    return result.assets[0].uri || null;
  }
  return null;
};
```

**c) Módulo Gestión de Curso - Asistencia con Foto**
- Registrar asistencia con captura de foto como evidencia
- Útil para asistencias especiales o eventos

```typescript
export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'justified';
  photoEvidence?: string; // Para eventos especiales
  location?: GeolocationData;
}
```

**d) Manipulación de Imágenes**
- **Paquete:** `react-native-image-resizer` y `react-native-image-crop-picker`
- Redimensionar fotos antes de subirlas
- Recortar imágenes (cropping)
- Comprimir para optimizar almacenamiento

```typescript
import ImageResizer from 'react-native-image-resizer';

const optimizeImage = async (uri: string): Promise<string> => {
  try {
    const resized = await ImageResizer.createResizedImage(
      uri,
      800,
      800,
      'JPEG',
      80,
      0
    );
    return resized.uri;
  } catch (error) {
    console.error('Error al optimizar imagen:', error);
    return uri;
  }
};
```

---

### **3.3 Integración con Sensores (Acelerómetro, Giroscopio)**

#### **⚠️ DEMO INDEPENDIENTE RECOMENDADO**

**Justificación:** Los sensores de movimiento no tienen aplicación práctica directa en una app de gestión escolar administrativa.

**Propuesta:** Crear un proyecto demo educativo separado para enseñar el uso de sensores.

#### **Alternativa de Integración (Opcional):**

**Mini-juego Educativo dentro de la App**
- Módulo extra: "Zona de Estudiantes"
- Juego de física o matemáticas usando acelerómetro
- Gamificación para motivar el uso de la app

```typescript
// DEMO INDEPENDIENTE: SensorDemo.tsx
import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { map, filter } from 'rxjs/operators';

interface SensorData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

// Configurar intervalo de actualización
setUpdateIntervalForType(SensorTypes.accelerometer, 100); // 100ms

const AccelerometerDemo: React.FC = () => {
  const [acceleration, setAcceleration] = useState<SensorData>({
    x: 0, y: 0, z: 0, timestamp: 0
  });

  useEffect(() => {
    const subscription = accelerometer
      .pipe(
        map(({ x, y, z, timestamp }) => ({
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
          z: Number(z.toFixed(2)),
          timestamp
        }))
      )
      .subscribe(setAcceleration);

    return () => subscription.unsubscribe();
  }, []);

  return (
    <View>
      <Text>Acelerómetro:</Text>
      <Text>X: {acceleration.x}</Text>
      <Text>Y: {acceleration.y}</Text>
      <Text>Z: {acceleration.z}</Text>
    </View>
  );
};
```

**Ejemplos para el Demo de Sensores:**

1. **Detector de Caídas del Dispositivo**
```typescript
const detectShake = (data: SensorData): boolean => {
  const totalAcceleration = Math.sqrt(
    data.x ** 2 + data.y ** 2 + data.z ** 2
  );
  return totalAcceleration > 20; // Umbral de sacudida
};
```

2. **Nivelador Virtual**
```typescript
const calculateTilt = (x: number, y: number): { pitch: number, roll: number } => {
  const pitch = Math.atan2(y, Math.sqrt(x ** 2 + z ** 2)) * (180 / Math.PI);
  const roll = Math.atan2(x, Math.sqrt(y ** 2 + z ** 2)) * (180 / Math.PI);
  return { pitch, roll };
};
```

3. **Medidor de Pasos (Podómetro Simple)**
```typescript
import { Pedometer } from 'expo-sensors';

const StepCounter: React.FC = () => {
  const [steps, setSteps] = useState<number>(0);

  useEffect(() => {
    const subscription = Pedometer.watchStepCount((result) => {
      setSteps(result.steps);
    });

    return () => subscription.remove();
  }, []);
};
```

---

### **3.4 Geolocalización y Manejo de Mapas**

#### **✅ INTEGRACIÓN DIRECTA AL PROYECTO**

**Implementación Práctica:**

**a) Módulo Gestión de Curso - Asistencia Geolocalizada**
- Registrar ubicación al tomar asistencia
- Verificar que el profesor está en el campus
- **Paquete:** `@react-native-community/geolocation` o `expo-location`

```typescript
// types/location.types.ts
export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  address?: string; // Geocoding inverso
}

export interface CampusLocation {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number; // metros para geofencing
}

// services/location.service.ts
import Geolocation from '@react-native-community/geolocation';

class LocationService {
  async getCurrentLocation(): Promise<GeolocationData> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp),
          });
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  }

  isWithinCampus(
    userLocation: GeolocationData,
    campus: CampusLocation
  ): boolean {
    const distance = this.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      campus.coordinates.latitude,
      campus.coordinates.longitude
    );
    return distance <= campus.radius;
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    // Fórmula de Haversine
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  }
}
```

**b) Módulo de Reportes - Mapa de Asistencias**
- Visualizar en mapa dónde se tomaron las asistencias
- **Paquete:** `react-native-maps`

```typescript
import MapView, { Marker, Circle } from 'react-native-maps';

interface AttendanceMapProps {
  attendances: AttendanceRecord[];
  campus: CampusLocation;
}

const AttendanceMap: React.FC<AttendanceMapProps> = ({ attendances, campus }) => {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: campus.coordinates.latitude,
        longitude: campus.coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {/* Círculo del campus */}
      <Circle
        center={campus.coordinates}
        radius={campus.radius}
        fillColor="rgba(0, 150, 255, 0.1)"
        strokeColor="rgba(0, 150, 255, 0.5)"
      />

      {/* Marcadores de asistencias */}
      {attendances
        .filter((a) => a.location)
        .map((attendance) => (
          <Marker
            key={attendance.id}
            coordinate={{
              latitude: attendance.location!.latitude,
              longitude: attendance.location!.longitude,
            }}
            title={`Asistencia ${attendance.date.toLocaleDateString()}`}
          />
        ))}
    </MapView>
  );
};
```

**c) Geocoding - Dirección de Alumnos**
```typescript
import Geocoder from 'react-native-geocoding';

Geocoder.init('YOUR_GOOGLE_MAPS_API_KEY');

const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const response = await Geocoder.from(latitude, longitude);
    const address = response.results[0].formatted_address;
    return address;
  } catch (error) {
    console.error('Error en geocoding:', error);
    return 'Dirección no disponible';
  }
};
```

---

### **3.5 Realidad Aumentada (AR)**

#### **⚠️ DEMO INDEPENDIENTE RECOMENDADO**

**Justificación:** La RA es compleja y requiere hardware específico. No tiene aplicación directa en gestión administrativa escolar básica.

**Propuesta:** Proyecto demo educativo separado con ejemplos prácticos.

#### **Opción 1: Demo con ViroReact (React Native)**

```typescript
// DEMO INDEPENDIENTE
import { ViroARScene, ViroText, ViroBox, ViroARSceneNavigator } from '@viro-community/react-viro';

const ARDemo: React.FC = () => {
  return (
    <ViroARScene>
      <ViroText
        text="¡Bienvenido a AR en React Native!"
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={{ fontFamily: 'Arial', fontSize: 30, color: '#ffffff' }}
      />
      <ViroBox
        position={[0, -0.5, -1]}
        scale={[0.3, 0.3, 0.3]}
        materials={['grid']}
        animation={{ name: 'rotate', run: true, loop: true }}
      />
    </ViroARScene>
  );
};
```

#### **Opción 2: Demo con react-native-arkit (iOS)**

```typescript
import { ARKit } from 'react-native-arkit';

const ARKitDemo: React.FC = () => {
  return (
    <ARKit
      style={{ flex: 1 }}
      debug
      planeDetection
      lightEstimation
    >
      <ARKit.Text
        text="Realidad Aumentada"
        position={{ x: 0, y: 0, z: -1 }}
        font={{ size: 0.15, depth: 0.05 }}
      />
    </ARKit>
  );
};
```

#### **Posible Integración Futura (Avanzado):**
- **Tour Virtual del Campus:** Los estudiantes pueden ver información AR sobre edificios
- **Laboratorio Virtual:** Experimentos de ciencias en AR
- **Visualización 3D:** Modelos 3D de proyectos estudiantiles

---

### **3.6 y 3.7 Servicios Externos y APIs**

#### **✅ INTEGRACIÓN DIRECTA AL PROYECTO**

**a) Firebase - Backend Completo**

**Servicios a Implementar:**

1. **Firebase Authentication**
```typescript
// services/firebase/auth.service.ts
import auth from '@react-native-firebase/auth';

export class AuthService {
  async signIn(email: string, password: string): Promise<void> {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async signUp(email: string, password: string, userData: UserData): Promise<void> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await this.createUserProfile(userCredential.user.uid, userData);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    await auth().sendPasswordResetEmail(email);
  }

  async signOut(): Promise<void> {
    await auth().signOut();
  }

  private handleAuthError(error: any): Error {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return new Error('Este correo ya está registrado');
      case 'auth/invalid-email':
        return new Error('Correo electrónico inválido');
      case 'auth/weak-password':
        return new Error('La contraseña debe tener al menos 6 caracteres');
      case 'auth/user-not-found':
        return new Error('Usuario no encontrado');
      case 'auth/wrong-password':
        return new Error('Contraseña incorrecta');
      default:
        return new Error('Error de autenticación');
    }
  }
}
```

2. **Firestore - Base de Datos**
```typescript
// services/firebase/firestore.service.ts
import firestore from '@react-native-firebase/firestore';

export class FirestoreService<T> {
  constructor(private collectionName: string) {}

  async create(id: string, data: T): Promise<void> {
    await firestore()
      .collection(this.collectionName)
      .doc(id)
      .set(data);
  }

  async read(id: string): Promise<T | null> {
    const doc = await firestore()
      .collection(this.collectionName)
      .doc(id)
      .get();
    
    return doc.exists ? (doc.data() as T) : null;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await firestore()
      .collection(this.collectionName)
      .doc(id)
      .update(data);
  }

  async delete(id: string): Promise<void> {
    await firestore()
      .collection(this.collectionName)
      .doc(id)
      .delete();
  }

  async list(queryFn?: (query: any) => any): Promise<T[]> {
    let query = firestore().collection(this.collectionName);
    
    if (queryFn) {
      query = queryFn(query);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as T);
  }

  // Escuchar cambios en tiempo real
  subscribe(
    callback: (data: T[]) => void,
    errorCallback?: (error: Error) => void
  ): () => void {
    return firestore()
      .collection(this.collectionName)
      .onSnapshot(
        (snapshot) => {
          const data = snapshot.docs.map(doc => doc.data() as T);
          callback(data);
        },
        errorCallback
      );
  }
}

// Uso específico para cada módulo
export const studentService = new FirestoreService<Student>('students');
export const professorService = new FirestoreService<Professor>('professors');
export const courseService = new FirestoreService<Course>('courses');
export const attendanceService = new FirestoreService<AttendanceRecord>('attendance');
```

3. **Firebase Storage - Almacenamiento de Imágenes**
```typescript
// services/firebase/storage.service.ts
import storage from '@react-native-firebase/storage';

export class StorageService {
  async uploadImage(
    uri: string,
    path: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const reference = storage().ref(path);
    const task = reference.putFile(uri);

    if (onProgress) {
      task.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      });
    }

    await task;
    return await reference.getDownloadURL();
  }

  async deleteImage(path: string): Promise<void> {
    await storage().ref(path).delete();
  }

  async getImageUrl(path: string): Promise<string> {
    return await storage().ref(path).getDownloadURL();
  }
}

// Ejemplo de uso para foto de perfil
const uploadProfilePhoto = async (
  userId: string,
  photoUri: string
): Promise<string> => {
  const storageService = new StorageService();
  const path = `profiles/${userId}/photo.jpg`;
  return await storageService.uploadImage(photoUri, path);
};
```

4. **Firebase Cloud Messaging - Notificaciones Push**
```typescript
// services/firebase/messaging.service.ts
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

export class MessagingService {
  async requestPermission(): Promise<boolean> {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }

  async getToken(): Promise<string> {
    return await messaging().getToken();
  }

  setupListeners(): void {
    // Notificación cuando la app está en foreground
    messaging().onMessage(async (remoteMessage) => {
      await this.displayNotification(remoteMessage);
    });

    // Notificación cuando la app está en background/closed
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Mensaje en background:', remoteMessage);
    });
  }

  private async displayNotification(remoteMessage: any): Promise<void> {
    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher',
      },
    });
  }

  // Enviar notificación desde el servidor (backend)
  async sendNotificationToUser(
    userId: string,
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    // Esto se hace desde el backend usando Firebase Admin SDK
    // Aquí solo mostramos la estructura
  }
}

// Casos de uso:
// 1. Notificar a profesor cuando estudiante falta a clase
// 2. Recordatorios de tareas o exámenes
// 3. Anuncios importantes de la institución
// 4. Confirmación de calificaciones publicadas
```

**b) APIs REST Externas**

**Ejemplo 1: API de Consulta de Información Académica**
```typescript
// services/api/academic.service.ts
import axios, { AxiosInstance } from 'axios';

export class AcademicAPIService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.institution.edu.mx',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token
    this.api.interceptors.request.use((config) => {
      const token = this.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado, redirigir a login
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  async getStudentGrades(studentId: string): Promise<Grade[]> {
    const response = await this.api.get(`/students/${studentId}/grades`);
    return response.data;
  }

  async getInstitutionCalendar(): Promise<CalendarEvent[]> {
    const response = await this.api.get('/calendar');
    return response.data;
  }

  private getAuthToken(): string | null {
    // Obtener token del storage
    return null; // Implementar según tu sistema
  }

  private handleUnauthorized(): void {
    // Manejar sesión expirada
  }
}
```

**Ejemplo 2: API de Validación de Documentos**
```typescript
// Integración con servicio de OCR para validar credenciales
import { RNCamera } from 'react-native-camera';

export class DocumentValidationService {
  async validateStudentID(imageUri: string): Promise<ValidationResult> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'credential.jpg',
    });

    const response = await axios.post(
      'https://api.ocr-service.com/validate',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'API-Key': 'YOUR_API_KEY',
        },
      }
    );

    return response.data;
  }
}

interface ValidationResult {
  valid: boolean;
  studentId?: string;
  name?: string;
  expirationDate?: string;
  confidence: number;
}
```

**c) APIs Nativas de React Native**

**1. AsyncStorage - Almacenamiento Local**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export class LocalStorageService {
  async saveData<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error al guardar datos:', error);
    }
  }

  async getData<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error al obtener datos:', error);
      return null;
    }
  }

  async removeData(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async clearAll(): Promise<void> {
    await AsyncStorage.clear();
  }
}

// Uso: Guardar preferencias del usuario, caché de datos, etc.
```

**2. NetInfo - Estado de Conexión**
```typescript
import NetInfo from '@react-native-community/netinfo';

export class NetworkService {
  async checkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }

  subscribeToConnectionChanges(
    callback: (isConnected: boolean) => void
  ): () => void {
    return NetInfo.addEventListener((state) => {
      callback(state.isConnected ?? false);
    });
  }
}

// Uso: Mostrar mensaje de "sin conexión" y habilitar modo offline
```

**3. Share - Compartir Contenido**
```typescript
import { Share } from 'react-native';

export const shareAttendanceReport = async (reportData: string): Promise<void> => {
  try {
    await Share.share({
      message: reportData,
      title: 'Reporte de Asistencia',
    });
  } catch (error) {
    console.error('Error al compartir:', error);
  }
};

// Uso: Compartir reportes, boletas, horarios con padres/tutores
```

**4. Permissions - Manejo de Permisos**
```typescript
import { PermissionsAndroid, Platform } from 'react-native';

export class PermissionsService {
  async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS maneja permisos automáticamente
  }

  async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }
}
```

---

## 🏗️ Estructura de Proyecto TypeScript Propuesta

```
school-management-app/
├── src/
│   ├── types/                          # Definiciones TypeScript
│   │   ├── auth.types.ts
│   │   ├── student.types.ts
│   │   ├── professor.types.ts
│   │   ├── course.types.ts
│   │   ├── attendance.types.ts
│   │   ├── grade.types.ts
│   │   ├── location.types.ts
│   │   └── api.types.ts
│   │
│   ├── services/                       # Servicios
│   │   ├── firebase/
│   │   │   ├── auth.service.ts
│   │   │   ├── firestore.service.ts
│   │   │   ├── storage.service.ts
│   │   │   └── messaging.service.ts
│   │   ├── api/
│   │   │   └── academic.service.ts
│   │   ├── location/
│   │   │   └── location.service.ts
│   │   ├── camera/
│   │   │   └── camera.service.ts
│   │   └── storage/
│   │       └── local-storage.service.ts
│   │
│   ├── screens/                        # Pantallas
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── students/
│   │   │   ├── StudentListScreen.tsx
│   │   │   ├── StudentDetailScreen.tsx
│   │   │   └── StudentFormScreen.tsx
│   │   ├── professors/
│   │   ├── courses/
│   │   ├── attendance/
│   │   │   ├── TakeAttendanceScreen.tsx    # Con geolocalización
│   │   │   └── AttendanceMapScreen.tsx      # Mapa de asistencias
│   │   └── reports/
│   │
│   ├── components/                     # Componentes reutilizables
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── camera/
│   │   │   └── CameraCapture.tsx
│   │   ├── maps/
│   │   │   └── LocationPicker.tsx
│   │   └── contacts/
│   │       └── ContactPicker.tsx
│   │
│   ├── hooks/                          # Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useLocation.ts
│   │   ├── useCamera.ts
│   │   └── useFirestore.ts
│   │
│   ├── utils/                          # Utilidades
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   │
│   └── navigation/                     # Navegación
│       ├── AppNavigator.tsx
│       ├── AuthNavigator.tsx
│       └── MainNavigator.tsx
│
├── demos/                              # Proyectos demo independientes
│   ├── sensors-demo/                   # Demo de acelerómetro y giroscopio
│   │   ├── AccelerometerDemo.tsx
│   │   ├── GyroscopeDemo.tsx
│   │   └── ShakeDetectorDemo.tsx
│   │
│   └── ar-demo/                        # Demo de Realidad Aumentada
│       └── ARSceneDemo.tsx
│
├── android/
├── ios/
├── tsconfig.json
├── package.json
└── README.md
```

---

## 📦 Dependencias TypeScript Necesarias

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "^0.73.0",
    
    // Firebase
    "@react-native-firebase/app": "^19.0.0",
    "@react-native-firebase/auth": "^19.0.0",
    "@react-native-firebase/firestore": "^19.0.0",
    "@react-native-firebase/storage": "^19.0.0",
    "@react-native-firebase/messaging": "^19.0.0",
    
    // Cámara e Imágenes
    "react-native-image-picker": "^7.0.0",
    "react-native-image-resizer": "^3.0.0",
    "react-native-image-crop-picker": "^0.40.0",
    
    // Localización y Mapas
    "@react-native-community/geolocation": "^3.1.0",
    "react-native-maps": "^1.10.0",
    "react-native-geocoding": "^0.5.0",
    
    // Contactos y Comunicación
    "react-native-contacts": "^7.0.0",
    
    // Sensores (para demos)
    "react-native-sensors": "^7.3.6",
    "expo-sensors": "^13.0.0",
    
    // APIs Nativas
    "@react-native-async-storage/async-storage": "^1.21.0",
    "@react-native-community/netinfo": "^11.0.0",
    "@notifee/react-native": "^7.8.0",
    
    // HTTP
    "axios": "^1.6.0",
    
    // Navegación
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    
    // Utilidades
    "date-fns": "^3.0.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.73.0",
    "typescript": "^5.3.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0"
  }
}
```

---

## 🎓 Plan de Implementación por Sesiones

### **Sesión 1-2: Funciones Básicas del Dispositivo**
- Configurar TypeScript en el proyecto
- Implementar llamadas telefónicas en módulo Profesor/Alumno
- Agregar enlaces a recursos en Materias
- Selector de contactos para emergencias

**Entregables:**
- Perfil de alumno con teléfono clickeable
- Lista de materias con enlaces externos
- Formulario de registro con selector de contacto de emergencia

---

### **Sesión 3-4: Cámara y Manipulación de Imágenes**
- Implementar captura de foto de perfil
- Foto de credencial para alumnos
- Optimización y compresión de imágenes
- Integración con Firebase Storage

**Entregables:**
- Módulo de registro con foto
- Galería de fotos de alumnos
- Upload/download de imágenes en Firebase

---

### **Sesión 5: Demo de Sensores**
- Proyecto demo independiente
- Acelerómetro: detector de movimiento
- Giroscopio: medidor de orientación
- Ejemplos prácticos: shake detector, nivelador

**Entregables:**
- App demo funcional de sensores
- Documentación de uso de cada sensor

---

### **Sesión 6-7: Geolocalización y Mapas**
- Implementar geolocalización en asistencias
- Geofencing del campus
- Mapa de visualización de asistencias
- Geocoding inverso para direcciones

**Entregables:**
- Tomar asistencia con ubicación
- Pantalla de mapa con marcadores de asistencias
- Validación de ubicación dentro del campus

---

### **Sesión 8: Demo de Realidad Aumentada**
- Proyecto demo independiente
- Configurar ViroReact o ARKit
- Ejemplos básicos: texto 3D, objetos virtuales
- Detección de planos

**Entregables:**
- App demo funcional de AR
- Ejemplos visuales para los alumnos

---

### **Sesión 9-11: Firebase y Servicios Externos**
- Configurar Firebase proyecto
- Implementar Authentication
- CRUD con Firestore
- Storage de imágenes
- Push Notifications

**Entregables:**
- Sistema de autenticación completo
- Base de datos en la nube funcional
- Notificaciones push operativas

---

### **Sesión 12: APIs REST y Nativas**
- Consumir API externa de ejemplo
- AsyncStorage para caché
- NetInfo para detección de conexión
- Share API para compartir reportes

**Entregables:**
- Integración con API REST
- Modo offline con caché local
- Función de compartir reportes

---

## 📝 Recomendaciones Finales

### **Para Integración Directa:**
1. ✅ Llamadas, enlaces, contactos
2. ✅ Cámara y fotos de perfil
3. ✅ Geolocalización en asistencias
4. ✅ Firebase como backend
5. ✅ APIs REST y nativas

### **Para Demos Independientes:**
1. ⚠️ Sensores (acelerómetro, giroscopio)
2. ⚠️ Realidad Aumentada

### **Ventajas de esta Propuesta:**
- **Relevancia Práctica:** Las funciones integradas tienen uso real en la app
- **Aprendizaje Completo:** Los demos enseñan tecnologías avanzadas sin forzar su uso
- **TypeScript:** Código más robusto y mantenible
- **Escalabilidad:** Firebase permite crecimiento futuro
- **Portfolio:** Los alumnos tendrán una app completa y demos impresionantes

---

## 🚀 Próximos Pasos

1. **Revisar y aprobar** esta propuesta
2. **Configurar** el proyecto base en TypeScript
3. **Planificar** el calendario de sesiones
4. **Preparar** material didáctico para cada tema
5. **Crear** repositorio Git con estructura base

---

## 📚 Recursos Adicionales Sugeridos

- **Documentación Oficial:**
  - React Native: https://reactnative.dev/docs/getting-started
  - TypeScript: https://www.typescriptlang.org/docs/
  - Firebase: https://rnfirebase.io/
  
- **Tutoriales Recomendados:**
  - React Native Maps: https://github.com/react-native-maps/react-native-maps
  - React Native Camera: https://react-native-camera.github.io/react-native-camera/
  - ViroReact AR: https://viro-community.readme.io/

---

**Documento preparado para:** Materia de Programación Móvil  
**Versión:** 1.0  
**Fecha:** Octubre 2025  
**Tecnología:** React Native + TypeScript
