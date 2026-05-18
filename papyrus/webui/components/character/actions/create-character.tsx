/* eslint-disable max-lines */
import { Text, TextInput, ScrollView, TouchableOpacity, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { SingleSelector } from "components/ui/single-select";
import React from "react";
import { TypeOption, roleOptions } from "utils/value-for-select";
import { StarRating } from "components/ui/star-rating";
import { GenderOption } from "components/ui/gender-option";
import { DatePicker } from "components/ui/date-picker";
import { TagInput } from "components/ui/tag-input";
import {
  CreateCharacterDto,
  createCharacterSchema,
} from "../../../../packages/src/dtos/character.dto";

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

export function CreateCharacter({ projectId, setOpen }: Props) {
  const queryClient = useQueryClient();
  const { currentProject } = useProject();
  const { showToast } = useToast();

  if (!currentProject) return;

  const form = useForm({
    resolver: zodResolver(createCharacterSchema),
    defaultValues: {
      roleStar: 1,

      firstName: "",
      lastName: "",
      nickName: "",
      pronouns: "",
      gender: "female",

      nationality: null,
      age: 0,
      birthDate: null,
      birthPlace: null,
      residencePlace: null,
      occupation: null,

      height: 0,
      weight: 0,
      corpulence: null,
      hairColor: null,
      eyesColor: null,
      voice: null,
      outfit: null,
      accessory: null,

      description: null,

      characterQualities: [],
      characterFlaws: [],

      tastes: null,
      tics: null,
      fears: null,

      education: null,
      richesses: 0,

      belief: null,
      secrets: null,
      notablePlaces: null,
      typicalExpression: null,

      goals: null,
      past: null,
      present: null,
      future: null,

      notes: null,

      color: "blue",
      project: currentProject,
    },
  });

  const { mutate, isPending } = client.character.create.useMutation({
    onSuccess: () => {
      showToast("Personnage créé avec succès", 2000, "success");
      void queryClient.invalidateQueries({ queryKey: ["character.getAll"] });
      form.reset();
      setOpen(false);
    },
    onError: () => {
      showToast("Erreur lors de la création du personnage", 2000, "error");
    },
  });

  function submit(data: CreateCharacterDto) {
    mutate({ body: data, params: { projectId } });
  }

  const colors = ["green", "blue", "purple", "red", "yellow", "pink", "orange", "gray"];

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Créer un personnage</Text>

      <Text style={styles.label}>Role</Text>
      <Controller
        control={form.control}
        name="role"
        render={({ field }) => (
          <SingleSelector<TypeOption>
            {...field}
            value={roleOptions.find((role) => role.id === field.value)}
            onChange={(value) => {
              field.onChange(value?.id ?? "");
            }}
            placeholder="Sélectionner un role"
            data={roleOptions}
          />
        )}
      />

      <Text style={styles.label}>Importance (stars)</Text>
      <Controller
        control={form.control}
        name="roleStar"
        render={({ field }) => <StarRating value={field.value} onChange={field.onChange} />}
      />

      <Text style={styles.label}>Prénom</Text>
      <Controller
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <TextInput style={styles.input} value={field.value} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Nom</Text>
      <Controller
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <TextInput style={styles.input} value={field.value} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Surnom</Text>
      <Controller
        control={form.control}
        name="nickName"
        render={({ field }) => (
          <TextInput style={styles.input} value={field.value} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Pronoms</Text>
      <Controller
        control={form.control}
        name="pronouns"
        render={({ field }) => (
          <TextInput style={styles.input} value={field.value} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Genre</Text>
      <Controller
        control={form.control}
        name="gender"
        render={({ field }) => (
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <GenderOption
                label="Femme"
                value="female"
                selected={field.value === "female"}
                onPress={() => {
                  field.onChange("female");
                }}
              />

              <GenderOption
                label="Homme"
                value="male"
                selected={field.value === "male"}
                onPress={() => {
                  field.onChange("male");
                }}
              />

              <GenderOption
                label="Autre"
                value="other"
                selected={field.value === "other"}
                onPress={() => {
                  field.onChange("other");
                }}
              />
            </View>
          </View>
        )}
      />

      <Text style={styles.label}>Nationalité</Text>
      <Controller
        control={form.control}
        name="nationality"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Âge</Text>
      <Controller
        control={form.control}
        name="age"
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

      <Text style={styles.label}>Date de naissance</Text>
      <Controller
        control={form.control}
        name="birthDate"
        render={({ field }) => <DatePicker value={field.value} setValue={field.onChange} />}
      />

      <Text style={styles.label}>Lieu naissance</Text>
      <Controller
        control={form.control}
        name="birthPlace"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Résidence</Text>
      <Controller
        control={form.control}
        name="residencePlace"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Occupation</Text>
      <Controller
        control={form.control}
        name="occupation"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Taille (en cm)</Text>
      <Controller
        control={form.control}
        name="height"
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

      <Text style={styles.label}>Poids (en kg)</Text>
      <Controller
        control={form.control}
        name="weight"
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

      <Text style={styles.label}>Corpulence</Text>
      <Controller
        control={form.control}
        name="corpulence"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Cheveux</Text>
      <Controller
        control={form.control}
        name="hairColor"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Yeux</Text>
      <Controller
        control={form.control}
        name="eyesColor"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Voix</Text>
      <Controller
        control={form.control}
        name="voice"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Outfit</Text>
      <Controller
        control={form.control}
        name="outfit"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Accessoire</Text>
      <Controller
        control={form.control}
        name="accessory"
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
            style={[styles.input, { height: 100 }]}
            multiline
            value={safe(field.value)}
            onChangeText={field.onChange}
          />
        )}
      />

      <TagInput
        label="Qualités"
        placeholder="Ajouter une qualité"
        values={form.watch("characterQualities") ?? []}
        onChange={(values) => {
          form.setValue("characterQualities", values);
        }}
        addButtonColor="#3B82F6"
        tagBackgroundColor="#DBEAFE"
        tagTextColor="#1D4ED8"
      />

      <TagInput
        label="Défauts"
        placeholder="Ajouter un défaut"
        values={form.watch("characterFlaws") ?? []}
        onChange={(values) => {
          form.setValue("characterFlaws", values);
        }}
        addButtonColor="#EF4444"
        tagBackgroundColor="#FEE2E2"
        tagTextColor="#B91C1C"
      />

      <Text style={styles.label}>Croyances</Text>
      <Controller
        control={form.control}
        name="belief"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Secrets</Text>
      <Controller
        control={form.control}
        name="secrets"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Peur</Text>
      <Controller
        control={form.control}
        name="fears"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Tics</Text>
      <Controller
        control={form.control}
        name="tics"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Goûts</Text>
      <Controller
        control={form.control}
        name="tastes"
        render={({ field }) => (
          <TextInput style={styles.input} value={safe(field.value)} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Passé</Text>
      <Controller
        control={form.control}
        name="past"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={safe(field.value)}
            onChangeText={field.onChange}
          />
        )}
      />

      <Text style={styles.label}>Présent</Text>
      <Controller
        control={form.control}
        name="present"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={safe(field.value)}
            onChangeText={field.onChange}
          />
        )}
      />

      <Text style={styles.label}>Futur</Text>
      <Controller
        control={form.control}
        name="future"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={safe(field.value)}
            onChangeText={field.onChange}
          />
        )}
      />

      <Text style={styles.label}>Objectifs</Text>
      <Controller
        control={form.control}
        name="goals"
        render={({ field }) => (
          <TextInput
            style={[styles.input, styles.textarea]}
            multiline
            value={safe(field.value)}
            onChangeText={field.onChange}
          />
        )}
      />

      <Text style={styles.label}>Notes</Text>
      <Controller
        control={form.control}
        name="notes"
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
