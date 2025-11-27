// screens/ExportDataScreen.tsx
import React, { useState } from "react";
import { View, Button, Text, Alert, StyleSheet } from "react-native";
import CSVExportService from "../services/CSVExportService";
import * as DocumentPicker from "expo-document-picker";

const ExportDataScreen: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  // Datos de ejemplo
  const salesData = [
    {
      id: 1,
      producto: "Laptop",
      cantidad: 5,
      precio: 15000,
      fecha: "2024-01-15",
    },
    {
      id: 2,
      producto: "Mouse",
      cantidad: 20,
      precio: 250,
      fecha: "2024-01-16",
    },
    {
      id: 3,
      producto: "Teclado",
      cantidad: 15,
      precio: 800,
      fecha: "2024-01-17",
    },
    {
      id: 4,
      producto: 'Monitor, 24"',
      cantidad: 8,
      precio: 3500,
      fecha: "2024-01-18",
    },
  ];

  // Exportar simple
  const handleSimpleExport = async () => {
    try {
      await CSVExportService.exportAndShare(salesData, "ventas");
      Alert.alert("Éxito", "Archivo CSV exportado");
    } catch (error) {
      Alert.alert("Error", "No se pudo exportar");
    }
  };

  // Exportar con formato personalizado
  const handleCustomExport = async () => {
    try {
      await CSVExportService.exportWithTemplate(
        salesData,
        "ventas_formateadas",
        {
          headers: [
            { key: "id", label: "ID" },
            { key: "producto", label: "Producto" },
            { key: "cantidad", label: "Cantidad" },
            { key: "precio", label: "Precio Unitario" },
            { key: "total", label: "Total" },
            { key: "fecha", label: "Fecha" },
          ],
          formatters: {
            precio: (val) => `$${val.toFixed(2)}`,
            total: (val) => {
              const item = salesData.find((d) => d.id === val);
              return item ? `$${(item.cantidad * item.precio).toFixed(2)}` : "";
            },
            fecha: (val) => new Date(val).toLocaleDateString("es-MX"),
          },
        }
      );

      const fileUri = await CSVExportService.exportWithTemplate(
        salesData.map((item) => ({
          ...item,
          total: item.cantidad * item.precio,
        })),
        "ventas_formateadas",
        {
          headers: [
            { key: "producto", label: "Producto" },
            { key: "cantidad", label: "Cantidad" },
            { key: "precio", label: "Precio" },
            { key: "total", label: "Total" },
          ],
        }
      );

      await CSVExportService.exportAndShare(
        salesData.map((item) => ({
          ...item,
          total: item.cantidad * item.precio,
        })),
        "ventas_formateadas",
        ["producto", "cantidad", "precio", "total"]
      );

      Alert.alert("Éxito", "Archivo formateado exportado");
    } catch (error) {
      Alert.alert("Error", "No se pudo exportar");
    }
  };

  // Importar CSV
  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const data = await CSVExportService.importFromCSV(result.assets[0].uri);
      setStats({
        registros: data.length,
        columnas: Object.keys(data[0] || {}).length,
      });
      Alert.alert("Éxito", `${data.length} registros importados`);
    } catch (error) {
      Alert.alert("Error", "Archivo CSV inválido");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exportar/Importar CSV</Text>

      <Text style={styles.subtitle}>Datos: {salesData.length} registros</Text>

      <View style={styles.buttonContainer}>
        <Button title="Exportar CSV Simple" onPress={handleSimpleExport} />
        <Button
          title="Exportar CSV Formateado"
          onPress={handleCustomExport}
          color="#2ecc71"
        />
        <Button title="Importar CSV" onPress={handleImport} color="#3498db" />
      </View>

      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Importado: {stats.registros} registros, {stats.columnas} columnas
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
  buttonContainer: { gap: 15 },
  statsContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
  },
  statsText: { fontSize: 14, color: "#2e7d32" },
});

export default ExportDataScreen;
