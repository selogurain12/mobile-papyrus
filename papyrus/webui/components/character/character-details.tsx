import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Collapsible from "react-native-collapsible";
import { User, ChevronDown } from "lucide-react-native";
import { parseZonedDateTime } from "@internationalized/date";
import { CharacterDto } from "../../../packages/src/dtos/character.dto";
import { format } from "../../utils/date/date-utils";
import { styles } from "../../utils/style/item-detail";

interface CharacterDetailProps {
  character: CharacterDto | undefined;
}

export function CharacterDetail({ character }: CharacterDetailProps) {
  const [sections, setSections] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isOpen = (key: string) => sections[key];

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

  const genderMap: Record<string, string> = {
    male: "Homme",
    female: "Femme",
    other: "Autre",
  };

  if (!character) {
    return (
      <View style={styles.emptyCard}>
        <User size={60} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>Sélectionnez un personnage</Text>
        <Text style={styles.emptySubtitle}>Choisissez un personnage pour voir ses détails</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.card}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colorMap[character.color ?? "blue"] }]}>
          <User size={32} color="white" />
        </View>

        <View>
          <Text style={styles.name}>
            {character.firstName} {character.lastName}
          </Text>

          <Text style={styles.subtitle}>
            {character.age} ans • {character.birthPlace ?? "Lieu inconnu"}
          </Text>

          <View style={styles.roleRow}>
            <Text style={styles.roleLabel}>Rôle :</Text>
            <View style={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Text key={i} style={{ color: i < character.roleStar ? "#FACC15" : "#D1D5DB" }}>
                  ★
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>

      {renderSection(
        "ÉTAT CIVIL",
        "civil",
        isOpen("civil"),
        toggle,
        <View style={styles.column}>
          {row("Prénom", character.firstName)}
          {row("Nom", character.lastName)}
          {row("Surnom", character.nickName)}
          {row("Pronoms", character.pronouns)}
          {row("Genre", genderMap[character.gender])}
          {row("Nationalité", character.nationality)}
          {row(
            "Date de naissance",
            character.birthDate
              ? format(parseZonedDateTime(character.birthDate), "dd MMMM yyyy")
              : "Non spécifié"
          )}
          {row("Résidence", character.residencePlace)}
          {row("Occupation", character.occupation)}
        </View>
      )}

      {renderSection(
        "PHYSIQUE",
        "physical",
        isOpen("physical"),
        toggle,
        <View style={styles.column}>
          {row("Taille", `${character.height} cm`)}
          {row("Poids", `${character.weight} kg`)}
          {row("Corpulence", character.corpulence)}
          {row("Cheveux", character.hairColor)}
          {row("Yeux", character.eyesColor)}
          {row("Voix", character.voice)}
          {row("Tenue", character.outfit)}
          {row("Accessoire", character.accessory)}
          {row("Description", character.description)}
        </View>
      )}

      {renderSection(
        "CARACTÈRE",
        "trait",
        isOpen("trait"),
        toggle,
        <View style={styles.column}>
          {badgeRow("Qualités", character.characterQualities ?? [], "#3B82F6")}
          {badgeRow("Défauts", character.characterFlaws ?? [], "#EF4444")}
          {row("Goûts", character.tastes)}
          {row("Tics", character.tics)}
          {row("Peur", character.fears)}
        </View>
      )}

      {renderSection(
        "PROFIL",
        "profile",
        isOpen("profile"),
        toggle,
        <View style={styles.column}>
          {row("Éducation", character.education)}
          {row("Richesses", character.richesses)}
          {row("Croyances", character.belief)}
          {row("Secrets", character.secrets)}
          {row("Lieux notables", character.notablePlaces)}
          {row("Expression", character.typicalExpression)}
        </View>
      )}

      {renderSection(
        "HISTOIRE",
        "story",
        isOpen("story"),
        toggle,
        <View style={styles.column}>
          {row("Passé", character.past)}
          {row("Présent", character.present)}
          {row("Futur", character.future)}
          {row("Objectifs", character.goals)}
        </View>
      )}

      {renderSection(
        "NOTES",
        "notes",
        isOpen("notes"),
        toggle,
        <View style={styles.column}>{row("Notes", character.notes)}</View>
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

function badgeRow(label: string, items: string[], color: string) {
  return (
    <View style={styles.column}>
      <Text style={styles.label}>{label} :</Text>
      <View style={styles.badges}>
        {items.length ? (
          items.map((item, i) => (
            <View key={i} style={[styles.badge, { backgroundColor: color }]}>
              <Text style={styles.badgeText}>{item}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.value}>Non spécifié</Text>
        )}
      </View>
    </View>
  );
}
