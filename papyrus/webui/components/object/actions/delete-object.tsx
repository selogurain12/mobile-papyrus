import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import React from "react";

import { useQueryClient } from "@tanstack/react-query";
import { isFetchError } from "@ts-rest/react-query/v5";
import { ObjectDto } from "../../../../packages/src/dtos/object.dto";
import { client } from "../../../utils/clients/client";
import { useToast } from "../../ui/toast";
import { styles } from "../../../utils/style/form-style";

interface ObjectDeleteActionsProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  object: ObjectDto;
  clearSelection: () => void;
  onClose?: () => void;
  onNavigate?: () => void;
}

export function ObjectDeleteActions({
  object,
  open,
  setOpen,
  clearSelection,
  onClose,
  onNavigate,
}: ObjectDeleteActionsProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate, isPending } = client.object.softDelete.useMutation({
    onSuccess: () => {
      showToast("Objet supprimé avec succès", 2000, "success");
      void queryClient.invalidateQueries({
        queryKey: ["object.getAll"],
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
        id: object.id,
        projectId: object.project.id,
      },
    });
  };

  const importanceMap: Record<string, string> = {
    high: "Élevée",
    medium: "Moyenne",
    low: "Basse",
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
            <Text style={styles.title}>Supprimer un objet</Text>

            <Text style={styles.description}>Êtes-vous sûr de vouloir supprimer cet objet ?</Text>
          </View>

          <View style={styles.itemCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{object.name.charAt(0)}</Text>
            </View>

            <View style={styles.itemInfos}>
              <Text style={styles.itemName}>{object.name}</Text>

              <Text style={styles.itemDescription}>
                {importanceMap[object.importance] ?? object.importance}
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
