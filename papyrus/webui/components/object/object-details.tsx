import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Collapsible from "react-native-collapsible";
import { ChevronDown, Package } from "lucide-react-native";
import { ObjectDto } from "../../../packages/src/dtos/object.dto";
import { styles } from "../../utils/style/item-detail";

interface ObjectDetailProps {
  object: ObjectDto | undefined;
}

export function ObjectDetail({ object }: ObjectDetailProps) {
  const [sections, setSections] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
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

  const typeMap: Record<string, string> = {
    weapon: "Arme",
    vehicle: "Véhicule",
    artifact: "Artefact",
    tool: "Outil",
    clothing: "Vêtement",
    jewelry: "Bijou",
    furniture: "Meuble",
    technology: "Technologie",
    paper: "Documents",
    equipment: "Équipement",
  };

  if (!object) {
    return (
      <View style={styles.emptyCard}>
        <Package size={60} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>Sélectionnez un objet</Text>
        <Text style={styles.emptySubtitle}>Choisissez un objet pour voir ses détails</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.card}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colorMap[object.color ?? "blue"] }]}>
          <Package size={32} color="white" />
        </View>

        <View>
          <Text style={styles.name}>{object.name}</Text>

          <Text style={styles.subtitle}>
            {object.type ? (typeMap[object.type] ?? object.type) : "Type inconnu"}
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Importance : {importanceMap[object.importance] ?? object.importance}
            </Text>
          </View>
        </View>
      </View>

      {renderSection(
        "DESCRIPTION",
        "description",
        isOpen("description"),
        toggle,
        <View style={styles.column}>
          {row("Description", object.description)}
          {row("Apparence", object.appearance)}
          {row("Signification", object.significance)}
          {row("Localisation", object.location)}
        </View>
      )}

      {renderSection(
        "HISTOIRE",
        "history",
        isOpen("history"),
        toggle,
        <View style={styles.column}>{row("Histoire", object.history)}</View>
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

function row(label: string, value?: string | null) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label} :</Text>
      <Text style={styles.value}>{value ?? "Non spécifié"}</Text>
    </View>
  );
}
