import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BookOpen, CircleUserRound, Plus } from "lucide-react-native";

import { CreateProjectForm } from "components/projects/actions/create-form";
import { ListProject } from "components/projects/list-project";

import { RootStackParamList } from "../App";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  header: {
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },

  actionBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },

  buttonBlue: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 6,
    alignItems: "center",
    gap: 6,
  },

  buttonBlueText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },

  contentArea: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },

  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    maxHeight: "85%",
  },
});

type NavProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export function ProjectPage() {
  const navigation = useNavigation<NavProp>();
  const [modalOpen, setModalOpen] = useState(false);

  const handleNavigateToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* BRAND */}
        <View style={styles.brandRow}>
          <View style={styles.logoSection}>
            <View style={styles.logoBox}>
              <BookOpen color="white" size={24} />
            </View>

            <View>
              <Text style={styles.title}>Projet Papyrus</Text>
              <Text style={styles.subtitle}>Gérez vos documents efficacement.</Text>
            </View>
          </View>
        </View>

        {/* ACTIONS */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.buttonBlue}
            onPress={() => {
              setModalOpen(true);
            }}>
            <Plus size={16} color="white" />
            <Text style={styles.buttonBlueText}>Nouveau projet</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNavigateToLogin}>
            <CircleUserRound size={32} />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.contentArea}>
        <ListProject />
      </View>

      {/* MODAL CREATE PROJECT */}
      <Modal
        animationType="slide"
        transparent
        visible={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                setModalOpen(false);
              }}>
              <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>✕</Text>
            </TouchableOpacity>

            <CreateProjectForm setOpen={setModalOpen} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
