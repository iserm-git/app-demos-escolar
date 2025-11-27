// services/CSVExportService.ts
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

class CSVExportService {
  // Convertir array de objetos a CSV
  private arrayToCSV(data: any[], headers?: string[]): string {
    if (data.length === 0) return "";

    // Usar headers proporcionadas o extraer del primer objeto
    const csvHeaders = headers || Object.keys(data[0]);

    // Función para escapar valores
    const escapeCSVValue = (value: any): string => {
      if (value === null || value === undefined) return "";

      const stringValue = String(value);

      // Si contiene coma, comillas o saltos de línea, envolver en comillas
      if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    };

    // Crear línea de encabezados
    const headerLine = csvHeaders.map(escapeCSVValue).join(",");

    // Crear líneas de datos
    const dataLines = data.map((row) => {
      return csvHeaders.map((header) => escapeCSVValue(row[header])).join(",");
    });

    return [headerLine, ...dataLines].join("\n");
  }

  // Exportar datos a CSV
  async exportToCSV(
    data: any[],
    fileName: string,
    headers?: string[]
  ): Promise<string> {
    try {
      if (data.length === 0) {
        throw new Error("No hay datos para exportar");
      }

      // Convertir a CSV
      const csvContent = this.arrayToCSV(data, headers);

      // Agregar BOM para compatibilidad con Excel (UTF-8)
      const bom = "\uFEFF";
      const csvWithBOM = bom + csvContent;

      // Generar nombre de archivo con timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const fullFileName = fileName.endsWith(".csv")
        ? fileName
        : `${fileName}_${timestamp}.csv`;

      // Guardar archivo
      const fileUri = `${FileSystem.documentDirectory}${fullFileName}`;
      await FileSystem.writeAsStringAsync(fileUri, csvWithBOM, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      return fileUri;
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      throw error;
    }
  }

  // Exportar y compartir
  async exportAndShare(
    data: any[],
    fileName: string,
    headers?: string[]
  ): Promise<void> {
    const fileUri = await this.exportToCSV(data, fileName, headers);
    await Sharing.shareAsync(fileUri, {
      mimeType: "text/csv",
      dialogTitle: "Exportar CSV",
    });
  }

  // Importar desde CSV
  async importFromCSV(fileUri: string): Promise<any[]> {
    try {
      const content = await FileSystem.readAsStringAsync(fileUri);

      // Remover BOM si existe
      const cleanContent = content.replace(/^\uFEFF/, "");

      // Dividir en líneas
      const lines = cleanContent.split("\n").filter((line) => line.trim());

      if (lines.length === 0) {
        throw new Error("Archivo CSV vacío");
      }

      // Parsear CSV (maneja comillas y comas dentro de valores)
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];

          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              current += '"';
              i++; // Skip next quote
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === "," && !inQuotes) {
            result.push(current);
            current = "";
          } else {
            current += char;
          }
        }
        result.push(current);
        return result;
      };

      // Extraer headers
      const headers = parseCSVLine(lines[0]);

      // Parsear datos
      const data = lines.slice(1).map((line) => {
        const values = parseCSVLine(line);
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || "";
        });
        return obj;
      });

      return data;
    } catch (error) {
      console.error("Error importing CSV:", error);
      throw error;
    }
  }

  // Exportar con formato personalizado
  async exportWithTemplate(
    data: any[],
    fileName: string,
    template: {
      headers: { key: string; label: string }[];
      formatters?: { [key: string]: (value: any) => string };
    }
  ): Promise<string> {
    const formattedData = data.map((row) => {
      const formatted: any = {};
      template.headers.forEach(({ key, label }) => {
        const value = row[key];
        const formatter = template.formatters?.[key];
        formatted[label] = formatter ? formatter(value) : value;
      });
      return formatted;
    });

    return this.exportToCSV(
      formattedData,
      fileName,
      template.headers.map((h) => h.label)
    );
  }
}

export default new CSVExportService();
