import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { BookOpen, PencilLine, Trash2, FileText } from "lucide-react-native";

import { ChapterDto } from "../../../packages/src/dtos/chapter.dto";

interface ChapterDetailProps {
  chapter: ChapterDto | undefined;
  onEdit?: () => void;
  onEditor?: () => void;
  onDelete?: () => void;
}

export function ChapterDetail({ chapter, onEdit, onEditor, onDelete }: ChapterDetailProps) {
  if (!chapter) {
    return (
      <View style={styles.emptyCard}>
        <BookOpen size={60} color="#D1D5DB" />

        <Text style={styles.emptyTitle}>Sélectionnez un chapitre</Text>

        <Text style={styles.emptySubtitle}>Choisissez un chapitre pour voir ses détails</Text>
      </View>
    );
  }

  const statusColorMap: Record<string, string> = {
    toStart: "#E5E7EB",
    inProgress: "#FEF3C7",
    completed: "#DCFCE7",
  };

  const statusTextColorMap: Record<string, string> = {
    toStart: "#374151",
    inProgress: "#92400E",
    completed: "#166534",
  };

  const statusTextMap: Record<string, string> = {
    toStart: "À commencer",
    inProgress: "En cours",
    completed: "Terminé",
  };

  const wordCount = useMemo(() => {
    if (!chapter.content) {
      return chapter.wordCount ?? 0;
    }

    return chapter.content.trim().split(/\s+/).filter(Boolean).length;
  }, [chapter.content, chapter.wordCount]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <FileText size={22} color="#2563EB" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{chapter.title}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.chapterWords}>{wordCount} mots</Text>

                <View
                  style={[
                    styles.status,
                    {
                      backgroundColor: statusColorMap[chapter.status] || "#E5E7EB",
                    },
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: statusTextColorMap[chapter.status] || "#374151",
                      },
                    ]}>
                    {statusTextMap[chapter.status] || chapter.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.iconButton} onPress={onEdit}>
              <PencilLine size={18} color="#374151" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={onDelete}>
              <Trash2 size={18} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé</Text>

          <Text style={styles.summary}>{chapter.resume ?? "Aucun résumé disponible"}</Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={onEditor}>
          <PencilLine size={18} color="white" />

          <Text style={styles.editButtonText}>Ouvrir l’éditeur</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    paddingBottom: 100,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 18,
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 24,
    color: "#9CA3AF",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 22,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  headerLeft: {
    flexDirection: "row",
    flex: 1,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },

  chapterWords: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },

  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginLeft: 12,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 24,
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },

  summary: {
    fontSize: 16,
    lineHeight: 28,
    color: "#4B5563",
  },

  editButton: {
    marginTop: 12,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
