import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";

import { useQueryClient } from "@tanstack/react-query";

import { isFetchError } from "@ts-rest/react-query/v5";
import { useToast } from "components/ui/toast";
import { client } from "utils/clients/client";
import { styles } from "utils/style/form-style";
import { useProject } from "context/project-context";
import { ChapterDto } from "../../../../../packages/src/dtos/chapter.dto";
import { queryKeys } from "../../../../../packages/src/query-client";

interface ChapterDeleteActionsProps {
  open: boolean;

  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;

  chapter: ChapterDto;

  onClose?: () => void;
}

export function ChapterDeleteActions({
  chapter,
  open,
  setOpen,
  onClose,
}: ChapterDeleteActionsProps) {
  const queryClient = useQueryClient();

  const { currentProject } = useProject();

  const { showToast } = useToast();

  if (!currentProject) {
    showToast("Aucun projet sélectionné", 2000, "error");

    return null;
  }

  const { mutate, isPending } = client.chapter.softDelete.useMutation({
    onSuccess: () => {
      showToast("Chapitre supprimé avec succès", 2000, "success");

      void queryClient.invalidateQueries({
        queryKey: queryKeys.chapter.getAll({
          pathParams: { projectId: chapter.project.id },
        }),
      });

      void queryClient.invalidateQueries({
        queryKey: queryKeys.chapter.getByPart({
          pathParams: { projectId: chapter.project.id, partId: chapter.part.id },
        }),
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
        id: chapter.id,
        projectId: currentProject.id,
      },
    });
  };

  return (
    <Modal visible={open} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Supprimer un chapitre</Text>

          <Text style={styles.description}>Êtes-vous sûr de vouloir supprimer ce chapitre ?</Text>

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
