// Ejemplos prácticos de queries

// 1. Filtrar por múltiples condiciones
const urgentTasks = realm
  .objects<Task>("Task")
  .filtered('priority == "high" AND completed == false');

// 2. Búsqueda case-insensitive
const searchResults = realm
  .objects<Task>("Task")
  .filtered("title CONTAINS[c] $0", searchTerm);

// 3. Filtrar por fecha
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayTasks = realm.objects<Task>("Task").filtered("dueDate >= $0", today);

// 4. Ordenar
const sortedTasks = realm.objects<Task>("Task").sorted([
  ["priority", false], // descendente
  ["createdAt", true], // ascendente
]);

// 5. Contar
const pendingCount = realm
  .objects<Task>("Task")
  .filtered("completed == false").length;

// 6. Query con relaciones
const tasksInCategory = realm
  .objects<Task>("Task")
  .filtered("category.name == $0", "Trabajo");
