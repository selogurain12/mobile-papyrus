/* eslint-disable max-lines */

import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Linking,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";

import {
  BookOpen,
  FileText,
  Globe,
  Video,
  Image as ImageIcon,
  File as FileIcon,
} from "lucide-react-native";

import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import * as DocumentPicker from "expo-document-picker";

import { clientFile } from "utils/clients/client-file";
import { TagInput } from "components/ui/tag-input";
import {
  ResearchDto,
  UpdateResearchDto,
  updateResearchSchema,
} from "../../../../packages/src/dtos/research.dto";

import { client } from "../../../utils/clients/client";

import { queryClient } from "../../../context/query-client";

import { useProject } from "../../../context/project-context";

import { useToast } from "../../ui/toast";
import { styles } from "../../../utils/style/form-style";

interface UpdateResearchFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;

  research: ResearchDto;
}

export function UpdateResearchForm({ setOpen, research }: UpdateResearchFormProps) {
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const [loading, setLoading] = useState(false);

  const [existingLink, setExistingLink] = useState<string | null>(research.link ?? null);

  const { currentProject } = useProject();

  const { showToast } = useToast();

  const form = useForm({
    resolver: zodResolver(updateResearchSchema),

    defaultValues: {
      title: research.title,
      type: research.type,
      link: research.link,
      sources: research.sources,
      description: research.description,
      tag: research.tag ?? [],
      note: research.note,
    },
  });

  const type = form.watch("type");
  const { mutateAsync: uploadFile } = clientFile.s3.upload.useMutation();

  const { mutateAsync: updateResearch } = client.research.update.useMutation();

  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
    });
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }
  // eslint-disable-next-line complexity
  async function onSubmit(data: UpdateResearchDto) {
    if (!currentProject) return;

    setLoading(true);

    try {
      let fileUrl: string | null = existingLink ?? data.link ?? research.link ?? null;

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

      if (!file && data.link === undefined && existingLink === null) {
        fileUrl = null;
      }

      await updateResearch({
        body: {
          ...data,
          link: fileUrl,
        },

        params: {
          projectId: currentProject.id,
          id: research.id,
        },
      });

      await queryClient.invalidateQueries({
        queryKey: ["research.getAll"],
      });

      showToast("Recherche mise à jour", 2000, "success");

      form.reset();

      setFile(null);

      setOpen(false);
    } catch {
      showToast("Erreur lors de la mise à jour", 2000, "error");
    } finally {
      setLoading(false);
    }
  }

  const types = [
    {
      value: "articles",
      label: "Article",
      icon: FileText,
    },
    {
      value: "links",
      label: "Lien",
      icon: Globe,
    },
    {
      value: "images",
      label: "Image",
      icon: ImageIcon,
    },
    {
      value: "videos",
      label: "Vidéo",
      icon: Video,
    },
    {
      value: "books",
      label: "Livre",
      icon: BookOpen,
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Modifier la recherche</Text>

      <Text style={styles.label}>Titre</Text>

      <Controller
        control={form.control}
        name="title"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder="Titre"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />

      <Text style={styles.label}>Type</Text>

      <Controller
        control={form.control}
        name="type"
        render={({ field }) => (
          <View style={styles.badges}>
            {types.map((item) => {
              const Icon = item.icon;

              const active = field.value === item.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.badge, active && styles.badgeSelected]}
                  onPress={() => {
                    field.onChange(item.value);
                  }}>
                  <Icon size={18} color={active ? "#2563EB" : "#374151"} />

                  <Text style={[styles.badgeText, active && styles.badgeTextSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />

      <Text style={styles.label}>Lien</Text>

      <Controller
        control={form.control}
        name="link"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder="https://..."
            value={field.value ?? ""}
            onChangeText={field.onChange}
          />
        )}
      />

      <Text style={styles.label}>Sources</Text>

      <Controller
        control={form.control}
        name="sources"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder="Le Monde..."
            value={field.value ?? ""}
            onChangeText={field.onChange}
          />
        )}
      />

      <Text style={styles.label}>Description</Text>

      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <TextInput
            multiline
            style={[styles.textarea, styles.input]}
            placeholder="Résumé"
            value={field.value ?? ""}
            onChangeText={field.onChange}
          />
        )}
      />

      <TagInput
        label="Tags"
        placeholder="Ajouter un tag"
        values={form.watch("tag") ?? []}
        onChange={(values) => {
          form.setValue("tag", values);
        }}
      />

      <Text style={styles.label}>Note</Text>

      <Controller
        control={form.control}
        name="note"
        render={({ field }) => (
          <TextInput
            multiline
            style={[styles.textarea, styles.input]}
            placeholder="Note interne"
            value={field.value ?? ""}
            onChangeText={field.onChange}
          />
        )}
      />

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
              <Text style={{ color: "#EF4444", fontWeight: "bold" }}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {type !== "links" && (
        <>
          <Text style={styles.label}>Fichier</Text>

          <TouchableOpacity style={styles.uploadButton} onPress={() => void pickFile()}>
            <Text style={styles.uploadButtonText}>{file ? file.name : "Choisir un fichier"}</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          form.reset();

          setOpen(false);
        }}>
        <Text style={styles.buttonText}>Annuler</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => void form.handleSubmit(onSubmit)()}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Mettre à jour</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
