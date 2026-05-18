import { Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "components/ui/date-picker";
import { SingleSelector } from "components/ui/single-select";
import { TypeOption, genre, languageOptions } from "utils/value-for-select";
import { TagInput } from "components/ui/tag-input";
import {
  ProjectDto,
  UpdateProjectDto,
  updateProjectSchema,
} from "../../../../packages/src/dtos/project.dto";
import { useToast } from "../../ui/toast";
import { useAuth } from "../../../context/auth-context";
import { client } from "../../../utils/clients/client";
import { styles } from "../../../utils/style/form-style";

interface UpdateProjectFormProps {
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
  project: ProjectDto;
}

export function UpdateProjectForm({ setOpen, project }: UpdateProjectFormProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  if (!user) {
    showToast("Utilisateur non connecté", 2000, "error");
    return null;
  }

  const form = useForm<UpdateProjectDto>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...project,
      user,
    },
  });

  const { mutate } = client.project.update.useMutation({
    onSuccess: () => {
      showToast("Projet modifié avec succès", 2000, "success");

      void queryClient.invalidateQueries({
        queryKey: ["project.getAll"],
      });

      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(error.message, 2000, "error");
      } else {
        showToast("Erreur inconnue", 2000, "error");
      }
    },
  });

  function onSubmit(data: UpdateProjectDto) {
    if (user === null) {
      return <Text>Utilisateur non connecté</Text>;
    }
    mutate({
      body: data,
      params: { userId: user.id, id: project.id },
    });
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Modifier le projet</Text>

      <Text style={styles.label}>Titre</Text>
      <Controller
        control={form.control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} value={value ?? ""} onChangeText={onChange} />
        )}
      />

      <Text style={styles.label}>Description</Text>
      <Controller
        control={form.control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={value ?? ""}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.label}>Auteur</Text>
      <Controller
        control={form.control}
        name="author"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} value={value ?? ""} onChangeText={onChange} />
        )}
      />

      <Text style={styles.label}>Objectif mots</Text>
      <Controller
        control={form.control}
        name="targetWordCount"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={value?.toString()}
            onChangeText={(text) => {
              onChange(Number(text));
            }}
          />
        )}
      />

      <Text style={styles.label}>Genre</Text>

      <Controller
        control={form.control}
        name="genre"
        render={({ field }) => (
          <SingleSelector<TypeOption>
            {...field}
            value={genre.find((g) => g.id === field.value)}
            onChange={(value) => {
              field.onChange(value?.id ?? "");
            }}
            placeholder="Sélectionner un genre"
            data={genre}
          />
        )}
      />

      <Text style={styles.label}>Langue</Text>

      <Controller
        control={form.control}
        name="language"
        render={({ field }) => (
          <SingleSelector<TypeOption>
            {...field}
            value={languageOptions.find((l) => l.id === field.value)}
            onChange={(value) => {
              field.onChange(value?.id ?? "");
            }}
            placeholder="Sélectionner une langue"
            data={languageOptions}
          />
        )}
      />

      <Text style={styles.label}>Deadline</Text>

      <Controller
        control={form.control}
        name="deadline"
        render={({ field }) => <DatePicker value={field.value} setValue={field.onChange} />}
      />

      <TagInput
        label="Tags"
        placeholder="Ajouter un tag"
        values={form.watch("tags") ?? []}
        onChange={(values) => {
          form.setValue("tags", values);
        }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setOpen(false);
        }}>
        <Text style={styles.buttonText}>Annuler</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => void form.handleSubmit(onSubmit)()} style={styles.button}>
        <Text style={styles.buttonText}>Modifier le projet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
