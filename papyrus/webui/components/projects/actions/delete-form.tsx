import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";

import { useQueryClient } from "@tanstack/react-query";

import { isFetchError } from "@ts-rest/react-query/v5";

import { ProjectDto } from "../../../../packages/src/dtos/project.dto";

import { useToast } from "../../ui/toast";

import { client } from "../../../utils/clients/client";

import { useAuth } from "../../../context/auth-context";
import { styles } from "../../../utils/style/form-style";

interface ProjectDeleteActionsProps {
  open: boolean;

  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;

  project: ProjectDto;

  onClose?: () => void;
}

export function ProjectDeleteActions({
  project,
  open,
  setOpen,
  onClose,
}: ProjectDeleteActionsProps) {
  const queryClient = useQueryClient();

  const { user } = useAuth();

  const { showToast } = useToast();

  if (!user) {
    showToast("Utilisateur non connecté", 2000, "error");

    return null;
  }

  const { mutate, isPending } = client.project.delete.useMutation({
    onSuccess: () => {
      showToast("Projet supprimé avec succès", 2000, "success");

      void queryClient.invalidateQueries({
        queryKey: ["project.getAll"],
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
        id: project.id,
        userId: user.id,
      },
    });
  };

  return (
    <Modal visible={open} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Supprimer un projet</Text>

          <Text style={styles.description}>Êtes-vous sûr de vouloir supprimer ce projet ?</Text>

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
