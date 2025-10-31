# 🚀 Guía Completa: Desde Proyecto Local a GitHub con Estrategia de Ramas

## 📋 Tu Situación Actual

- ✅ **Tienes**: Proyecto React Native funcionando localmente
- ❌ **No tienes**: Repositorio en GitHub
- 🎯 **Objetivo**: Configurar GitHub + estrategia de ramas para CRUDAlumnos y CRUDProfesores

## 🎯 Plan Completo

```
1. Configurar Git local
2. Crear repositorio en GitHub
3. Conectar proyecto local con GitHub
4. Configurar estrategia de ramas
5. Trabajar con CRUDAlumnos
6. Crear CRUDProfesores
7. Plan de respaldo
```

---

## 🛠️ PASO 1: Configurar Git en tu Proyecto Local

### 1.1 Verificar si Git está inicializado
```bash
# Navegar a tu carpeta del proyecto
cd ruta/a/tu/app-demos

# Verificar si ya hay Git
ls -la
# Si ves una carpeta .git, ya está inicializado
# Si no la ves, continúa con el siguiente paso
```

### 1.2 Inicializar Git (si no existe)
```bash
# Inicializar repositorio Git
git init

# Configurar tu información (solo la primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"

# Verificar configuración
git config --list
```

### 1.3 Crear .gitignore
```bash
# Crear archivo .gitignore en la raíz del proyecto
touch .gitignore
```

Agrega este contenido al `.gitignore`:
```gitignore
# Node modules
node_modules/

# Expo
.expo/
dist/
web-build/

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# Debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local
.env

# Logs
logs
*.log

# IDE
.vscode/
.idea/

# OS generated files
Thumbs.db
```

### 1.4 Hacer commit inicial
```bash
# Agregar todos los archivos
git add .

# Verificar qué se agregará
git status

# Hacer primer commit
git commit -m "feat: Configuración inicial del proyecto escolar

- Estructura base React Native con Expo
- Navegación con React Navigation
- Pantallas de Login y Home funcionales
- Listado básico de alumnos
- Tipos TypeScript configurados"
```

---

## 🌐 PASO 2: Crear Repositorio en GitHub

