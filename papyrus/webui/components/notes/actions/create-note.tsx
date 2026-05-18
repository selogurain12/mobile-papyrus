import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as DocumentPicker from "expo-document-picker";
import { useToast } from "components/ui/toast";
import { TagInput } from "components/ui/tag-input";
import { CreateNoteDto, createNoteSchema } from "../../../../packages/src/dtos/note.dto";

import { useProject } from "../../../context/project-context";
import { client } from "../../../utils/clients/client";
import { clientFile } from "../../../utils/clients/client-file";
import { queryClient } from "../../../context/query-client";
import { styles } from "../../../utils/style/form-style";

interface CreateNoteFormProps {
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
}

export function CreateNoteForm({ setOpen }: CreateNoteFormProps) {
  const { currentProject } = useProject();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  if (!currentProject) return null;

  const form = useForm({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      color: "blue",
      linkFile: null,
      project: currentProject,
    },
  });

  const { mutateAsync: uploadFile } = clientFile.s3.upload.useMutation();
  const { mutateAsync: createNote } = client.note.create.useMutation();

  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
    });

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }

  async function onSubmit(data: CreateNoteDto) {
    setLoading(true);

    if (currentProject === null) {
      showToast("Current project is null", 3000, "error");
      return;
    }

    try {
      let fileUrl = data.linkFile ?? null;

      if (file) {
        const formData = new FormData();

        formData.append("file", {
          uri: file.uri,
          name: file.name,
          type: file.mimeType ?? "application/octet-stream",
        } as unknown as Blob);

        const res = await uploadFile({
          body: formData,
        });

        fileUrl = res.body.url;
      }

      await createNote({
        body: {
          ...data,
          linkFile: fileUrl,
        },
        params: {
          projectId: currentProject.id,
        },
      });

      await queryClient.invalidateQueries({
        queryKey: ["note.getAll"],
      });

      form.reset();
      setFile(null);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  const colors = ["green", "blue", "purple", "red", "yellow", "pink", "orange", "gray"];

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Créer une note</Text>

      <Text style={styles.label}>Titre</Text>

      <Controller
        control={form.control}
        name="title"
        render={({ field }) => (
          <TextInput style={styles.input} value={field.value} onChangeText={field.onChange} />
        )}
      />

      <Text style={styles.label}>Contenu</Text>

      <Controller
        control={form.control}
        name="content"
        render={({ field }) => (
          <TextInput
            multiline
            style={[styles.input, styles.textarea]}
            value={field.value ?? ""}
            onChangeText={field.onChange}
          />
        )}
      />

      <TagInput
        label="Tags"
        placeholder="Ajouter un tag"
        values={form.watch("tags") ?? []}
        onChange={(values) => {
          form.setValue("tags", values);
        }}
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

      <Text style={styles.label}>Fichier</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={() => void pickFile()}>
        <Text style={styles.uploadButtonText}>{file ? file.name : "Choisir un fichier"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setOpen(false);
        }}>
        <Text style={styles.buttonText}>Annuler</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          void form.handleSubmit(onSubmit)();
        }}
        disabled={loading}
        style={styles.button}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Créer</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
