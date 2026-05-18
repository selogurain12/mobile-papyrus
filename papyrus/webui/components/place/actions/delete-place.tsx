import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import React from "react";

import { useQueryClient } from "@tanstack/react-query";
import { isFetchError } from "@ts-rest/react-query/v5";
import { PlaceDto } from "../../../../packages/src/dtos/place.dto";
import { client } from "../../../utils/clients/client";
import { useToast } from "../../ui/toast";
import { styles } from "../../../utils/style/form-style";

interface PlaceDeleteActionsProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  place: PlaceDto;
  clearSelection: () => void;
  onClose?: () => void;
  onNavigate?: () => void;
}

export function PlaceDeleteActions({
  place,
  open,
  setOpen,
  clearSelection,
  onClose,
  onNavigate,
}: PlaceDeleteActionsProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate, isPending } = client.place.softDelete.useMutation({
    onSuccess: () => {
      showToast("Lieu supprimé avec succès", 2000, "success");
      void queryClient.invalidateQueries({
        queryKey: ["place.getAll"],
      });

      clearSelection();

      setOpen(false);

      onClose?.();

      onNavigate?.();
    },

    onError: (error) => {
      if (isFetchError(error)) {
        console.error(error.message);
      } else {
        console.error("Une erreur est survenue");
      }
    },
  });

  const handleDelete = () => {
    mutate({
      params: {
        id: place.id,
        projectId: place.project.id,
      },
    });
  };

  const typeMap: Record<string, string> = {
    city: "Ville",
    village: "Village",
    country: "Pays",
    continent: "Continent",
    planet: "Planète",
    spaceStation: "Station spatiale",
    other: "Autre",
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => {
        setOpen(false);
      }}>
      <Pressable
        style={styles.overlay}
        onPress={() => {
          setOpen(false);
        }}>
        <Pressable style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Supprimer un lieu</Text>

            <Text style={styles.description}>Êtes-vous sûr de vouloir supprimer ce lieu ?</Text>
          </View>

          <View style={styles.itemCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{place.name.charAt(0)}</Text>
            </View>

            <View style={styles.itemInfos}>
              <Text style={styles.itemName}>{place.name}</Text>

              <Text style={styles.itemDescription}>{typeMap[place.type] ?? place.type}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setOpen(false);
              }}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
              disabled={isPending}>
              <Text style={styles.deleteText}>{isPending ? "Suppression..." : "Supprimer"}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
