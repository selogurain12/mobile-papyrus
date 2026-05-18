import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import { Plus } from "lucide-react-native";

import { NoteDto } from "../../../packages/src/dtos/note.dto";
import { queryKeys } from "../../../packages/src/query-client";
import { client } from "../../utils/clients/client";
import { useProject } from "../../context/project-context";

import { NoteCard } from "./note-card";
import { NoteDetails } from "./note-details";
import { CreateNoteForm } from "./actions/create-note";
import { UpdateNoteForm } from "./actions/update-note";
import { NoteDeleteActions } from "./actions/delete-note";

export function NotesList() {
  const [notesSelected, setNotesSelected] = useState<NoteDto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { currentProject } = useProject();

  if (!currentProject) return null;

  const { data } = client.note.getAll.useQuery({
    queryKey: queryKeys.note.getAll({
      pathParams: { projectId: currentProject.id },
    }),
    queryData: {
      params: { projectId: currentProject.id },
    },
  });

  const notes = data?.body.data ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notes</Text>
          <Text style={styles.subtitle}>Capturez vos idées et réflexions</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setIsCreating(true);
          }}>
          <Plus size={18} color="#fff" />
          <Text style={styles.buttonText}>Nouvelle note</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onSelect={(note) => {
              setNotesSelected(note);
            }}
            onEdit={() => {
              setNotesSelected(item);
              setIsUpdating(true);
            }}
            onDelete={() => {
              setNotesSelected(item);
              setIsDeleting(true);
            }}
          />
        )}
      />

      {notesSelected && (
        <NoteDetails
          note={notesSelected}
          onClose={() => {
            setNotesSelected(null);
          }}
        />
      )}

      <Modal
        animationType="slide"
        transparent
        visible={isCreating}
        onRequestClose={() => {
          setIsCreating(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsCreating(false);
              }}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>

            <CreateNoteForm setOpen={setIsCreating} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={isUpdating}
        onRequestClose={() => {
          setIsUpdating(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsUpdating(false);
              }}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>

            {notesSelected && (
              <UpdateNoteForm
                note={notesSelected}
                onCancel={() => {
                  setIsUpdating(false);
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      {notesSelected && (
        <NoteDeleteActions
          open={isDeleting}
          setOpen={(open) => {
            setIsDeleting(open);
          }}
          note={notesSelected}
          clearSelection={() => {
            setNotesSelected(null);
            setIsDeleting(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContainer: {
    flex: 1,
    marginTop: 80,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },

  close: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
});
