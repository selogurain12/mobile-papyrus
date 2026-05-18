/* eslint-disable no-unused-vars */
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";

import { useQueryClient } from "@tanstack/react-query";
import { ResearchDto } from "../../../../packages/src/dtos/research.dto";

import { client } from "../../../utils/clients/client";

import { useToast } from "../../ui/toast";

import { useProject } from "../../../context/project-context";
import { styles } from "../../../utils/style/form-style";

interface ResearchDeleteActionsProps {
  onClose?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  research: ResearchDto;
  clearSelection: () => void;
}

export function ResearchDeleteActions({
  research,
  open,
  setOpen,
  onClose,
  clearSelection,
}: ResearchDeleteActionsProps) {
  const queryClient = useQueryClient();

  const { currentProject } = useProject();

  const { showToast } = useToast();

  const { mutate, isPending } = client.research.softDelete.useMutation({
    onSuccess: async () => {
      showToast("La recherche a été supprimée avec succès", 2000, "success");

      await queryClient.invalidateQueries({
        queryKey: ["research.getAll"],
      });

      clearSelection();

      onClose?.();
    },

    onError: () => {
      showToast("Une erreur est survenue", 2000, "error");
    },
  });

  if (!currentProject) {
    return null;
  }

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => {
        setOpen(false);
      }}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Supprimer la recherche</Text>

            <Text style={styles.description}>
              Êtes-vous sûr de vouloir supprimer{" "}
              <Text style={styles.bold}>« {research.title} »</Text> ? Cette action est irréversible.
            </Text>
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
              disabled={isPending}
              onPress={() => {
                mutate({
                  params: {
                    id: research.id,
                    projectId: currentProject.id,
                  },
                });
              }}>
              {isPending ? (
                <ActivityIndicator color="#FFFFFF" />
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
