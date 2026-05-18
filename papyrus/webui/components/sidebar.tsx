import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import { BookOpen } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const menu = [
  { id: "dashboard", label: "Tableau de bord", screen: "Dashboard" },
  { id: "characters", label: "Personnages", screen: "Characters" },
  { id: "places", label: "Lieux", screen: "Places" },
  { id: "objects", label: "Objets", screen: "Objects" },
  { id: "chapters", label: "Chapitres", screen: "Chapters" },
  { id: "research", label: "Recherches", screen: "Research" },
  { id: "writing-tools", label: "Outils d'écriture", screen: "WritingTools" },
  { id: "timeline", label: "Chronologie", screen: "Timeline" },
  { id: "structure", label: "Structure", screen: "Structure" },
  { id: "mind-maps", label: "Cartes mentales", screen: "Mindmaps" },
  { id: "notes", label: "Notes", screen: "Notes" },
  { id: "export", label: "Export", screen: "Export" },
];

export default function Sidebar({ name }: { name: string }) {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: open ? -250 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setOpen(!open);
  };

  const goTo = (screen: string) => {
    toggleSidebar();
    navigation.navigate(screen as never);
  };

  return (
    <>
      {/* Bouton flottant pour ouvrir */}
      <TouchableOpacity style={styles.fab} onPress={toggleSidebar}>
        <BookOpen color="white" size={24} />
      </TouchableOpacity>

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <BookOpen color="white" size={28} />
          </View>
          <View>
            <Text style={styles.title}>Papyrus</Text>
            <Text style={styles.subtitle}>Studio d'écriture</Text>
          </View>
        </View>

        <View style={styles.projectBox}>
          <Text style={styles.projectLabel}>Projet actuel</Text>
          <Text style={styles.projectName}>{name}</Text>
        </View>

        <View style={styles.menu}>
          {menu.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                goTo(item.screen);
              }}>
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 30,
    elevation: 5,
    zIndex: 20,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderColor: "#ddd",
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoBox: {
    width: 45,
    height: 45,
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  projectBox: {
    backgroundColor: "#DBEAFE",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  projectLabel: {
    color: "#2563EB",
    fontSize: 12,
  },
  projectName: {
    color: "#1E3A8A",
    fontSize: 14,
    fontWeight: "bold",
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
});
