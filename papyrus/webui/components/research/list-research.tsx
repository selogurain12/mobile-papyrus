/* eslint-disable max-lines */
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal } from "react-native";
import React, { useState } from "react";
import { Plus, Search as SearchIcon } from "lucide-react-native";

import { ResearchDto } from "../../../packages/src/dtos/research.dto";
import { queryKeys } from "../../../packages/src/query-client";
import { client } from "../../utils/clients/client";
import { useProject } from "../../context/project-context";

import { ResearchCard } from "./research-card";

import { CreateResearchForm } from "./actions/create-form";
import { UpdateResearchForm } from "./actions/update-form";
import { ResearchDeleteActions } from "./actions/delete-form";

const categories = [
  { id: "all", label: "Tout" },
  { id: "articles", label: "Articles" },
  { id: "links", label: "Liens web" },
  { id: "images", label: "Images" },
  { id: "videos", label: "Vidéos" },
  { id: "books", label: "Livres" },
];

export function ListResearch() {
  const { currentProject } = useProject();

  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState<ResearchDto | null>(null);
  const [isDeleting, setIsDeleting] = useState<ResearchDto | null>(null);

  const [activeCategory, setActiveCategory] = useState("all");

  if (!currentProject) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loaderText}>Chargement du projet...</Text>
      </View>
    );
  }

  const { data } = client.research.getAll.useQuery({
    queryKey: queryKeys.research.getAll({ pathParams: { projectId: currentProject.id } }),
    queryData: { params: { projectId: currentProject.id } },
  });

  const filteredResearchs =
    data?.body.data.filter((research) => {
      const matchesSearch = research.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "all" ? true : research.type === activeCategory;
      return matchesSearch && matchesCategory;
    }) ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Recherches documentaires</Text>

          <Text style={styles.subtitle}>Organisez vos sources et références</Text>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            setIsCreating(true);
          }}>
          <Plus size={18} color="#FFFFFF" />

          <Text style={styles.createButtonText}>Nouvelle recherche</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersCard}>
        <View style={styles.searchContainer}>
          <SearchIcon size={18} color="#9CA3AF" />

          <TextInput
            placeholder="Rechercher dans vos recherches..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.categoriesContainer}>
          {categories.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryButton, isActive && styles.categoryButtonActive]}
                onPress={() => {
                  setActiveCategory(category.id);
                }}>
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {filteredResearchs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune recherche trouvée.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredResearchs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ResearchCard
              research={item}
              openEditModal={(research) => {
                setIsUpdating(research);
              }}
              openDeleteModal={(research) => {
                setIsDeleting(research);
              }}
            />
          )}
        />
      )}

      <Modal
        animationType="slide"
        transparent
        visible={isCreating}
        onRequestClose={() => {
          setIsCreating(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsCreating(false);
              }}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>

            <CreateResearchForm setOpen={setIsCreating} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={!!isUpdating}
        onRequestClose={() => {
          setIsUpdating(null);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsUpdating(null);
              }}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>

            {isUpdating && (
              <UpdateResearchForm
                setOpen={() => {
                  setIsUpdating(null);
                }}
                research={isUpdating}
              />
            )}
          </View>
        </View>
      </Modal>

      {isDeleting && (
        <ResearchDeleteActions
          open={!!isDeleting}
          setOpen={(open) => {
            if (!open) {
              setIsDeleting(null);
            }
          }}
          research={isDeleting}
          clearSelection={() => {
            setIsDeleting(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FAFB",
  },

  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loaderText: {
    color: "#6B7280",
    fontSize: 15,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },

  createButton: {
    marginTop: 16,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 15,
  },

  filtersCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#111827",
  },

  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },

  categoryButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },

  categoryButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  categoryText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "500",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  emptyContainer: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: "#6B7280",
    fontSize: 15,
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
