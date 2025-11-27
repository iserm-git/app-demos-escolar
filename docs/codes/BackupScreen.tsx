// screens/BackupScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import BackupService from "../services/BackupService";
import * as DocumentPicker from "expo-document-picker";

const BackupScreen: React.FC = () => {
  const [backups, setBackups] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBackups();
    loadStats();
  }, []);

  const loadBackups = async () => {
    const backupList = await BackupService.listBackups();
    setBackups(backupList);
  };

  const loadStats = async () => {
    const backupStats = await BackupService.getBackupStats();
    setStats(backupStats);
  };

  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      await BackupService.createBackup();
      await loadBackups();
      await loadStats();
      Alert.alert("Éxito", "Backup creado correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el backup");
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreBackup = (backupUri: string, date: Date) => {
    Alert.alert(
      "Restaurar Backup",
      `¿Restaurar backup del ${date.toLocaleString(
        "es-MX"
      )}? Esto sobrescribirá todos los datos actuales.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Restaurar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await BackupService.restoreFromBackup(backupUri);
              Alert.alert("Éxito", "Datos restaurados correctamente");
            } catch (error) {
              Alert.alert("Error", "No se pudo restaurar");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleExportBackup = async (backupUri: string) => {
    try {
      await BackupService.exportBackup(backupUri);
    } catch (error) {
      Alert.alert("Error", "No se pudo exportar");
    }
  };

  const handleImportBackup = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      await BackupService.importBackup(result.assets[0].uri);
      await loadBackups();
      Alert.alert("Éxito", "Backup importado");
    } catch (error) {
      Alert.alert("Error", "No se pudo importar");
    }
  };

  const renderBackupItem = ({ item }: any) => (
    <View style={styles.backupItem}>
      <View style={styles.backupInfo}>
        <Text style={styles.backupDate}>
          {item.date.toLocaleString("es-MX")}
        </Text>
        <Text style={styles.backupSize}>
          {(item.size / 1024).toFixed(2)} KB
        </Text>
        {item.metadata && (
          <Text style={styles.backupKeys}>
            {item.metadata.dataKeys.length} elementos
          </Text>
        )}
      </View>
      <View style={styles.backupActions}>
        <TouchableOpacity
          onPress={() => handleRestoreBackup(item.uri, item.date)}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>Restaurar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleExportBackup(item.uri)}
          style={[styles.actionButton, styles.exportButton]}
        >
          <Text style={styles.actionText}>Compartir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Backups</Text>

      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            📦 Total: {stats.totalBackups} backups ({stats.totalSizeMB} MB)
          </Text>
          {stats.newestBackup && (
            <Text style={styles.statsText}>
              🕐 Último: {stats.newestBackup.toLocaleString("es-MX")}
            </Text>
          )}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Crear Backup Ahora"
          onPress={handleCreateBackup}
          disabled={loading}
        />
        <Button
          title="Importar Backup"
          onPress={handleImportBackup}
          color="#3498db"
        />
      </View>

      {loading && (
        <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
      )}

      <Text style={styles.listTitle}>Backups Disponibles:</Text>
      <FlatList
        data={backups}
        keyExtractor={(item) => item.fileName}
        renderItem={renderBackupItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay backups disponibles</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  statsContainer: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  statsText: { fontSize: 14, color: "#1976d2", marginBottom: 5 },
  buttonContainer: { gap: 10, marginBottom: 20 },
  listTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  backupItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  backupInfo: { marginBottom: 10 },
  backupDate: { fontSize: 16, fontWeight: "bold", color: "#333" },
  backupSize: { fontSize: 14, color: "#666", marginTop: 4 },
  backupKeys: { fontSize: 12, color: "#999", marginTop: 2 },
  backupActions: { flexDirection: "row", gap: 10 },
  actionButton: {
    backgroundColor: "#4caf50",
    padding: 8,
    borderRadius: 4,
    flex: 1,
    alignItems: "center",
  },
  exportButton: { backgroundColor: "#2196f3" },
  actionText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  emptyText: { textAlign: "center", color: "#999", marginTop: 20 },
});

export default BackupScreen;
