// screens/PdfDownloadScreen.tsx
import React, { useState } from "react";
import { View, Button, Text, ActivityIndicator } from "react-native";
import FileService from "../services/FileService";
import * as Sharing from "expo-sharing";

const PdfDownloadScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [downloadedFile, setDownloadedFile] = useState<string | null>(null);

  const downloadPdf = async () => {
    setLoading(true);
    try {
      const url =
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
      const fileName = "documento.pdf";

      const fileUri = await FileService.downloadFile(url, fileName);
      setDownloadedFile(fileUri);
      alert("PDF descargado exitosamente");
    } catch (error) {
      alert("Error al descargar");
    } finally {
      setLoading(false);
    }
  };

  const sharePdf = async () => {
    if (downloadedFile) {
      await Sharing.shareAsync(downloadedFile);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Button title="Descargar PDF" onPress={downloadPdf} disabled={loading} />
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {downloadedFile && (
        <>
          <Text style={{ marginTop: 20 }}>✅ Archivo listo</Text>
          <Button title="Compartir PDF" onPress={sharePdf} color="#2ecc71" />
        </>
      )}
    </View>
  );
};

export default PdfDownloadScreen;
