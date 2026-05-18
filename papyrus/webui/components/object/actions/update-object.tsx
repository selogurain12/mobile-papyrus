import { Text, TextInput, ScrollView, TouchableOpacity, View } from "react-native";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQueryClient } from "@tanstack/react-query";

import { SingleSelector } from "components/ui/single-select";
import React from "react";
import { importanceOptions, objectTypeOptions, TypeOption } from "utils/value-for-select";
import {
  ObjectDto,
  UpdateObjectDto,
  updateObjectSchema,
} from "../../../../packages/src/dtos/object.dto";

import { client } from "../../../utils/clients/client";
import { useProject } from "../../../context/project-context";
import { useToast } from "../../ui/toast";
import { styles } from "../../../utils/style/form-style";

type Props = {
  object: ObjectDto;
  onCancel?: () => void;
};

const safe = (v: unknown): string => {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);

  return "";
};

export function UpdateObject({ object, onCancel }: Props) {
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  const { showToast } = useToast();

  const form = useForm({
    resolver: zodResolver(updateObjectSchema),

    defaultValues: {
      name: object.name,

      importance: object.importance,

      description: object.description,
      appearance: object.appearance,
      significance: object.significance,

      location: object.location,
      type: object.type,
      history: object.history,

      color: object.color ?? "blue",
    },
  });

  const { mutate, isPending } = client.object.update.useMutation({
    onSuccess: () => {
      showToast("Objet modifié avec succès", 2000, "success");

      void queryClient.invalidateQueries({
        queryKey: ["object.getAll"],
      });

      if (onCancel) onCancel();
    },

    onError: () => {
      showToast("Erreur lors de la modification de l'objet", 2000, "error");
    },
  });

  function submit(data: UpdateObjectDto) {
    if (!currentProject) return;

    mutate({
      body: data,
      params: {
        id: object.id,
        projectId: currentProject.id,
      },
    });
  }

  const colors = ["green", "blue", "purple", "red", "yellow", "pink", "orange", "gray"];

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Modifier un objet</Text>

      <Text style={styles.label}>Nom</Text>

      <Controller
        control={form.control}
        name="name"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Importance</Text>

      <Controller
        control={form.control}
        name="importance"
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

      <Text style={styles.label}>Type</Text>

      <Controller
        control={form.control}
        name="type"
        render={({ field }) => (
          <SingleSelector<TypeOption>
            {...field}
            value={objectTypeOptions.find((type) => type.id === field.value)}
            onChange={(value) => {
              field.onChange(value?.id ?? "");
            }}
            placeholder="Sélectionner un type"
            data={objectTypeOptions}
          />
        )}
      />

      <Text style={styles.label}>Localisation</Text>

      <Controller
        control={form.control}
        name="location"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Description</Text>

      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={safe(field.value)}
            onChangeText={field.onChange}
          />
        )}
      />

      <Text style={styles.label}>Apparence</Text>

      <Controller
        control={form.control}
        name="appearance"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={safe(field.value)}
            onChangeText={field.onChange}
          />
        )}
      />

      <Text style={styles.label}>Signification</Text>

      <Controller
        control={form.control}
        name="significance"
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

      <TouchableOpacity style={[styles.button]} onPress={onCancel}>
        <Text style={styles.buttonText}>Annuler</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          void form.handleSubmit(submit)();
        }}>
        <Text style={styles.buttonText}>{isPending ? "Modification..." : "Modifier"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
