/* eslint-disable no-nested-ternary */
/* eslint-disable max-lines */

import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  PencilLine,
  Plus,
  Trash2,
} from "lucide-react-native";

import React, { useMemo, useState } from "react";

import { useProject } from "context/project-context";

import { client } from "utils/clients/client";

import { queryKeys } from "../../../packages/src/query-client";

import { ChapterDto } from "../../../packages/src/dtos/chapter.dto";
import { PartDto } from "../../../packages/src/dtos/part.dto";

import { CreatePart } from "./actions/part/create-part";
import { CreateChapter } from "./actions/chapter/create-chapter";
import { ChapterDeleteActions } from "./actions/chapter/delete-chapter";
import { PartDeleteActions } from "./actions/part/delete-part";

import { ChapterDetail } from "./chapter-detail";
import { ChapterEditor } from "./chapter-editor";

import { UpdateChapter } from "./actions/chapter/update-chapter";
import { UpdatePart } from "./actions/part/update-part";

// eslint-disable-next-line complexity
export function ChapterList() {
  const { currentProject } = useProject();

  const [isCreatingPart, setIsCreatingPart] = useState(false);
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);

  const [selectedChapter, setSelectedChapter] = useState<ChapterDto | undefined>();
  const [selectedPart, setSelectedPart] = useState<PartDto | undefined>();

  const [isDeletingChapter, setIsDeletingChapter] = useState(false);
  const [isDeletingPart, setIsDeletingPart] = useState(false);

  const [isUpdatingChapter, setIsUpdatingChapter] = useState(false);
  const [isUpdatingPart, setIsUpdatingPart] = useState(false);

  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

  const { data: chaptersData } = client.chapter.getAll.useQuery({
    queryKey: queryKeys.chapter.getAll({
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

  const chapters = useMemo(() => {
    const data = chaptersData?.body.data ?? [];

    return data.map((chapter) => {
      if (selectedChapter?.id === chapter.id) {
        return selectedChapter;
      }

      return chapter;
    });
  }, [chaptersData, selectedChapter]);

  const totalWords = useMemo(() => {
    return chapters.reduce((acc, chapter) => {
      return acc + chapter.wordCount;
    }, 0);
  }, [chapters]);

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

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Vue d'ensemble</Text>

        <View style={styles.overviewRow}>
          <View style={[styles.badge, { backgroundColor: "#FAF5FF" }]}>
            <Text style={[styles.badgeValue, { color: "#9333EA" }]}>{parts?.body.total ?? 0}</Text>

            <Text style={styles.badgeLabel}>Parties</Text>
          </View>

          <View style={[styles.badge, { backgroundColor: "#EFF6FF" }]}>
            <Text style={[styles.badgeValue, { color: "#2563EB" }]}>
              {chaptersData?.body.total ?? 0}
            </Text>

            <Text style={styles.badgeLabel}>Chapitres</Text>
          </View>

          <View style={[styles.badge, { backgroundColor: "#ECFDF5" }]}>
            <Text style={[styles.badgeValue, { color: "#059669" }]}>{totalWords}</Text>

            <Text style={styles.badgeLabel}>Mots</Text>
          </View>
        </View>

        <View style={styles.chapterLayout}>
          <ScrollView style={styles.chapterList}>
            {parts?.body.data.map((part) => (
              <PartAccordion
                key={part.id}
                part={part}
                projectId={currentProject?.id ?? ""}
                selectedChapter={selectedChapter}
                onSelectChapter={(chapterSelected) => {
                  setSelectedChapter(chapterSelected);
                }}
                onEditPart={(partSelected) => {
                  setSelectedPart(partSelected);
                  setIsUpdatingPart(true);
                }}
                onDeletePart={(partSelected) => {
                  setSelectedPart(partSelected);
                  setIsDeletingPart(true);
                }}
              />
            ))}
          </ScrollView>

          <View style={styles.chapterDetails}>
            <ChapterDetail
              chapter={selectedChapter}
              onEdit={() => {
                if (!selectedChapter) return;

                setIsUpdatingChapter(true);
              }}
              onEditor={() => {
                if (!selectedChapter) return;

                setIsEditorOpen(true);
              }}
              onDelete={() => {
                if (!selectedChapter) return;

                setIsDeletingChapter(true);
              }}
            />
          </View>
        </View>
      </ScrollView>

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

      <Modal
        animationType="slide"
        transparent
        visible={isUpdatingChapter}
        onRequestClose={() => {
          setIsUpdatingChapter(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsUpdatingChapter(false);
              }}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
            {selectedChapter && (
              <UpdateChapter
                chapter={selectedChapter}
                projectId={currentProject?.id ?? ""}
                onCancel={() => {
                  setIsUpdatingChapter(false);
                }}
              />
            )}
          </View>
        </View>
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
            {selectedPart && (
              <UpdatePart
                part={selectedPart}
                projectId={currentProject?.id ?? ""}
                onCancel={() => {
                  setIsUpdatingPart(false);
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isEditorOpen}
        onRequestClose={() => {
          setIsEditorOpen(false);
        }}>
        {selectedChapter && (
          <ChapterEditor
            chapter={selectedChapter}
            onClose={() => {
              setIsEditorOpen(false);
            }}
            onSave={(updatedChapter) => {
              setSelectedChapter(updatedChapter);
              setIsEditorOpen(false);
            }}
          />
        )}
      </Modal>

      {selectedChapter && (
        <Modal visible={isDeletingChapter} transparent animationType="fade">
          <ChapterDeleteActions
            chapter={selectedChapter}
            open={isDeletingChapter}
            setOpen={setIsDeletingChapter}
            onClose={() => {
              setIsDeletingChapter(false);
              setSelectedChapter(undefined);
            }}
          />
        </Modal>
      )}

      {selectedPart && (
        <Modal visible={isDeletingPart} transparent animationType="fade">
          <PartDeleteActions
            part={selectedPart}
            open={isDeletingPart}
            setOpen={setIsDeletingPart}
            onClose={() => {
              setIsDeletingPart(false);
              setSelectedPart(undefined);
            }}
          />
        </Modal>
      )}
    </View>
  );
}

function PartAccordion({
  part,
  projectId,
  onSelectChapter,
  selectedChapter,
  onEditPart,
  onDeletePart,
}: {
  part: PartDto;
  projectId: string;
  onSelectChapter: (chapter: ChapterDto) => void;
  selectedChapter?: ChapterDto;
  onEditPart: (part: PartDto) => void;
  onDeletePart: (part: PartDto) => void;
}) {
  const [open, setOpen] = useState(false);

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

  let chapters = chaptersData?.body.data ?? [];

  chapters = chapters.map((chapter) => {
    if (selectedChapter?.id === chapter.id) {
      return selectedChapter;
    }

    return chapter;
  });

  const statusColorMap: Record<string, string> = {
    toStart: "#9CA3AF",
    inProgress: "#F59E0B",
    completed: "#22C55E",
  };

  const statusTextMap: Record<string, string> = {
    toStart: "À commencer",
    inProgress: "En cours",
    completed: "Terminé",
  };

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        onPress={() => {
          setOpen(!open);
        }}
        style={styles.accordionHeader}>
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}

        <BookOpen color="#2563EB" size={20} />

        <View style={{ marginLeft: 8, flex: 1 }}>
          <Text style={styles.accordionTitle}>{part.title}</Text>

          <Text style={styles.accordionSubtitle}>{chapters.length} chapitre(s)</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => {
              onEditPart(part);
            }}>
            <PencilLine size={18} color="#2563EB" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onDeletePart(part);
            }}>
            <Trash2 size={18} color="#DC2626" />
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
            chapters.map((ch) => (
              <TouchableOpacity
                key={ch.id}
                style={styles.chapterCard}
                onPress={() => {
                  onSelectChapter(ch);
                }}>
                <FileText size={16} color="#111827" />

                <View style={{ flex: 1 }}>
                  <Text style={styles.chapterTitle}>{ch.title}</Text>

                  <Text style={styles.chapterWords}>{ch.wordCount} mots</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Text
                    style={[
                      styles.status,
                      {
                        backgroundColor: statusColorMap[ch.status] ?? "#E5E7EB",
                      },
                    ]}>
                    {statusTextMap[ch.status] ?? ch.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    marginBottom: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  sectionTitle: {
    marginBottom: 12,
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 8,
  },

  addPart: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  addChapter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16A34A",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  addButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
  },

  content: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
  },

  overviewRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },

  badge: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  badgeValue: {
    fontSize: 20,
    fontWeight: "700",
  },

  badgeLabel: {
    marginTop: 4,
    color: "#111827",
    fontSize: 13,
  },

  chapterLayout: {
    flex: 1,
  },

  chapterList: {
    flexGrow: 0,
  },

  chapterDetails: {
    flex: 1,
    marginTop: 12,
  },

  accordionContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  accordionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  accordionSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  accordionContent: {
    marginTop: 12,
  },

  chapterCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  chapterTitle: {
    fontWeight: "700",
    color: "#111827",
  },

  chapterWords: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 13,
  },

  status: {
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    overflow: "hidden",
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
    padding: 20,
  },

  close: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
});
