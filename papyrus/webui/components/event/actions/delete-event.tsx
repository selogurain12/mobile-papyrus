import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";

import React from "react";

import { useQueryClient } from "@tanstack/react-query";

import { isFetchError } from "@ts-rest/react-query/v5";

import { useToast } from "components/ui/toast";

import { EventDto } from "../../../../packages/src/dtos/event.dto";

import { client } from "../../../utils/clients/client";

import { useProject } from "../../../context/project-context";
import { styles } from "../../../utils/style/form-style";

interface EventDeleteActionsProps {
  onClose?: () => void;

  open: boolean;

  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;

  event: EventDto;

  clearSelection: () => void;
}

export function EventDeleteActions({
  event,
  open,
  setOpen,
  onClose = undefined,
  clearSelection,
}: EventDeleteActionsProps) {
  const queryClient = useQueryClient();

  const { showToast } = useToast();

  const { currentProject } = useProject();

  if (!currentProject) {
    showToast("Projet non sélectionné", 3000, "error");

    return null;
  }

  const { mutate } = client.event.softDelete.useMutation({
    onSuccess: () => {
      showToast("L'événement a été supprimé avec succès", 3000, "success");

      void queryClient.invalidateQueries({
        queryKey: ["event.getAll"],
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

  function handleDelete() {
    if (currentProject === null) {
      showToast("Current project is null", 3000, "error");

      return;
    }

    mutate({
      params: {
        id: event.id,
        projectId: currentProject.id,
      },
    });
  }

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => {
        setOpen(false);
      }}>
      <Pressable
        onPress={() => {
          setOpen(false);
        }}
        style={styles.overlay}>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
          }}
          style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Supprimer un événement</Text>

            <Text style={styles.description}>
              Êtes-vous sûr de vouloir supprimer cet événement ?
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setOpen(false);
              }}
              style={[styles.button, styles.cancelButton]}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDelete}
              style={[styles.button, styles.deleteButton]}>
              <Text style={styles.deleteText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
