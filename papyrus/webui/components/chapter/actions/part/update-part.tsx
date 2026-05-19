import { ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useProject } from "context/project-context";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { styles } from "utils/style/form-style";
import { SingleSelector } from "components/ui/single-select";
import { statusPartOptions, TypeOption } from "utils/value-for-select";
import {
  PartDto,
  UpdatePartDto,
  updatePartSchema,
} from "../../../../../packages/src/dtos/part.dto";
import { client } from "../../../../utils/clients/client";
import { useToast } from "../../../ui/toast";

type Props = {
  part: PartDto;
  projectId: string;
  onCancel?: () => void;
};

export function UpdatePart({ part, projectId, onCancel }: Props) {
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  const { showToast } = useToast();

  if (!currentProject) {
    showToast("Aucun projet sélectionné", 2000, "error");
    return null;
  }

  const form = useForm({
    resolver: zodResolver(updatePartSchema),
    defaultValues: {
      title: part.title,
      status: part.status,
      project: currentProject,
    },
  });

  const { mutate, isPending } = client.part.update.useMutation({
    onSuccess() {
      showToast("Partie mise à jour avec succès", 2000, "success");
      void queryClient.invalidateQueries({ queryKey: ["part.getAll"] });
      form.reset();
      onCancel?.();
    },
    onError: () => {
      showToast("Erreur lors de la mise à jour de la partie", 2000, "error");
    },
  });

  function submit(data: UpdatePartDto) {
    mutate({
      body: data,
      params: { id: part.id, projectId },
    });
  }
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Mettre à jour la partie</Text>

      <Text style={styles.label}>Titre</Text>
      <Controller
        control={form.control}
        name="title"
        render={({ field }) => (
          <TextInput style={styles.input} value={field.value} onChangeText={field.onChange} />
        )}
      />
      <Text style={styles.label}>Statut</Text>
      <Controller
        control={form.control}
        name="status"
        render={({ field }) => (
          <SingleSelector<TypeOption>
            {...field}
            value={statusPartOptions.find((status) => status.id === field.value)}
            onChange={(value) => {
              field.onChange(value?.id ?? "");
            }}
            placeholder="Sélectionner un statut"
            data={statusPartOptions}
          />
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          onCancel?.();
        }}>
        <Text style={styles.buttonText}>Annuler</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          void form.handleSubmit(submit)();
        }}>
        <Text style={styles.buttonText}>{isPending ? "Mise à jour..." : "Mettre à jour"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
