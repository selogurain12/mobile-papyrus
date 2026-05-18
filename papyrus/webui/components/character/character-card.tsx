import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { User, PencilLine, Trash2 } from "lucide-react-native";
import { CharacterDto } from "../../../packages/src/dtos/character.dto";
import { styles } from "../../utils/style/card-style";

export function CharacterCard({
  character,
  onSelect,
  onEdit,
  onDelete,
}: {
  character: CharacterDto;
  // eslint-disable-next-line no-unused-vars
  onSelect: (character: CharacterDto) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
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

  const roleMap: Record<string, string> = {
    protagonist: "Protagoniste",
    antagonist: "Antagoniste",
    ally: "Allié",
    mentor: "Mentor",
    "secondary character": "Personnage secondaire",
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        onSelect(character);
      }}
      activeOpacity={0.8}>
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: colorMap[character.color ?? "blue"] }]}>
          <User size={26} color="white" />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>
            {character.firstName} {character.lastName}
          </Text>
          <Text style={styles.description}>{roleMap[character.role] || character.role}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit}>
            <PencilLine size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete}>
            <Trash2 size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
