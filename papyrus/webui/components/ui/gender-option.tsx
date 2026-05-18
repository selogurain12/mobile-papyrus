import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  value: string;
  selected: boolean;
  onPress: () => void;
};

export function GenderOption({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: selected ? "#111827" : "#d1d5db",
        backgroundColor: selected ? "#111827" : "transparent",
      }}>
      <Text
        style={{
          color: selected ? "#fff" : "#111827",
          fontWeight: "500",
        }}>
        {label}
      </Text>
    </Pressable>
  );
}
