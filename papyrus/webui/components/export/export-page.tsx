/* eslint-disable max-lines */
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";

import { BookOpen, FileText, File, LucideIcon, Check, Download } from "lucide-react-native";
import { client } from "utils/clients/client";
import { useProject } from "context/project-context";
import * as Sharing from "expo-sharing";
import { useAuth } from "context/auth-context";
import * as FileSystem from "expo-file-system/legacy";
import { queryKeys } from "../../../packages/src/query-client";

type ExportFormat = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

const exportFormats: ExportFormat[] = [
  {
    id: "epub",
    label: "EPUB",
    description: "Format ebook compatible Kindle et liseuses",
    icon: BookOpen,
    color: "#10B981",
  },
  {
    id: "pdf",
    label: "PDF",
    description: "Document imprimable universel",
    icon: FileText,
    color: "#DC2626",
  },
  {
    id: "txt",
    label: "TXT",
    description: "Texte brut simple",
    icon: File,
    color: "#6B7280",
  },
];

// eslint-disable-next-line complexity
export function ExportPage() {
  const { currentProject } = useProject();
  const { user } = useAuth();
  const [selectedFormat, setSelectedFormat] = useState("epub");

  const { data } = client.chapter.getAll.useQuery({
    queryKey: queryKeys.chapter.getAll({
      pathParams: {
        projectId: currentProject?.id ?? "",
      },
    }),
    queryData: {
      params: {
        projectId: currentProject?.id ?? "",
      },
    },
    enabled: !!currentProject?.id,
  });

  if (!currentProject || !user) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const { mutate, isPending, isSuccess, isError } = client.export.epub.useMutation({
    onSuccess: async (res) => {
      try {
        const url = res.body.url;
        console.log("DOWNLOAD URL:", url);

        const fileUri = FileSystem.documentDirectory + `${currentProject.title}.epub`;
        await fetch(url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Erreur téléchargement");
        }

        const blob = await response.blob();

        const reader = new FileReader();

        reader.onloadend = async () => {
          const result = reader.result;

          if (typeof result !== "string") {
            throw new Error("Conversion base64 échouée");
          }

          const base64 = result.split(",")[1];

          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          console.log("DOWNLOADED:", fileUri);

          await Sharing.shareAsync(fileUri);
        };

        reader.readAsDataURL(blob);
      } catch (e) {
        console.log("DOWNLOAD ERROR", e);
      }
    },
    onError: (err) => {
      console.log("EXPORT ERROR", err);
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Export</Text>
          <Text style={styles.subtitle}>Exporter votre projet dans différents formats</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Formats d'export disponibles</Text>

        <View style={styles.list}>
          {exportFormats.map((format) => {
            const Icon = format.icon;
            const isSelected = selectedFormat === format.id;

            return (
              <TouchableOpacity
                key={format.id}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedFormat(format.id);
                }}
                style={[styles.card, isSelected && styles.cardSelected]}>
                <View style={styles.left}>
                  <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                    <Icon size={22} color={format.color} />
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={[styles.label, isSelected && styles.labelSelected]}>
                      {format.label}
                    </Text>
                    <Text style={styles.description}>{format.description}</Text>
                  </View>
                </View>

                {isSelected && (
                  <View style={styles.checkContainer}>
                    <Check size={18} color="#2563EB" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aperçu de l'export</Text>

        <View style={styles.resume}>
          <Text>Format:</Text>
          <Text style={{ fontWeight: "600" }}>
            {exportFormats.find((f) => f.id === selectedFormat)?.label}
          </Text>
        </View>

        <View style={styles.resume}>
          <Text>Chapitres:</Text>
          <Text style={{ fontWeight: "600" }}>{data?.body.data.length ?? 0}</Text>
        </View>

        <View style={styles.resume}>
          <Text>Mots totaux:</Text>
          <Text style={{ fontWeight: "600" }}>{currentProject.currentWordCount ?? 0}</Text>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            if (selectedFormat !== "epub") {
              alert("Export en cours de développement pour ce format");
              return;
            }

            mutate({
              params: {
                projectId: currentProject.id,
                userId: user.id,
              },
            });

            console.log("Export en cours...");
          }}>
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Download size={18} color="white" />
              <Text style={styles.saveButtonText}>Exporter le projet</Text>
            </>
          )}
        </TouchableOpacity>

        {isSuccess && <Text style={{ color: "green", marginTop: 10 }}>Export terminé ✅</Text>}

        {isError && <Text style={{ color: "red", marginTop: 10 }}>Erreur export ❌</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  cardSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  iconContainerSelected: {
    backgroundColor: "#DBEAFE",
  },
  cardContent: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  labelSelected: {
    color: "#1D4ED8",
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },
  checkContainer: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  resume: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveButton: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#3B82F6",
    borderRadius: 14,
    padding: 16,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
