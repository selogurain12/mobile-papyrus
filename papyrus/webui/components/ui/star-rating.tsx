import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

type Props = {
  value: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: number) => void;
  max?: number;
};

export function StarRating({ value, onChange, max = 5 }: Props) {
  return (
    <View style={{ flexDirection: "row", gap: 6, marginBottom: 12 }}>
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const active = starValue <= value;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              onChange(starValue);
            }}>
            <Text style={{ fontSize: 26, color: active ? "#facc15" : "#d1d5db" }}>★</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
