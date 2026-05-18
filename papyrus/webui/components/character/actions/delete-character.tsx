import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import React from "react";

import { useQueryClient } from "@tanstack/react-query";
import { isFetchError } from "@ts-rest/react-query/v5";
import { CharacterDto } from "../../../../packages/src/dtos/character.dto";
import { client } from "../../../utils/clients/client";
import { useToast } from "../../ui/toast";
import { styles } from "../../../utils/style/form-style";

interface CharacterDeleteActionsProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  character: CharacterDto;
  clearSelection: () => void;
  onClose?: () => void;
  onNavigate?: () => void;
}

export function CharacterDeleteActions({
  character,
  open,
  setOpen,
  clearSelection,
  onClose,
  onNavigate,
}: CharacterDeleteActionsProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate, isPending } = client.character.softDelete.useMutation({
    onSuccess: () => {
      showToast("Personnage supprimé avec succès", 2000, "success");
      void queryClient.invalidateQueries({
        queryKey: ["character.getAll"],
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
        id: character.id,
        projectId: character.project.id,
      },
    });
  };

  const roleMap: Record<string, string> = {
    protagonist: "Protagoniste",
    antagonist: "Antagoniste",
    ally: "Allié",
    mentor: "Mentor",
    "secondary character": "Personnage secondaire",
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
            <Text style={styles.title}>Supprimer un personnage</Text>

            <Text style={styles.description}>
              Êtes-vous sûr de vouloir supprimer ce personnage ?
            </Text>
          </View>

          <View style={styles.itemCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{character.firstName.charAt(0)}</Text>
            </View>

            <View style={styles.itemInfos}>
              <Text style={styles.itemName}>
                {character.firstName} {character.lastName}
              </Text>

              <Text style={styles.itemDescription}>
                {roleMap[character.role] || character.role}
              </Text>
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
