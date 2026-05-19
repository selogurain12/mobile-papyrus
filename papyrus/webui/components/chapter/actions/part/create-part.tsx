import { ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useProject } from "context/project-context";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { styles } from "utils/style/form-style";
import { SingleSelector } from "components/ui/single-select";
import { statusPartOptions, TypeOption } from "utils/value-for-select";
import { CreatePartDto, createPartSchema } from "../../../../../packages/src/dtos/part.dto";
import { client } from "../../../../utils/clients/client";
import { useToast } from "../../../ui/toast";

type Props = {
  projectId: string;
  // eslint-disable-next-line no-unused-vars
  setOpen: (v: boolean) => void;
};

export function CreatePart({ projectId, setOpen }: Props) {
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  const { showToast } = useToast();

  if (!currentProject) {
    showToast("Aucun projet sélectionné", 2000, "error");
    return null;
  }

  const form = useForm({
    resolver: zodResolver(createPartSchema),
    defaultValues: {
      title: "",
      status: "toStart",
      project: currentProject,
    },
  });

  const { mutate, isPending } = client.part.create.useMutation({
    onSuccess() {
      showToast("Partie créée avec succès", 2000, "success");
      void queryClient.invalidateQueries({ queryKey: ["part.getAll"] });
      form.reset();
      setOpen(false);
    },
    onError: () => {
      showToast("Erreur lors de la création de la partie", 2000, "error");
    },
  });

  function submit(data: CreatePartDto) {
    mutate({
      body: data,
      params: { projectId },
    });
  }
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Créer une nouvelle partie</Text>

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
          setOpen(false);
        }}>
        <Text style={styles.buttonText}>Annuler</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          void form.handleSubmit(submit)();
        }}>
        <Text style={styles.buttonText}>{isPending ? "Création..." : "Créer"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
