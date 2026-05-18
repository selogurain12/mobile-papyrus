import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MapPin, PencilLine, Trash2 } from "lucide-react-native";

import { PlaceDto } from "../../../packages/src/dtos/place.dto";
import { styles } from "../../utils/style/card-style";

export function PlaceCard({
  place,
  onSelect,
  onEdit,
  onDelete,
}: {
  place: PlaceDto;
  // eslint-disable-next-line no-unused-vars
  onSelect: (place: PlaceDto) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const colorMap: Record<string, string> = {
    green: "#22C55E",
    blue: "#3B82F6",
    purple: "#A855F7",
    red: "#EF4444",
    yellow: "#EAB308",
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

  const typeMap: Record<string, string> = {
    city: "Ville",
    village: "Village",
    country: "Pays",
    continent: "Continent",
    planet: "Planète",
    spaceStation: "Station spatiale",
    other: "Autre",
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        onSelect(place);
      }}
      activeOpacity={0.8}>
      <View style={styles.row}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: colorMap[place.color],
            },
          ]}>
          <MapPin size={26} color="white" />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{place.name}</Text>

          <Text style={styles.description}>{typeMap[place.type] ?? place.type}</Text>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: importanceColorMap[place.narrativeImportance],
              },
            ]}>
            <Text style={styles.badgeText}>
              Importance : {importanceMap[place.narrativeImportance] ?? place.narrativeImportance}
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
