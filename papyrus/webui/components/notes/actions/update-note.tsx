import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import React, { useState } from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as DocumentPicker from "expo-document-picker";

import { FileIcon } from "lucide-react-native";
import { TagInput } from "components/ui/tag-input";
import { NoteDto, UpdateNoteDto, updateNoteSchema } from "../../../../packages/src/dtos/note.dto";
import { useProject } from "../../../context/project-context";
import { client } from "../../../utils/clients/client";
import { clientFile } from "../../../utils/clients/client-file";
import { queryClient } from "../../../context/query-client";
import { styles } from "../../../utils/style/form-style";

interface UpdateNoteFormProps {
  onCancel?: () => void;
  note: NoteDto;
}

export function UpdateNoteForm({ onCancel, note }: UpdateNoteFormProps) {
  const { currentProject } = useProject();

  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [existingLink, setExistingLink] = useState<string | null>(note.linkFile ?? null);
  const [loading, setLoading] = useState(false);

  if (!currentProject) return null;

  const form = useForm({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
      tags: note.tags ?? [],
      color: note.color,
      linkFile: note.linkFile,
    },
  });

  const { mutateAsync: uploadFile } = clientFile.s3.upload.useMutation();
  const { mutateAsync: updateNote } = client.note.update.useMutation();

  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
    });
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }

  const onSubmit = async (data: UpdateNoteDto) => {
    setLoading(true);

    try {
      let fileUrl: string | null = existingLink ?? data.linkFile ?? note.linkFile ?? null;

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

      if (!file && data.linkFile === undefined && existingLink === null) {
        fileUrl = null;
      }

      await updateNote({
        body: {
          ...data,
          linkFile: fileUrl,
        },
        params: {
          projectId: currentProject.id,
          id: note.id,
        },
      });

      await queryClient.invalidateQueries({
        queryKey: ["note.getAll"],
      });
      setFile(null);
      if (onCancel) onCancel();
      form.reset();
    } finally {
      setLoading(false);
    }
  };

  const colors = ["green", "blue", "purple", "red", "yellow", "pink", "orange", "gray"];

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Modifier la note</Text>

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
            style={[styles.input, { height: 120 }]}
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

      {existingLink && !file && (
        <View style={styles.existingFile}>
          <View style={styles.existingFileLeft}>
            <FileIcon size={20} color="#2563EB" />

            <View
              style={{
                flex: 1,
                marginLeft: 10,
              }}>
              <Text numberOfLines={1} style={styles.existingFileName}>
                {decodeURIComponent(existingLink.split("/").pop() ?? existingLink)}
              </Text>
            </View>
          </View>

          <View style={styles.fileActions}>
            <TouchableOpacity onPress={() => void Linking.openURL(existingLink)}>
              <Text style={styles.openText}>Ouvrir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setExistingLink(null);
              }}>
              <Text style={styles.deleteText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <>
        <Text style={styles.label}>Fichier</Text>

        <TouchableOpacity style={styles.uploadButton} onPress={() => void pickFile()}>
          <Text style={styles.uploadButtonText}>{file ? file.name : "Choisir un fichier"}</Text>
        </TouchableOpacity>
      </>

      <TouchableOpacity style={styles.button} onPress={onCancel}>
        <Text style={styles.buttonText}>Annuler</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => void form.handleSubmit(onSubmit)()}
        disabled={loading}
        style={styles.button}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sauvegarder</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
