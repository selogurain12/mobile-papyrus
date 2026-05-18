/* eslint-disable complexity */

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { Plus } from "lucide-react-native";

import { queryKeys } from "../../../packages/src/query-client";
import { CharacterDto } from "../../../packages/src/dtos/character.dto";

import { useProject } from "../../context/project-context";
import { client } from "../../utils/clients/client";

import { CharacterCard } from "./character-card";
import { CharacterDetail } from "./character-details";

import { CreateCharacter } from "./actions/create-character";
import { UpdateCharacter } from "./actions/update-character";
import { CharacterDeleteActions } from "./actions/delete-character";

export function CharactersList() {
  const { currentProject } = useProject();

  const [characterSelected, setCharacterSelected] = useState<CharacterDto | undefined>();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [search, setSearch] = useState("");

  const { data } = client.character.getAll.useQuery({
    queryKey: queryKeys.character.getAll({
      pathParams: {
        projectId: currentProject?.id ?? "",
      },
    }),

    queryData: {
      params: {
        projectId: currentProject?.id ?? "",
      },
    },
  });

  const filteredCharacters =
    data?.body.data.filter((character) =>
      `${character.firstName} ${character.lastName}`.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Personnages</Text>

          <Text style={styles.subtitle}>Gérez les personnages de votre histoire</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setIsCreating(true);
          }}>
          <Plus size={18} color="white" />

          <Text style={styles.addButtonText}>Nouveau</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Rechercher un personnage..."
        placeholderTextColor="#999"
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.content}>
        <ScrollView style={styles.list}>
          {filteredCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onSelect={() => {
                setCharacterSelected(character);
                setIsCreating(false);
              }}
              onEdit={() => {
                setCharacterSelected(character);
                setIsUpdating(true);
              }}
              onDelete={() => {
                setCharacterSelected(character);
                setIsDeleting(true);
              }}
            />
          ))}
        </ScrollView>

        <View style={styles.details}>
          <CharacterDetail character={characterSelected} />
        </View>
      </View>

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

            <CreateCharacter setOpen={setIsCreating} projectId={currentProject?.id ?? ""} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={isUpdating}
        onRequestClose={() => {
          setIsUpdating(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsUpdating(false);
              }}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>

            {characterSelected && (
              <UpdateCharacter
                character={characterSelected}
                onCancel={() => {
                  setIsUpdating(false);
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      {characterSelected && (
        <Modal visible={isDeleting} transparent animationType="fade">
          <CharacterDeleteActions
            character={characterSelected}
            open={isDeleting}
            setOpen={setIsDeleting}
            onClose={() => {
              setIsDeleting(false);
            }}
            clearSelection={() => {
              setCharacterSelected(undefined);
            }}
          />
        </Modal>
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "center",
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

  addButton: {
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
