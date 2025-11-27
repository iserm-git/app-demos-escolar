// screens/NotesFileScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import FileService from "../services/FileService";

const NotesFileScreen: React.FC = () => {
  const [notes, setNotes] = useState<string[]>([]);

  // EXPORTAR NOTAS A JSON
  const handleExport = async () => {
    try {
      const data = JSON.stringify(notes, null, 2);
      const fileName = `notes_${Date.now()}.json`;
      await FileService.saveFile(fileName, data);
      await FileService.shareFile(fileName);
      Alert.alert("Éxito", "Notas exportadas correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo exportar");
    }
  };

  // IMPORTAR NOTAS DESDE ARCHIVO
  const handleImport = async () => {
    try {
      const result = await FileService.pickDocument();

      if (result.canceled) return;

      const asset = result.assets[0];
      const content = await FileService.readFile(asset.name);
      const importedNotes = JSON.parse(content);
      setNotes(importedNotes);
      Alert.alert("Éxito", `${importedNotes.length} notas importadas`);
    } catch (error) {
      Alert.alert("Error", "Archivo inválido");
    }
  };

  // GUARDAR NOTA
  const handleSaveNote = async () => {
    const newNote = `Nota ${notes.length + 1}`;
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);

    // Auto-guardar
    const data = JSON.stringify(updatedNotes);
    await FileService.saveFile("autosave.json", data);
  };

  // LISTAR ARCHIVOS GUARDADOS
  const handleListFiles = async () => {
    const files = await FileService.listFiles();
    Alert.alert("Archivos", files.join("\n"));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Archivos</Text>

      <ScrollView style={styles.notesList}>
        {notes.map((note, index) => (
          <Text key={index} style={styles.noteItem}>
            {note}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="Agregar Nota" onPress={handleSaveNote} />
        <Button title="Exportar JSON" onPress={handleExport} color="#2ecc71" />
        <Button title="Importar JSON" onPress={handleImport} color="#3498db" />
        <Button
          title="Ver Archivos"
          onPress={handleListFiles}
          color="#9b59b6"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  notesList: { flex: 1, marginBottom: 20 },
  noteItem: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
    borderRadius: 4,
  },
  buttonContainer: { gap: 10 },
});

export default NotesFileScreen;
