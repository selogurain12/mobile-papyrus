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
import {
  PlaceDto,
  UpdatePlaceDto,
  updatePlaceSchema,
} from "../../../../packages/src/dtos/place.dto";

import { client } from "../../../utils/clients/client";
import { useProject } from "../../../context/project-context";
import { useToast } from "../../ui/toast";
import { styles } from "../../../utils/style/form-style";

type Props = {
  place: PlaceDto;
  onCancel?: () => void;
};

const safe = (v: unknown): string => {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);

  return "";
};

export function UpdatePlace({ place, onCancel }: Props) {
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  const { showToast } = useToast();

  const form = useForm({
    resolver: zodResolver(updatePlaceSchema),

    defaultValues: {
      name: place.name,
      nickname: place.nickname,
      type: place.type,
      localisation: place.localisation,

      physicalDescription: place.physicalDescription,
      atmosphere: place.atmosphere,
      history: place.history,
      population: place.population,
      usages: place.usages,

      language: place.language,
      government: place.government,
      ressources: place.ressources,

      narrativeImportance: place.narrativeImportance,

      color: place.color,
    },
  });

  const { mutate, isPending } = client.place.update.useMutation({
    onSuccess: () => {
      showToast("Lieu modifié avec succès", 2000, "success");

      void queryClient.invalidateQueries({
        queryKey: ["place.getAll"],
      });

      if (onCancel) onCancel();
    },

    onError: () => {
      showToast("Erreur lors de la modification du lieu", 2000, "error");
    },
  });

  function submit(data: UpdatePlaceDto) {
    if (!currentProject) return;

    mutate({
      body: data,
      params: {
        id: place.id,
        projectId: currentProject.id,
      },
    });
  }
  const colors = ["green", "blue", "purple", "red", "yellow", "pink", "orange", "gray"];

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Modifier un lieu</Text>

      <Text style={styles.label}>Nom</Text>

      <Controller
        control={form.control}
        name="name"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Surnom</Text>

      <Controller
        control={form.control}
        name="nickname"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
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
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
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

      <TouchableOpacity style={styles.button} onPress={onCancel}>
        <Text style={styles.buttonText}>Annuler</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          void form.handleSubmit(submit)();
        }}>
        <Text style={{ color: "#fff", textAlign: "center" }}>
          {isPending ? "Modification..." : "Modifier"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
