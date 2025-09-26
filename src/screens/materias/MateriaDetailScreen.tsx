import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

import { RootStackParamList } from "../../navigation/StackNavigator";
import {
  Materia,
  LoadingState,
  ErrorState,
  COLORS,
  FONT_SIZES,
} from "../../../types";

const materiaImageDefault = require("../../../assets/materia_image.png");
const logoImage = require("../../../assets/logoApp.png");

type MateriaDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MateriaDetails"
>;
type MateriaDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "MateriaDetails"
>;

interface MateriaDetailScreenProps {
  navigation: MateriaDetailScreenNavigationProp;
  route: MateriaDetailScreenRouteProp;
}

const MateriaDetailScreen: React.FC<MateriaDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { nombre, id } = route.params;
  const [materia, setMateria] = useState<Materia | null>(null);
  const [loading, setLoading] = useState<LoadingState>("loading");

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setMateria({
        id: id || 1,
        nombre: nombre,
        carrera: "ISC",
        creditos: 8,
        semestre: 7,
        descripcion: "Materia de ejemplo con información detallada.",
      });
      setLoading("success");
    }, 1500);
  }, [id, nombre]);

  if (loading === "loading") {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={COLORS.surface}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Detalle de la Materia</Text>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.content}>
        {/* Información básica */}
        <View style={styles.basicInfoContainer}>
          <Image source={logoImage} style={styles.logo} />
          <View style={styles.materiaSection}>
            <Image source={materiaImageDefault} style={styles.materiaImage} />
            <View style={styles.materiaInfo}>
              <Text style={styles.materiaNombre}>{materia?.nombre}</Text>
              <Text style={styles.materiaDetails}>
                {materia?.carrera} • {materia?.creditos} créditos
              </Text>
              <Text style={styles.materiaId}>
                Semestre: {materia?.semestre}
              </Text>
            </View>
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descripcionText}>
            {materia?.descripcion || "Descripción no disponible"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    elevation: 4,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.surface,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  basicInfoContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    resizeMode: "contain",
  },
  materiaSection: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  materiaImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  materiaInfo: {
    flex: 1,
  },
  materiaNombre: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  materiaDetails: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  materiaId: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
  sectionContainer: {
    backgroundColor: COLORS.surface,
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  descripcionText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    lineHeight: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
});

export default MateriaDetailScreen;
