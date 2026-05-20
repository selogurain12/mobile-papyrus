import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useMemo, useState } from "react";
import { ArrowLeft, Bold, Italic, List, Save, Type } from "lucide-react-native";

import { client } from "utils/clients/client";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useToast } from "components/ui/toast";

import { ChapterDto } from "../../../packages/src/dtos/chapter.dto";

interface ChapterEditorProps {
  chapter: ChapterDto;
  onClose: () => void;
  onSave: (chapter: ChapterDto) => void;
}

export function ChapterEditor({ chapter, onClose, onSave }: ChapterEditorProps) {
  const [content, setContent] = useState(chapter.content ?? "");

  const { showToast } = useToast();

  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const characterCount = content.length;

  function addMarkdown(wrapper: string) {
    setContent((prev) => `${prev}${wrapper}`);
  }

  const { mutate, isPending } = client.chapter.update.useMutation({
    onSuccess: (response) => {
      showToast("Contenu du chapitre mis à jour", 2000, "success");
      onSave(response.body);
      onClose();
    },

    onError: (error) => {
      if (isFetchError(error)) {
        showToast(error.message, 2000, "error");
      } else {
        showToast("Une erreur est survenue", 2000, "error");
      }
    },
  });

  function handleSave() {
    mutate({
      params: {
        id: chapter.id,
        projectId: chapter.project.id,
      },

      body: {
        ...chapter,
        content,
        wordCount,
      },
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{chapter.title}</Text>

          <Text style={styles.subtitle}>
            {wordCount} mots • {characterCount} caractères
          </Text>
        </View>

        <TouchableOpacity
          disabled={isPending}
          style={[
            styles.saveButton,
            isPending && {
              opacity: 0.7,
            },
          ]}
          onPress={handleSave}>
          <Save size={18} color="white" />

          <Text style={styles.saveText}>{isPending ? "Sauvegarde..." : "Sauvegarder"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => {
            addMarkdown("**gras**");
          }}>
          <Bold size={18} color="#374151" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => {
            addMarkdown("*italique*");
          }}>
          <Italic size={18} color="#374151" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => {
            addMarkdown("\n• ");
          }}>
          <List size={18} color="#374151" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => {
            addMarkdown("\n# ");
          }}>
          <Type size={18} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.editorWrapper}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled">
        <TextInput
          multiline
          autoFocus
          value={content}
          onChangeText={setContent}
          placeholder="Commencez à écrire votre chapitre..."
          placeholderTextColor="#9CA3AF"
          textAlignVertical="top"
          style={styles.editor}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    marginRight: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },

  saveText: {
    color: "white",
    fontWeight: "600",
  },

  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  toolButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  editorWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  editor: {
    flex: 1,
    minHeight: 600,
    backgroundColor: "white",
    borderRadius: 18,
    padding: 22,
    fontSize: 18,
    lineHeight: 32,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
