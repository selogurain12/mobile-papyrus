/* eslint-disable no-unused-vars */

import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import {
  Edit3,
  Trash2,
  Link as LinkIcon,
  BookOpen,
  FileText,
  Globe,
  Video,
  Search,
  Image as ImageIcon,
  X,
} from "lucide-react-native";
// import Pdf from "react-native-pdf";
import { ResearchDto } from "../../../packages/src/dtos/research.dto";
import { styles } from "../../utils/style/card-style";

type Props = {
  research: ResearchDto;
  openEditModal: (research: ResearchDto) => void;
  openDeleteModal: (research: ResearchDto) => void;
};

export function ResearchCard({ research, openEditModal, openDeleteModal }: Props) {
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

  const categories = [
    { id: "all", label: "Tout", icon: Search },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "links", label: "Liens web", icon: LinkIcon },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "videos", label: "Vidéos", icon: Video },
    { id: "books", label: "Livres", icon: BookOpen },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "articles":
        return FileText;
      case "links":
        return Globe;
      case "images":
        return ImageIcon;
      case "videos":
        return Video;
      case "books":
        return BookOpen;
      default:
        return FileText;
    }
  };

  const TypeIcon = getTypeIcon(research.type);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "articles":
        return {
          backgroundColor: "#DBEAFE",
          color: "#1E40AF",
        };
      case "links":
        return {
          backgroundColor: "#DCFCE7",
          color: "#166534",
        };
      case "images":
        return {
          backgroundColor: "#F3E8FF",
          color: "#6B21A8",
        };
      case "videos":
        return {
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
        };
      case "books":
        return {
          backgroundColor: "#FEF9C3",
          color: "#854D0E",
        };
      default:
        return {
          backgroundColor: "#F3F4F6",
          color: "#374151",
        };
    }
  };

  const badgeStyle = getTypeColor(research.type);

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <TypeIcon size={20} color="#4F46E5" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{research.title}</Text>
              <Text style={styles.source}>{research.sources}</Text>
            </View>
          </View>

          <View style={[styles.badge, { backgroundColor: badgeStyle.backgroundColor }]}>
            <Text style={[styles.badgeText, { color: badgeStyle.color }]}>
              {categories.find((cat) => cat.id === research.type)?.label}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{research.description}</Text>

        <View style={styles.tags}>
          {research.tag?.map((tag: string, index: number) => (
            <View key={index} style={styles.badge}>
              <Text style={styles.badgeText}>#{tag}</Text>
            </View>
          ))}
        </View>

        {research.note && (
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>{research.note}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            disabled={!research.link}
            onPress={() => {
              setIsPDFModalOpen(true);
            }}
            style={styles.openButton}>
            <LinkIcon size={14} color={research.link ? "#4F46E5" : "#9CA3AF"} />
            <Text
              style={[
                styles.openButtonText,
                {
                  color: research.link ? "#4F46E5" : "#9CA3AF",
                },
              ]}>
              {research.link ? "Ouvrir" : "Pas de fichier"}
            </Text>
          </TouchableOpacity>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => {
                openEditModal(research);
              }}>
              <Edit3 size={18} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                openDeleteModal(research);
              }}>
              <Trash2 size={18} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        visible={isPDFModalOpen}
        animationType="slide"
        onRequestClose={() => {
          setIsPDFModalOpen(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{research.title}</Text>

            <TouchableOpacity
              onPress={() => {
                setIsPDFModalOpen(false);
              }}>
              <X size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* {research.link && <Pdf source={{ uri: research.link }} style={styles.pdf} />} */}
        </View>
      </Modal>
    </>
  );
}
