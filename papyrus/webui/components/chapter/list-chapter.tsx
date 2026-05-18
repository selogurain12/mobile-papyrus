import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BookOpen, ChevronDown, ChevronRight, Plus } from "lucide-react-native";
import React, { useState } from "react";

export function ChapterList() {
  const parts = [
    {
      title: "Première partie : L’Enquête commence",
      subtitle: "4 chapitres • 25 000 mots",
      chapters: [
        { title: "La Disparition", words: 3200, status: "Terminé" },
        { title: "Premières Pistes", words: 2800, status: "Terminé" },
        { title: "Rencontre", words: 3100, status: "En cours" },
      ],
    },
    {
      title: "Deuxième partie : Les révélations",
      subtitle: "3 chapitres • 12 000 mots",
      chapters: [
        { title: "Indices cachés", words: 4000, status: "En cours" },
        { title: "Le témoin", words: 3500, status: "Terminé" },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Structure du livre</Text>
          <Text style={styles.subtitle}>Organisez vos parties et vos chapitres</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addPart}>
            <Plus size={18} color="white" />
            <Text style={styles.addButtonText}>Nouvelle partie</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addChapter}>
            <Plus size={18} color="white" />
            <Text style={styles.addButtonText}>Nouveau chapitre</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={{ marginBottom: 8, fontWeight: "600" }}>Vue d'ensemble</Text>

        <View style={styles.overviewRow}>
          <View style={[styles.badge, { backgroundColor: "#EFF6FF" }]}>
            <Text style={{ color: "#2563EB", fontWeight: "600" }}>10</Text>
            <Text style={{ color: "black" }}>Chapitres</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: "#F0FDF4" }]}>
            <Text style={{ color: "#16A34A", fontWeight: "600" }}>45000</Text>
            <Text style={{ color: "black" }}>Mots</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: "#FAF5FF" }]}>
            <Text style={{ color: "#9333EA", fontWeight: "600" }}>3</Text>
            <Text style={{ color: "black" }}>Parties</Text>
          </View>
        </View>

        {parts.map((part, index) => (
          <Accordion
            key={index}
            title={part.title}
            subtitle={part.subtitle}
            chapters={part.chapters}
          />
        ))}
      </View>
    </View>
  );
}

function Accordion({
  title,
  subtitle,
  chapters,
}: {
  title: string;
  subtitle: string;
  chapters: { title: string; words: number; status: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        onPress={() => {
          setOpen(!open);
        }}
        style={styles.accordionHeader}>
        <Text style={styles.accordionIcon}>{open ? <ChevronDown /> : <ChevronRight />}</Text>
        <BookOpen style={{ width: 20, height: 20 }} color="#2563EB" />
        <View style={{ marginLeft: 8, flex: 1 }}>
          <Text style={styles.accordionTitle}>{title}</Text>
          <Text style={styles.accordionSubtitle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>

      {open && (
        <View style={styles.accordionContent}>
          {chapters.map((ch, i) => (
            <View key={i} style={styles.chapterCard}>
              <Text style={styles.chapterTitle}>{ch.title}</Text>
              <Text style={styles.chapterWords}>{ch.words} mots</Text>
              <Text
                style={[
                  styles.status,
                  ch.status === "Terminé" ? styles.statusDone : styles.statusProgress,
                ]}>
                {ch.status}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },

  header: {
    marginBottom: 16,
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },

  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },

  badge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: "30%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  badgeText: {
    color: "white",
    fontWeight: "600",
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

  content: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: "auto",
  },

  accordionContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  accordionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  accordionSubtitle: {
    fontSize: 13,
    color: "#666",
  },

  accordionIcon: {
    fontSize: 18,
    color: "#333",
  },

  accordionContent: {
    marginTop: 12,
  },

  chapterCard: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    position: "relative",
  },

  chapterTitle: {
    fontWeight: "bold",
  },

  chapterWords: {
    color: "#555",
  },

  status: {
    position: "absolute",
    right: 10,
    top: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
  },

  statusDone: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
  },

  statusProgress: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
});
