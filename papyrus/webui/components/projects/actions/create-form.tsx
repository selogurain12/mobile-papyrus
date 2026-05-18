import { Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "components/ui/toast";
import { TagInput } from "components/ui/tag-input";
import { SingleSelector } from "../../ui/single-select";
import { DatePicker } from "../../ui/date-picker";
import { CreateProjectDto, createProjectSchema } from "../../../../packages/src/dtos/project.dto";
import { client } from "../../../utils/clients/client";
import { useAuth } from "../../../context/auth-context";
import { genre, languageOptions, TypeOption } from "../../../utils/value-for-select";
import { queryClient } from "../../../context/query-client";
import { styles } from "../../../utils/style/form-style";

// eslint-disable-next-line no-unused-vars
export function CreateProjectForm({ setOpen }: { setOpen: (v: boolean) => void }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  if (user === null) {
    return <Text>Utilisateur non connecté</Text>;
  }

  const form = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      targetWordCount: 0,
      currentWordCount: 0,
      status: "planning",
      user,
      genre: "",
      language: "fr",
      tags: [],
    },
  });

  const { mutate } = client.project.create.useMutation({
    onSuccess: () => {
      showToast("Projet créé avec succès", 2000, "success");

      void queryClient.invalidateQueries({
        queryKey: ["project.getAll"],
      });

      form.reset();
      setOpen(false);
    },

    onError: () => {
      showToast("Erreur lors de la création du projet", 2000, "error");
    },
  });

  function onSubmit(data: CreateProjectDto) {
    if (user === null) {
      return <Text>Utilisateur non connecté</Text>;
    }
    mutate({
      body: data,
      params: { userId: user.id },
    });
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Créer un projet</Text>

      <Text style={styles.label}>Titre</Text>

      <Controller
        control={form.control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Titre du projet"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      <Text style={styles.label}>Description</Text>

      <Controller
        control={form.control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Description"
            value={value ?? ""}
            onChangeText={onChange}
            multiline
            style={[styles.input, { height: 100 }]}
          />
        )}
      />

      <Text style={styles.label}>Auteur</Text>

      <Controller
        control={form.control}
        name="author"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Auteur"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      <Text style={styles.label}>Nombre de mots cible</Text>

      <Controller
        control={form.control}
        name="targetWordCount"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Ex: 50000"
            value={value?.toString()}
            onChangeText={(text) => {
              onChange(Number(text));
            }}
            keyboardType="numeric"
            style={styles.input}
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

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          void form.handleSubmit(onSubmit)();
        }}>
        <Text style={styles.buttonText}>Créer le projet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
