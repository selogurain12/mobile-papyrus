/* eslint-disable max-lines */

import { Text, TextInput, ScrollView, TouchableOpacity, View } from "react-native";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useQueryClient } from "@tanstack/react-query";

import { SingleSelector } from "components/ui/single-select";
import React from "react";
import {
  importanceOptions,
  languageOptions,
  TypeOption,
  typeOptions,
} from "utils/value-for-select";
import { CreatePlaceDto, createPlaceSchema } from "../../../../packages/src/dtos/place.dto";

import { client } from "../../../utils/clients/client";

import { useProject } from "../../../context/project-context";

import { useToast } from "../../ui/toast";
import { styles } from "../../../utils/style/form-style";

type Props = {
  projectId: string;
  // eslint-disable-next-line no-unused-vars
  setOpen: (v: boolean) => void;
};

const safe = (v: unknown): string => {
  if (typeof v === "string") return v;

  if (typeof v === "number") return String(v);

  return "";
};

export function CreatePlace({ projectId, setOpen }: Props) {
  const queryClient = useQueryClient();

  const { currentProject } = useProject();

  const { showToast } = useToast();

  if (!currentProject) return null;

  const form = useForm({
    resolver: zodResolver(createPlaceSchema),

    defaultValues: {
      name: "",

      nickname: null,

      type: "",

      localisation: "",

      physicalDescription: null,

      atmosphere: null,

      history: null,

      population: null,

      usages: null,

      language: null,

      government: null,

      ressources: null,

      color: "blue",

      project: currentProject,
    },
  });

  const { mutate, isPending } = client.place.create.useMutation({
    onSuccess: () => {
      showToast("Lieu créé avec succès", 2000, "success");

      void queryClient.invalidateQueries({
        queryKey: ["place.getAll"],
      });

      form.reset();

      setOpen(false);
    },

    onError: () => {
      showToast("Erreur lors de la création du lieu", 2000, "error");
    },
  });

  function submit(data: CreatePlaceDto) {
    mutate({
      body: data,
      params: {
        projectId,
      },
    });
  }

  const colors = ["green", "blue", "purple", "red", "yellow", "pink", "orange", "gray"];

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Créer un lieu</Text>

      <Text style={styles.label}>Nom</Text>

      <Controller
        control={form.control}
        name="name"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Nom du lieu"
          />
        )}
      />

      <Text style={styles.label}>Surnom</Text>

      <Controller
        control={form.control}
        name="nickname"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            value={safe(field.value)}
            onChangeText={field.onChange}
            placeholder="Surnom"
          />
        )}
      />

      <Text style={styles.label}>Type</Text>

      <Controller
        control={form.control}
        name="type"
        render={({ field }) => (
          <SingleSelector<TypeOption>
            {...field}
            value={typeOptions.find((type) => type.id === field.value)}
            onChange={(value) => {
              field.onChange(value?.id ?? "");
            }}
            placeholder="Sélectionner un type"
            data={typeOptions}
          />
        )}
      />

      <Text style={styles.label}>Localisation</Text>

      <Controller
        control={form.control}
        name="localisation"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Position géographique"
          />
        )}
      />

      <Text style={styles.label}>Description physique</Text>

      <Controller
        control={form.control}
        name="physicalDescription"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={safe(field.value)}
            onChangeText={field.onChange}
            placeholder="Description physique du lieu"
          />
        )}
      />

      <Text style={styles.label}>Atmosphère</Text>

      <Controller
        control={form.control}
        name="atmosphere"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={safe(field.value)}
            onChangeText={field.onChange}
            placeholder="Ambiance générale"
          />
        )}
      />

      <Text style={styles.label}>Histoire</Text>

      <Controller
        control={form.control}
        name="history"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={safe(field.value)}
            onChangeText={field.onChange}
            placeholder="Histoire du lieu"
          />
        )}
      />

      <Text style={styles.label}>Population</Text>

      <Controller
        control={form.control}
        name="population"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={safe(field.value)}
            onChangeText={field.onChange}
            placeholder="Population du lieu"
          />
        )}
      />

      <Text style={styles.label}>Usages</Text>

      <Controller
        control={form.control}
        name="usages"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={safe(field.value)}
            onChangeText={field.onChange}
            placeholder="Utilisation du lieu"
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
            value={languageOptions.find((type) => type.id === field.value)}
            onChange={(value) => {
              field.onChange(value?.id ?? "");
            }}
            placeholder="Sélectionner un type"
            data={languageOptions}
          />
        )}
      />

      <Text style={styles.label}>Gouvernement</Text>

      <Controller
        control={form.control}
        name="government"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={safe(field.value)}
            onChangeText={field.onChange}
            placeholder="Type de gouvernement"
          />
        )}
      />

      <Text style={styles.label}>Ressources</Text>

      <Controller
        control={form.control}
        name="ressources"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={safe(field.value)}
            onChangeText={field.onChange}
            placeholder="Ressources importantes"
          />
        )}
      />

      <Text style={styles.label}>Importance narrative</Text>

      <Controller
        control={form.control}
        name="narrativeImportance"
        render={({ field }) => (
          <SingleSelector<TypeOption>
            {...field}
            value={importanceOptions.find((importance) => importance.id === field.value)}
            onChange={(value) => {
              field.onChange(value?.id ?? "");
            }}
            placeholder="Sélectionner une importance"
            data={importanceOptions}
          />
        )}
      />

      <Text style={styles.label}>Couleur</Text>
      <View style={styles.colors}>
        <Controller
          control={form.control}
          name="color"
          render={({ field }) => (
            <>
              {colors.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => {
                    field.onChange(c);
                  }}
                  style={[
                    styles.color,
                    { backgroundColor: c },
                    field.value === c && styles.colorActive,
                  ]}
                />
              ))}
            </>
          )}
        />
      </View>
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
