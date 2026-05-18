import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { PencilLine, Trash2 } from "lucide-react-native";
import { NoteDto } from "../../../packages/src/dtos/note.dto";
import { styles } from "../../utils/style/card-style";

type Props = {
  note: NoteDto;
  // eslint-disable-next-line no-unused-vars
  onSelect: (note: NoteDto) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function NoteCard({ note, onSelect, onEdit, onDelete }: Props) {
  const colorMap: Record<string, string> = {
    blue: "#3B82F6",
    red: "#EF4444",
    green: "#22C55E",
    yellow: "#EAB308",
    purple: "#A855F7",
    pink: "#EC4899",
    orange: "#F97316",
    gray: "#6B7280",
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        onSelect(note);
      }}
      style={[
        styles.card,
        {
          borderLeftColor: colorMap[note.color],
          borderLeftWidth: 4,
        },
      ]}>
      <View style={styles.content}>
        <Text style={styles.title}>{note.title}</Text>

        <Text numberOfLines={2} style={styles.text}>
          {note.content}
        </Text>

        <View style={styles.tags}>
          {note.tags?.map((tag) => (
            <View key={tag} style={styles.badge}>
              <Text style={styles.badgeText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit}>
          <PencilLine size={18} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete}>
          <Trash2 size={18} color="#DC2626" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
