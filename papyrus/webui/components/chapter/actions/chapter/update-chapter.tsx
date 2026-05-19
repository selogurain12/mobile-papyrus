import { ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useProject } from "context/project-context";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { styles } from "utils/style/form-style";
import { SingleSelector } from "components/ui/single-select";
import { statusPartOptions, TypeOption } from "utils/value-for-select";
import { client } from "../../../../utils/clients/client";
import { useToast } from "../../../ui/toast";
import {
  updateChapterSchema,
  UpdateChapterDto,
  ChapterDto,
} from "../../../../../packages/src/dtos/chapter.dto";
import { queryKeys } from "../../../../../packages/src/query-client";
import { PartDto } from "../../../../../packages/src/dtos/part.dto";

type Props = {
  chapter: ChapterDto;
  projectId: string;
  onCancel?: () => void;
};

export function UpdateChapter({ chapter, projectId, onCancel }: Props) {
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  const { showToast } = useToast();

  if (!currentProject) {
    showToast("Aucun projet sélectionné", 2000, "error");
    return null;
  }

  const form = useForm({
    resolver: zodResolver(updateChapterSchema),
    defaultValues: {
      title: chapter.title,
      status: chapter.status,
      content: chapter.content,
      resume: chapter.resume,
      chapterNumber: chapter.chapterNumber,
      wordCount: chapter.wordCount,
      wordGoal: chapter.wordGoal,
      part: chapter.part,
    },
  });

  const { data } = client.part.getAll.useQuery({
    queryKey: queryKeys.part.getAll({
      pathParams: {
        projectId,
      },
    }),
    queryData: {
      params: { projectId },
    },
  });

  const { mutate, isPending } = client.chapter.update.useMutation({
    onSuccess() {
      showToast("Chapitre mis à jour avec succès", 2000, "success");
      void queryClient.invalidateQueries({ queryKey: ["chapter.getByPart"] });
      form.reset();
      onCancel?.();
    },
    onError: () => {
      showToast("Erreur lors de la mise à jour du chapitre", 2000, "error");
    },
  });

  function submit(data: UpdateChapterDto) {
    mutate({
      body: data,
      params: { id: chapter.id, projectId },
    });
  }
  const parts = data?.body.data ?? [];
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Mettre à jour le chapitre</Text>

      <Text style={styles.label}>Titre</Text>
      <Controller
        control={form.control}
        name="title"
        render={({ field }) => (
          <TextInput style={styles.input} value={field.value} onChangeText={field.onChange} />
        )}
      />
      <Text style={styles.label}>Partie</Text>
      <Controller
        control={form.control}
        name="part"
        render={({ field }) => (
          <SingleSelector<PartDto>
            value={field.value as PartDto}
            onChange={field.onChange}
            customLabel={(item) => item.title}
            placeholder="Sélectionner une partie"
            data={parts}
          />
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
      <Text style={styles.label}>Numéro du chapitre</Text>
      <Controller
        control={form.control}
        name="chapterNumber"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(field.value)}
            onChangeText={(v) => {
              field.onChange(Number(v));
            }}
          />
        )}
      />
      <Text style={styles.label}>Objectif en mots</Text>
      <Controller
        control={form.control}
        name="wordGoal"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(field.value)}
            onChangeText={(v) => {
              field.onChange(Number(v));
            }}
          />
        )}
      />
      <Text style={styles.label}>Résumé</Text>
      <Controller
        control={form.control}
        name="resume"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            value={field.value ?? ""}
            onChangeText={field.onChange}
          />
        )}
      />
      <TouchableOpacity style={styles.button} onPress={onCancel}>
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
