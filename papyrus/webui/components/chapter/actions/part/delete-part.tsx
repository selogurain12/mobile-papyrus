import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";

import { useQueryClient } from "@tanstack/react-query";

import { isFetchError } from "@ts-rest/react-query/v5";
import { useToast } from "components/ui/toast";
import { client } from "utils/clients/client";
import { styles } from "utils/style/form-style";
import { useProject } from "context/project-context";
import { PartDto } from "../../../../../packages/src/dtos/part.dto";

interface PartDeleteActionsProps {
  open: boolean;

  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;

  part: PartDto;

  onClose?: () => void;
}

export function PartDeleteActions({ part, open, setOpen, onClose }: PartDeleteActionsProps) {
  const queryClient = useQueryClient();

  const { currentProject } = useProject();

  const { showToast } = useToast();

  if (!currentProject) {
    showToast("Aucun projet sélectionné", 2000, "error");

    return null;
  }

  const { mutate, isPending } = client.part.delete.useMutation({
    onSuccess: () => {
      showToast("Partie supprimée avec succès", 2000, "success");

      void queryClient.invalidateQueries({
        queryKey: ["part.getByPart"],
      });

      setOpen(false);

      onClose?.();
    },

    onError: (error) => {
      if (isFetchError(error)) {
        showToast(error.message, 2000, "error");
      } else {
        showToast("Une erreur est survenue", 2000, "error");
      }
    },
  });

  const handleDelete = () => {
    mutate({
      params: {
        id: part.id,
        projectId: currentProject.id,
      },
    });
  };

  return (
    <Modal visible={open} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Supprimer une partie</Text>

          <Text style={styles.description}>Êtes-vous sûr de vouloir supprimer cette partie ?</Text>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setOpen(false);
              }}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isPending}
              onPress={handleDelete}
              style={[styles.button, styles.deleteButton]}>
              <Text style={styles.deleteText}>{isPending ? "Suppression..." : "Supprimer"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