### 2.1 Crear repositorio en GitHub.com
1. Ve a [GitHub.com](https://github.com)
2. Haz clic en "New repository" (botón verde)
3. Configurar:
   - **Repository name**: `app-demos-escolar` (o el nombre que prefieras)
   - **Description**: `Sistema de gestión escolar - React Native`
   - **Visibility**: 
     - ✅ **Public** (recomendado para proyectos educativos)
     - ⚪ Private (si prefieres que solo tú lo veas)
   - ❌ **NO marcar** "Add a README file"
   - ❌ **NO marcar** "Add .gitignore"
   - ❌ **NO marcar** "Choose a license"
4. Clic en "Create repository"

### 2.2 GitHub te mostrará instrucciones
**NO HAGAS NADA AÚN**, solo copia la URL que aparece:
```
https://github.com/TU-USUARIO/app-demos-escolar.git
```

---

## 🔗 PASO 3: Conectar Proyecto Local con GitHub

### 3.1 Agregar repositorio remoto
```bash
# Conectar tu proyecto local con GitHub
git remote add origin https://github.com/TU-USUARIO/app-demos-escolar.git

# Verificar que se agregó correctamente
git remote -v
```

### 3.2 Subir código inicial a GitHub
```bash
# Crear rama main y subir
git branch -M main
git push -u origin main
```

### 3.3 Verificar en GitHub
- Ve a tu repositorio en GitHub
- Deberías ver todos tus archivos
- ✅ **¡Felicidades! Tu proyecto ya está en GitHub**

---

## 🌳 PASO 4: Configurar Estrategia de Ramas

### 4.1 Crear rama develop
```bash
# Crear rama de desarrollo
git checkout -b develop
git push -u origin develop
```

### 4.2 Configurar rama principal en GitHub
1. Ve a tu repositorio en GitHub
2. Clic en "Settings" (arriba derecha)
3. En el menú izquierdo: "Branches"
4. En "Default branch", cambiar de `main` a `develop`
5. Confirmar el cambio

### 4.3 Estructura final de ramas
```
main (producción - estable)
├── develop (desarrollo principal) ← RAMA POR DEFECTO
├── CRUDAlumnos (primera funcionalidad)
└── CRUDProfesores (segunda funcionalidad)
```

---

## 📚 PASO 5: Trabajar en CRUDAlumnos

### 5.1 Crear rama para CRUD de Alumnos
```bash
# Asegurar que estás en develop
git checkout develop

# Crear rama para alumnos
git checkout -b CRUDAlumnos
git push -u origin CRUDAlumnos
```

### 5.2 Trabajar en la funcionalidad
```bash
# Mientras desarrollas...

# Commits frecuentes
git add [archivos-modificados]
git commit -m "feat: Agregar formulario de creación de alumnos"

git add .
git commit -m "feat: Implementar edición de alumnos"

git add .
git commit -m "feat: Agregar confirmación para eliminar alumnos"

# Subir cambios regularmente
git push origin CRUDAlumnos
```

### 5.3 Crear punto de respaldo
```bash
# Cuando CRUDAlumnos esté completo
git tag -a v1.0-CRUDAlumnos -m "CRUD de Alumnos completado y funcional"
git push origin v1.0-CRUDAlumnos
```

---

## 👨‍🏫 PASO 6: Crear CRUDProfesores

### 6.1 Crear nueva rama basada en CRUDAlumnos
```bash
# Asegurar que CRUDAlumnos está actualizado
git checkout CRUDAlumnos
git pull origin CRUDAlumnos

# Crear nueva rama para profesores
git checkout -b CRUDProfesores
git push -u origin CRUDProfesores
```

### 6.2 Desarrollar funcionalidad de profesores
```bash
# Trabajar en ProfesorScreen.tsx, ProfesorFormModal.tsx, etc.

# Commits organizados
git add src/screens/profesores/
git commit -m "feat: Implementar CRUD básico de profesores"

git add src/components/utils/ProfesorFormModal.tsx
git commit -m "feat: Agregar modal de formulario para profesores"

git add .
git commit -m "feat: Completar validaciones y filtros para profesores"

# Subir progreso
git push origin CRUDProfesores
```

---

## 🆘 PASO 7: Plan de Respaldo - Si Algo Sale Mal

### 7.1 Si CRUDProfesores tiene problemas

#### Opción A: Volver a CRUDAlumnos (funcionando)
```bash
git checkout CRUDAlumnos
# Tu código de alumnos sigue funcionando perfectamente
```

#### Opción B: Restaurar desde tag de respaldo
```bash
# Ver todos los tags disponibles
git tag -l

# Crear nueva rama desde el punto de respaldo
git checkout -b CRUDAlumnos-restaurado v1.0-CRUDAlumnos
```

#### Opción C: Revertir cambios específicos
```bash
# En CRUDProfesores, ver historial
git log --oneline

# Volver a un commit específico que funcionaba
git reset --hard [HASH-DEL-COMMIT-BUENO]
```

### 7.2 Si pierdes conexión con GitHub
```bash
# Verificar conexión
git remote -v

# Reconectar si es necesario
git remote set-url origin https://github.com/TU-USUARIO/app-demos-escolar.git
```

---

## 🔄 PASO 8: Fusión Final (Cuando Todo Esté Listo)

### 8.1 Fusionar CRUDProfesores a develop
```bash
# Cambiar a develop
git checkout develop
git pull origin develop

# Fusionar CRUDProfesores
git merge CRUDProfesores
git push origin develop
```

### 8.2 Crear release final
```bash
# Tag de versión completa
git tag -a v2.0-CRUDCompleto -m "Sistema completo: CRUD Alumnos y Profesores"
git push origin v2.0-CRUDCompleto

# Fusionar a main para producción
git checkout main
git merge develop
git push origin main
```

---

## 📝 Comandos de Referencia Rápida

### Comandos Esenciales
```bash
# Estado actual
git status
git branch
git remote -v

# Cambiar ramas
git checkout [nombre-rama]
git checkout -b [nueva-rama]

# Sincronizar
git pull origin [rama]
git push origin [rama]

# Respaldos
git tag -a [nombre] -m "mensaje"
git push origin [tag]
```

### Verificación Antes de Empezar
```bash
# Ejecutar en tu proyecto para verificar todo
pwd                    # Ver dónde estás
ls -la                 # Ver archivos del proyecto
git status            # Ver estado de Git
git remote -v         # Ver conexiones remotas
```

---

## ⚠️ Checklist Antes de Empezar

### ✅ Verificar que tienes:
- [ ] Node.js instalado (`node --version`)
- [ ] Git instalado (`git --version`)
- [ ] Cuenta de GitHub creada
- [ ] Proyecto React Native funcionando localmente
- [ ] Terminal/consola abierta en la carpeta del proyecto

### ✅ Verificar archivos del proyecto:
- [ ] `package.json` existe
- [ ] `App.tsx` existe  
- [ ] Carpeta `src/` con tus pantallas
- [ ] La app se ejecuta con `npm start` o `expo start`

---

## 🚀 ¡Empezar AHORA!

### Comando para verificar que todo está listo:
```bash
# Ejecutar en la carpeta de tu proyecto
echo "=== VERIFICACIÓN DEL PROYECTO ===" && \
pwd && \
echo "--- Archivos principales ---" && \
ls -la package.json App.tsx 2>/dev/null && \
echo "--- Estado de Git ---" && \
git status 2>/dev/null || echo "Git no inicializado (normal)" && \
echo "=== LISTO PARA CONFIGURAR GITHUB ==="
```

### Primer comando a ejecutar:
```bash
# Si Git no está inicializado
git init
```

---

## 🎯 Resultado Final

Al completar esta guía tendrás:

✅ **Proyecto en GitHub**: Respaldado y accesible desde cualquier lugar
✅ **Estrategia de ramas**: Profesional y segura
✅ **CRUDAlumnos**: Funcionalidad completa en rama dedicada
✅ **CRUDProfesores**: Nueva funcionalidad basada en la anterior
✅ **Sistema de respaldo**: Tags y puntos de recuperación
✅ **Experiencia real**: Conocimiento práctico de Git/GitHub

---

**¡Empezemos! 🚀**

¿Tienes alguna duda sobre algún paso específico o estás listo para comenzar con la inicialización de Git?