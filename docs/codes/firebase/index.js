// functions/index.js (Backend)
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Trigger cuando se crea una tarea
exports.onTaskCreated = functions.firestore
  .document("tasks/{taskId}")
  .onCreate(async (snap, context) => {
    const task = snap.data();
    console.log("Nueva tarea creada:", task.title);

    // Enviar notificación, actualizar contadores, etc.
  });
