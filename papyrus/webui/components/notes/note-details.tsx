import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import { Link } from "lucide-react-native";
import { NoteDto } from "../../../packages/src/dtos/note.dto";

type Props = {
  note: NoteDto;
  onClose: () => void;
};

export function NoteDetails({ note, onClose }: Props) {
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

  const colorMap: Record<string, string> = {
    blue: "#3B82F6",
    red: "#EF4444",
    green: "#22C55E",
    yellow: "#EAB308",
    purple: "#A855F7",
    pink: "#EC4899",
    orange: "#F97316",
    gray: "#6B7280",
  };

  const bgMap: Record<string, string> = {
    blue: "#EFF6FF",
    red: "#FEF2F2",
    green: "#F0FDF4",
    yellow: "#FEFCE8",
    purple: "#FAF5FF",
    pink: "#FDF2F8",
    orange: "#FFF7ED",
    gray: "#F3F4F6",
  };

  return (
    <Modal visible={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              disabled={!note.linkFile}
              onPress={() => {
                setIsPDFModalOpen(true);
              }}
              style={styles.linkButton}>
              <Link size={14} color={note.linkFile ? "#4F46E5" : "#9CA3AF"} />
              <Text style={[styles.linkText, { color: note.linkFile ? "#4F46E5" : "#9CA3AF" }]}>
                {note.linkFile ? "Ouvrir" : "Pas de fichier"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            {note.tags?.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.contentBox,
            {
              borderLeftColor: colorMap[note.color],
              backgroundColor: bgMap[note.color],
            },
          ]}>
          <Text style={styles.contentText}>{note.content ?? "Aucun contenu"}</Text>
        </View>
      </View>

      <Modal
        visible={isPDFModalOpen}
        animationType="slide"
        onRequestClose={() => {
          setIsPDFModalOpen(false);
        }}>
        <View style={styles.pdfContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{note.title}</Text>

            <TouchableOpacity
              onPress={() => {
                setIsPDFModalOpen(false);
              }}>
              <Text style={{ fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* PDF VIEWER (optionnel) */}
          {/* <Pdf source={{ uri: note.linkFile }} style={styles.pdf} /> */}
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  header: {
    gap: 10,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  close: {
    fontSize: 22,
    fontWeight: "600",
    paddingHorizontal: 8,
  },

  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  linkText: {
    fontSize: 13,
    fontWeight: "500",
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  tag: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  tagText: {
    fontSize: 12,
    color: "#374151",
  },

  contentBox: {
    marginTop: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderRadius: 8,
  },

  contentText: {
    fontSize: 14,
    color: "#111827",
  },

  pdfContainer: {
    flex: 1,
    backgroundColor: "white",
  },

  modalHeader: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },

  pdf: {
    flex: 1,
    width: "100%",
  },
});
