import { View, Text, TouchableOpacity, Animated, StyleSheet, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import { Menu, Save, BookOpen } from "lucide-react-native";
import type { ProjectScreen } from "./home-project";

const menu: { id: ProjectScreen; label: string }[] = [
  { id: "dashboard", label: "Tableau de bord" },
  { id: "characters", label: "Personnages" },
  { id: "places", label: "Lieux" },
  { id: "objects", label: "Objets" },
  { id: "chapters", label: "Chapitres" },
  { id: "research", label: "Recherches" },
  { id: "writing-tools", label: "Outils d'écriture" },
  { id: "timeline", label: "Chronologie" },
  { id: "structure", label: "Structure" },
  { id: "mind-maps", label: "Cartes mentales" },
  { id: "notes", label: "Notes" },
  { id: "export", label: "Export" },
];

type Props = {
  name: string;
  setScreen: (screen: ProjectScreen) => void;
};

export function HeaderWithSidebar({ name, setScreen }: Props) {
  const [open, setOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-260)).current;

  const toggleSidebar = () => {
    const toValue = open ? -260 : 0;

    Animated.timing(slideAnim, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start();

    setOpen(!open);
  };

  const goTo = (screen: ProjectScreen) => {
    setScreen(screen);
    toggleSidebar();
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.iconButton}>
          <Menu size={28} color="#4F46E5" />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          {name}
        </Text>

        <TouchableOpacity style={styles.saveButton}>
          <Save size={18} color="white" />
          <Text style={styles.saveText}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>

      {open && <Pressable style={styles.overlay} onPress={toggleSidebar} />}

      <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
        <View style={styles.sidebarHeader}>
          <View style={styles.logoBox}>
            <BookOpen color="white" size={28} />
          </View>

          <View>
            <Text style={styles.sidebarTitle}>Papyrus</Text>
            <Text style={styles.sidebarSubtitle}>Studio d'écriture</Text>
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
                goTo(item.id);
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
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },

  iconButton: {
    padding: 6,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
    marginLeft: 10,
  },

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16A34A",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  saveText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 40,
  },

  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 260,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 16,
    zIndex: 50,
    borderRightWidth: 1,
    borderColor: "#E5E7EB",
  },

  sidebarHeader: {
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

  sidebarTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  sidebarSubtitle: {
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
