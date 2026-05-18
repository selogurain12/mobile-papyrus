import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";

type Props = {
  label?: string;
  placeholder?: string;

  values: string[];

  // eslint-disable-next-line no-unused-vars
  onChange: (values: string[]) => void;

  addButtonColor?: string;

  tagBackgroundColor?: string;
  tagTextColor?: string;
};

export function TagInput({
  label,
  placeholder = "Ajouter un tag",
  values,
  onChange,
  addButtonColor = "#2563EB",
  tagBackgroundColor = "#DBEAFE",
  tagTextColor = "#1D4ED8",
}: Props) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const value = input.trim();

    if (!value) return;

    onChange([...values, value]);

    setInput("");
  };

  const removeTag = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.flex]}
          placeholder={placeholder}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addTag}
        />

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: addButtonColor }]}
          onPress={addTag}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tagsContainer}>
        {values.map((tag, index) => (
          <View
            key={`${tag}-${index}`}
            style={[
              styles.tag,
              {
                backgroundColor: tagBackgroundColor,
              },
            ]}>
            <Text
              style={{
                color: tagTextColor,
              }}>
              {tag}
            </Text>

            <TouchableOpacity
              onPress={() => {
                removeTag(index);
              }}>
              <Text
                style={{
                  color: tagTextColor,
                  fontWeight: "700",
                }}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    marginTop: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  flex: {
    flex: 1,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
});
