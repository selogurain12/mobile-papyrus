import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Package, PencilLine, Trash2 } from "lucide-react-native";

import { ObjectDto } from "../../../packages/src/dtos/object.dto";
import { styles } from "../../utils/style/card-style";

export function ObjectCard({
  object,
  onSelect,
  onEdit,
  onDelete,
}: {
  object: ObjectDto;
  // eslint-disable-next-line no-unused-vars
  onSelect: (object: ObjectDto) => void;
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

  const importanceMap: Record<string, string> = {
    high: "Élevée",
    medium: "Moyenne",
    low: "Faible",
  };

  const importanceColorMap: Record<string, string> = {
    high: "#FECACA",
    medium: "#FEF08A",
    low: "#BBF7D0",
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        onSelect(object);
      }}
      activeOpacity={0.8}>
      <View style={styles.row}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: colorMap[object.color ?? "blue"],
            },
          ]}>
          <Package size={24} color="white" />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{object.name}</Text>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: importanceColorMap[object.importance] ?? "#E5E7EB",
              },
            ]}>
            <Text style={styles.badgeText}>
              Importance : {importanceMap[object.importance] ?? object.importance}
            </Text>
          </View>
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
