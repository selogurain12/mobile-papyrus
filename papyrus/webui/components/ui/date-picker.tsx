import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import React, { useEffect, useState } from "react";

import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

import { fromDate, getLocalTimeZone, parseZonedDateTime } from "@internationalized/date";

interface DatePickerProps {
  value?: string | null;
  // eslint-disable-next-line no-unused-vars
  setValue: (date: string | null) => void;
  placeholder?: string;
}

export function DatePicker({
  value,
  setValue,
  placeholder = "Sélectionner une date",
}: DatePickerProps) {
  function parseDate(dateValue?: string | null): Date | null {
    if (!dateValue) {
      return null;
    }

    try {
      return parseZonedDateTime(dateValue).toDate();
    } catch {
      return new Date(dateValue);
    }
  }

  const parsedDate = parseDate(value);

  const [open, setOpen] = useState(false);

  const [date, setDate] = useState<Date>(parsedDate ?? new Date());

  const [tempDate, setTempDate] = useState<Date>(parsedDate ?? new Date());

  useEffect(() => {
    const nextDate = parseDate(value);

    if (nextDate) {
      setDate(nextDate);
      setTempDate(nextDate);
    }
  }, [value]);

  function toZonedIso(date: Date): string {
    return fromDate(date, getLocalTimeZone()).toString();
  }

  function handleIOSChange(_: DateTimePickerEvent, selectedDate?: Date) {
    if (!selectedDate) {
      return;
    }

    setTempDate(selectedDate);
  }

  function handleAndroidChange(event: DateTimePickerEvent, selectedDate?: Date) {
    if (event.type === "dismissed") {
      setOpen(false);
      return;
    }

    if (!selectedDate) {
      return;
    }

    setDate(selectedDate);

    const zonedDate = toZonedIso(selectedDate);

    setValue(zonedDate);
    setOpen(false);
  }

  function handleConfirm() {
    setDate(tempDate);

    const zonedDate = toZonedIso(tempDate);

    setValue(zonedDate);
    setOpen(false);
  }

  function handleDismiss() {
    setOpen(false);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setTempDate(date);
          setOpen(true);
        }}
        style={styles.button}>
        <Text style={[styles.buttonText, !value && styles.placeholderText]}>
          {value
            ? date.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : placeholder}
        </Text>
      </TouchableOpacity>

      {Platform.OS === "ios" && (
        <Modal animationType="fade" onRequestClose={handleDismiss} transparent visible={open}>
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <DateTimePicker
                display="spinner"
                locale="fr-FR"
                mode="date"
                onChange={handleIOSChange}
                value={tempDate}
              />

              <View style={styles.actions}>
                <TouchableOpacity onPress={handleDismiss}>
                  <Text style={styles.cancelText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={styles.confirmText}>Confirmer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === "android" && open && (
        <DateTimePicker
          display="calendar"
          mode="date"
          onChange={handleAndroidChange}
          value={tempDate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  buttonText: {
    color: "#111827",
    fontSize: 16,
    lineHeight: 20,
  },
  placeholderText: {
    color: "#9ca3af",
  },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    flex: 1,
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 12,
  },
  cancelText: {
    color: "#6b7280",
    fontSize: 16,
  },
  confirmText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "600",
  },
});
