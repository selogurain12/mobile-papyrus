import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";
import React from "react";

export function ChapterList() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Structure du livre</Text>

          <Text style={styles.subtitle}>Organisez vos parties et vos chapitres</Text>
        </View>

        <TouchableOpacity style={styles.addPart}>
          <Plus size={18} color="white" />

          <Text style={styles.addButtonText}>Nouvelle partie</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addChapter}>
          <Plus size={18} color="white" />

          <Text style={styles.addButtonText}>Nouveau chapitre</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text>Vue d'ensemble</Text>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: "#2563EB" }]}>10 Chapitres</View>
          <View style={[styles.badge, { backgroundColor: "#22C55E" }]}>45000 Mots</View>
          <View style={[styles.badge, { backgroundColor: "#A855F7" }]}>3 Parties</View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "center",
  },

  badge: {
    padding: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
  },

  addChapter: {
    flexDirection: "row",
    backgroundColor: "#22C55E",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  addPart: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  addButtonText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
  },

  search: {
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },

  content: {
    flex: 1,
  },

  list: {
    flexGrow: 0,
  },

  details: {
    flex: 1,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContainer: {
    flex: 1,
    marginTop: 80,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },

  close: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
});
