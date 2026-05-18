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
import { PlaceDto } from "../../../packages/src/dtos/place.dto";

import { useProject } from "../../context/project-context";
import { client } from "../../utils/clients/client";

import { PlaceCard } from "./place-card";
import { PlaceDetail } from "./place-details";

import { CreatePlace } from "./actions/create-place";
import { UpdatePlace } from "./actions/update-place";
import { PlaceDeleteActions } from "./actions/delete-place";

export function PlacesList() {
  const { currentProject } = useProject();

  const [placeSelected, setPlaceSelected] = useState<PlaceDto | undefined>();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [search, setSearch] = useState("");

  const { data } = client.place.getAll.useQuery({
    queryKey: queryKeys.place.getAll({
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

  const filteredPlaces =
    data?.body.data.filter((place) => place.name.toLowerCase().includes(search.toLowerCase())) ??
    [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Lieux</Text>

          <Text style={styles.subtitle}>Gérez les lieux de votre histoire</Text>
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
        placeholder="Rechercher un lieu..."
        placeholderTextColor="#999"
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.content}>
        <ScrollView style={styles.list}>
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onSelect={() => {
                setPlaceSelected(place);
                setIsCreating(false);
              }}
              onEdit={() => {
                setPlaceSelected(place);
                setIsUpdating(true);
              }}
              onDelete={() => {
                setPlaceSelected(place);
                setIsDeleting(true);
              }}
            />
          ))}
        </ScrollView>

        <View style={styles.details}>
          <PlaceDetail place={placeSelected} />
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

            <CreatePlace setOpen={setIsCreating} projectId={currentProject?.id ?? ""} />
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

            {placeSelected && (
              <UpdatePlace
                place={placeSelected}
                onCancel={() => {
                  setIsUpdating(false);
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      {placeSelected && (
        <Modal visible={isDeleting} transparent animationType="fade">
          <PlaceDeleteActions
            place={placeSelected}
            open={isDeleting}
            setOpen={setIsDeleting}
            onClose={() => {
              setIsDeleting(false);
            }}
            clearSelection={() => {
              setPlaceSelected(undefined);
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
