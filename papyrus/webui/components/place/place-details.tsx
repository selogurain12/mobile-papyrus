import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Collapsible from "react-native-collapsible";
import { MapPin, ChevronDown } from "lucide-react-native";

import { PlaceDto } from "../../../packages/src/dtos/place.dto";
import { styles } from "../../utils/style/item-detail";

interface PlaceDetailProps {
  place: PlaceDto | undefined;
}

export function PlaceDetail({ place }: PlaceDetailProps) {
  const [sections, setSections] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isOpen = (key: string) => sections[key];

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
    low: "Basse",
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

  if (!place) {
    return (
      <View style={styles.emptyCard}>
        <MapPin size={60} color="#D1D5DB" />

        <Text style={styles.emptyTitle}>Sélectionnez un lieu</Text>

        <Text style={styles.emptySubtitle}>Choisissez un lieu pour voir ses détails</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.card}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: colorMap[place.color],
            },
          ]}>
          <MapPin size={32} color="white" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{place.name}</Text>

          <Text style={styles.subtitle}>{typeMap[place.type] ?? place.type}</Text>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: importanceColorMap[place.narrativeImportance],
              },
            ]}>
            <Text style={styles.badgeText}>
              Importance {importanceMap[place.narrativeImportance] ?? place.narrativeImportance}
            </Text>
          </View>
        </View>
      </View>

      {renderSection(
        "INFORMATIONS GÉNÉRALES",
        "general",
        isOpen("general"),
        toggle,
        <View style={styles.column}>
          {row("Surnom", place.nickname)}
          {row("Type", typeMap[place.type] ?? place.type)}
          {row("Localisation", place.localisation)}
          {row("Langue", place.language)}
          {row("Gouvernement", place.government)}
          {row("Population", place.population)}
          {row("Ressources", place.ressources)}
        </View>
      )}

      {renderSection(
        "DESCRIPTION",
        "description",
        isOpen("description"),
        toggle,
        <View style={styles.column}>
          {row("Description physique", place.physicalDescription)}
          {row("Atmosphère", place.atmosphere)}
          {row("Usages", place.usages)}
        </View>
      )}

      {renderSection(
        "HISTOIRE",
        "history",
        isOpen("history"),
        toggle,
        <View style={styles.column}>{row("Histoire", place.history)}</View>
      )}
    </ScrollView>
  );
}

// eslint-disable-next-line max-params
function renderSection(
  title: string,
  key: string,
  isOpen: boolean,
  // eslint-disable-next-line no-unused-vars
  toggle: (key: string) => void,
  content: React.ReactNode
) {
  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => {
          toggle(key);
        }}>
        <Text style={styles.sectionTitle}>{title}</Text>

        <ChevronDown
          size={18}
          color="#111"
          style={{
            transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>

      <Collapsible collapsed={!isOpen}>
        <View style={styles.sectionContent}>{content}</View>
      </Collapsible>
    </View>
  );
}

function row(label: string, value?: string | number | null) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label} :</Text>

      <Text style={styles.value}>{value ?? "Non spécifié"}</Text>
    </View>
  );
}
