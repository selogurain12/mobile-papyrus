import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";

import { useQueryClient } from "@tanstack/react-query";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useToast } from "components/ui/toast";
import { NoteDto } from "../../../../packages/src/dtos/note.dto";
import { client } from "../../../utils/clients/client";
import { useProject } from "../../../context/project-context";
import { styles } from "../../../utils/style/form-style";

interface NoteDeleteActionsProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  note: NoteDto;
  clearSelection: () => void;
  onClose?: () => void;
}

export function NoteDeleteActions({
  open,
  setOpen,
  note,
  clearSelection,
  onClose,
}: NoteDeleteActionsProps) {
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  const { showToast } = useToast();

  const { mutate, isPending } = client.note.softDelete.useMutation({
    onSuccess: async () => {
      showToast("La note a été supprimée avec succès", 3000, "success");
      await queryClient.invalidateQueries({
        queryKey: ["note.getAll"],
      });

      clearSelection();
      onClose?.();
      setOpen(false);
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(error.message, 3000, "error");
      } else {
        showToast("Une erreur est survenue", 3000, "error");
      }
    },
  });

  if (!currentProject) return null;

  return (
    <Modal visible={open} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Supprimer la note</Text>

          <Text style={styles.description}>
            Êtes-vous sûr de vouloir supprimer <Text style={styles.bold}>« {note.title} »</Text> ?
            Cette action est irréversible.
          </Text>

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
              disabled={isPending}
              onPress={() => {
                mutate({
                  params: {
                    id: note.id,
                    projectId: currentProject.id,
                  },
                });
              }}>
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.deleteText}>Supprimer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
