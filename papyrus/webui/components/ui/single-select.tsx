import {
  View,
  Text,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useMemo, useState } from "react";
import { X } from "lucide-react-native";

type Option = {
  id: string;
  label: string;
};

interface SingleSelectorProps<OptionType extends Option> {
  value?: OptionType;
  data: OptionType[];

  placeholder?: string;
  onChange?: (value?: OptionType) => void;

  loading?: boolean;
}

export function SingleSelector<OptionType extends Option>({
  value,
  data,
  placeholder = "Sélectionner",
  onChange,
  loading,
}: SingleSelectorProps<OptionType>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
  }, [search, data]);

  const handleSelect = (item: OptionType) => {
    onChange?.(item);
    setOpen(false);
    setSearch("");
  };

  const clear = () => {
    onChange?.(undefined);
  };

  return (
    <View style={{ marginBottom: 15 }}>
      {/* BUTTON */}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => {
          setOpen(true);
        }}>
        <Text style={value ? styles.valueText : styles.placeholder}>
          {value?.label ?? placeholder}
        </Text>

        {value ? (
          <TouchableOpacity onPress={clear}>
            <X size={18} />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={open} animationType="slide">
        <View style={styles.modal}>
          {/* HEADER */}
          <View style={styles.header}>
            <TextInput
              placeholder="Rechercher..."
              value={search}
              onChangeText={setSearch}
              style={styles.input}
            />

            <TouchableOpacity
              onPress={() => {
                setOpen(false);
              }}>
              <Text style={{ fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* LIST */}
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    handleSelect(item);
                  }}>
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeholder: {
    color: "#999",
  },
  valueText: {
    color: "#111",
    fontWeight: "500",
  },
  modal: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
  },
  item: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
