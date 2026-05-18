import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { HeaderWithSidebar } from "./header";

import { CharactersList } from "./character/list-character";
import { PlacesList } from "./place/list-place";
import { ObjectsList } from "./object/list-object";
import { ListResearch } from "./research/list-research";
import { NotesList } from "./notes/list-notes";
import { EventsList } from "./event/list-event";
import { ChapterList } from "./chapter/list-chapter";

export type ProjectScreen =
  | "dashboard"
  | "characters"
  | "places"
  | "objects"
  | "chapters"
  | "research"
  | "writing-tools"
  | "timeline"
  | "structure"
  | "mind-maps"
  | "notes"
  | "export";

type Props = NativeStackScreenProps<RootStackParamList, "Project">;

export function HomeProject({ route }: Props) {
  const { name } = route.params;
  const [screen, setScreen] = useState<ProjectScreen>("dashboard");

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <HeaderWithSidebar name={name} setScreen={setScreen} />

        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            {screen === "dashboard" && <View style={{ flex: 1 }} />}
            {screen === "characters" && <CharactersList />}
            {screen === "places" && <PlacesList />}
            {screen === "objects" && <ObjectsList />}
            {screen === "research" && <ListResearch />}
            {screen === "notes" && <NotesList />}
            {screen === "timeline" && <EventsList />}
            {screen === "chapters" && <ChapterList />}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  content: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
});
