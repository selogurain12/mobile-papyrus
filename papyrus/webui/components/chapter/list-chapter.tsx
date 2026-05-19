/* eslint-disable no-nested-ternary */
/* eslint-disable max-lines */
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  PencilLine,
  Plus,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import { useProject } from "context/project-context";
import { client } from "utils/clients/client";
import { queryKeys } from "../../../packages/src/query-client";
import { ChapterDto } from "../../../packages/src/dtos/chapter.dto";
import { PartDto } from "../../../packages/src/dtos/part.dto";
import { CreatePart } from "./actions/part/create-part";
import { CreateChapter } from "./actions/chapter/create-chapter";
import { UpdateChapter } from "./actions/chapter/update-chapter";
import { UpdatePart } from "./actions/part/update-part";
import { PartDeleteActions } from "./actions/part/delete-part";
import { ChapterDeleteActions } from "./actions/chapter/delete-chapter";

// eslint-disable-next-line complexity
export function ChapterList() {
  const { currentProject } = useProject();

  const [isCreatingPart, setIsCreatingPart] = useState(false);
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);

  const { data: parts } = client.part.getAll.useQuery({
    queryKey: queryKeys.part.getAll({
      pathParams: {
        projectId: currentProject?.id ?? "",
      },
    }),
    queryData: {
      params: {
        projectId: currentProject?.id ?? "",
      },
    },
    enabled: !!currentProject?.id,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Structure du livre</Text>
          <Text style={styles.subtitle}>Organisez vos parties et vos chapitres</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.addPart}
            onPress={() => {
              setIsCreatingPart(true);
            }}>
            <Plus size={18} color="white" />
            <Text style={styles.addButtonText}>Nouvelle partie</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addChapter}
            onPress={() => {
              setIsCreatingChapter(true);
            }}>
            <Plus size={18} color="white" />
            <Text style={styles.addButtonText}>Nouveau chapitre</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={{ marginBottom: 8, fontWeight: "600" }}>Vue d'ensemble</Text>

        <View style={styles.overviewRow}>
          <View style={[styles.badge, { backgroundColor: "#EFF6FF" }]}>
            <Text style={{ color: "#2563EB", fontWeight: "600" }}>{parts?.body.total ?? 0}</Text>
            <Text style={{ color: "black" }}>Parties</Text>
          </View>
        </View>

        {parts?.body.data.map((part) => (
          <PartAccordion key={part.id} part={part} projectId={currentProject?.id ?? ""} />
        ))}
      </View>

      {/* CREATE PART */}
      <Modal
        animationType="slide"
        transparent
        visible={isCreatingPart}
        onRequestClose={() => {
          setIsCreatingPart(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsCreatingPart(false);
              }}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>

            <CreatePart setOpen={setIsCreatingPart} projectId={currentProject?.id ?? ""} />
          </View>
        </View>
      </Modal>

      {/* CREATE CHAPTER */}
      <Modal
        animationType="slide"
        transparent
        visible={isCreatingChapter}
        onRequestClose={() => {
          setIsCreatingChapter(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsCreatingChapter(false);
              }}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>

            <CreateChapter setOpen={setIsCreatingChapter} projectId={currentProject?.id ?? ""} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// eslint-disable-next-line complexity
function PartAccordion({ part, projectId }: { part: PartDto; projectId: string }) {
  const [open, setOpen] = useState(false);
  const [isUpdatingPart, setIsUpdatingPart] = useState(false);
  const [isUpdatingChapter, setIsUpdatingChapter] = useState(false);
  const [isDeletingPart, setIsDeletingPart] = useState(false);
  const [isDeletingChapter, setIsDeletingChapter] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<ChapterDto | null>(null);
  const { currentProject } = useProject();

  const { data: chaptersData, isLoading } = client.chapter.getByPart.useQuery({
    queryKey: queryKeys.chapter.getByPart({
      pathParams: {
        projectId,
        partId: part.id,
      },
    }),
    queryData: {
      params: {
        projectId,
        partId: part.id,
      },
    },
    enabled: open,
  });

  const statusColorMap: Record<string, string> = {
    toStart: "#a7a7a7",
    inProgress: "#ff9728",
    completed: "#22C55E",
  };

  const statusTextMap: Record<string, string> = {
    toStart: "À commencer",
    inProgress: "En cours",
    completed: "Terminé",
  };

  const chapters = chaptersData?.body.data ?? [];

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        onPress={() => {
          setOpen(!open);
        }}
        style={styles.accordionHeader}>
        <Text style={styles.accordionIcon}>{open ? <ChevronDown /> : <ChevronRight />}</Text>

        <BookOpen style={{ width: 20, height: 20 }} color="#2563EB" />

        <View style={{ marginLeft: 8, flex: 1 }}>
          <Text style={styles.accordionTitle}>{part.title}</Text>

          <Text style={styles.accordionSubtitle}>{chapters.length} chapitre(s)</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => {
              setIsUpdatingPart(true);
            }}>
            <PencilLine size={15} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsDeletingPart(true);
            }}>
            <Trash2 size={15} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {open && (
        <View style={styles.accordionContent}>
          {isLoading ? (
            <Text>Chargement...</Text>
          ) : chapters.length === 0 ? (
            <Text>Aucun chapitre</Text>
          ) : (
            chapters.map((ch: ChapterDto) => (
              <>
                <View key={ch.id} style={styles.chapterCard}>
                  <FileText size={16} color="#111" style={{ marginBottom: 4 }} />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.chapterTitle}>{ch.title}</Text>

                    <Text style={styles.chapterWords}>{ch.wordCount} mots</Text>
                  </View>

                  <Text
                    style={[
                      styles.status,
                      statusColorMap[ch.status]
                        ? { backgroundColor: statusColorMap[ch.status] }
                        : {},
                    ]}>
                    {statusTextMap[ch.status] || ch.status}
                  </Text>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedChapter(ch);
                        setIsUpdatingChapter(true);
                      }}>
                      <PencilLine size={15} color="#6B7280" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setSelectedChapter(ch);
                        setIsDeletingChapter(true);
                      }}>
                      <Trash2 size={15} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ))
          )}
        </View>
      )}

      <Modal visible={isDeletingPart} transparent animationType="fade">
        <PartDeleteActions
          part={part}
          open={isDeletingPart}
          setOpen={setIsDeletingPart}
          onClose={() => {
            setIsDeletingPart(false);
          }}
        />
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={isUpdatingPart}
        onRequestClose={() => {
          setIsUpdatingPart(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsUpdatingPart(false);
              }}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>

            <UpdatePart
              onCancel={() => {
                setIsUpdatingPart(false);
              }}
              part={part}
              projectId={currentProject?.id ?? ""}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent
        visible={isUpdatingChapter}
        onRequestClose={() => {
          setSelectedChapter(null);
          setIsUpdatingChapter(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                setSelectedChapter(null);
                setIsUpdatingChapter(false);
              }}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>

            {selectedChapter && (
              <UpdateChapter
                chapter={selectedChapter}
                projectId={projectId}
                onCancel={() => {
                  setSelectedChapter(null);
                  setIsUpdatingChapter(false);
                }}
              />
            )}
          </View>
        </View>
      </Modal>
      {selectedChapter && (
        <Modal visible={isDeletingChapter} transparent animationType="fade">
          <ChapterDeleteActions
            chapter={selectedChapter}
            open={isDeletingChapter}
            setOpen={setIsDeletingChapter}
            onClose={() => {
              setSelectedChapter(null);
              setIsDeletingChapter(false);
            }}
          />
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },

  header: {
    marginBottom: 16,
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },

  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },

  badge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: "30%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
  },

  addChapter: {
    flexDirection: "row",
    backgroundColor: "#16A34A",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  addPart: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  addButtonText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
  },

  content: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: "auto",
  },

  accordionContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  accordionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  accordionSubtitle: {
    fontSize: 13,
    color: "#666",
  },

  accordionIcon: {
    fontSize: 18,
    color: "#333",
  },

  accordionContent: {
    marginTop: 12,
  },

  chapterCard: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  chapterTitle: {
    fontWeight: "bold",
  },

  chapterWords: {
    color: "#555",
  },

  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
  },

  statusDone: {
    backgroundColor: "#1aff89",
    color: "#065F46",
  },

  statusProgress: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
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
