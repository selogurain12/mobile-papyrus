import { Text, TextInput, ScrollView, TouchableOpacity, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { SingleSelector } from "components/ui/single-select";
import { TypeOption, importanceOptions, objectTypeOptions } from "utils/value-for-select";
import React from "react";
import { CreateObjectDto, createObjectSchema } from "../../../../packages/src/dtos/object.dto";

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

export function CreateObject({ projectId, setOpen }: Props) {
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  const { showToast } = useToast();

  if (!currentProject) return null;

  const form = useForm({
    resolver: zodResolver(createObjectSchema),

    defaultValues: {
      name: "",

      description: null,
      appearance: null,
      significance: null,
      location: null,
      type: null,
      history: null,

      color: "blue",

      project: currentProject,
    },
  });

  const { mutate, isPending } = client.object.create.useMutation({
    onSuccess: () => {
      showToast("Objet créé avec succès", 2000, "success");

      void queryClient.invalidateQueries({
        queryKey: ["object.getAll"],
      });

      form.reset();
      setOpen(false);
    },

    onError: () => {
      showToast("Erreur lors de la création de l'objet", 2000, "error");
    },
  });

  function submit(data: CreateObjectDto) {
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
      <Text style={styles.title}>Créer un objet</Text>

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
