import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet } from "react-native";
import React, { useState } from "react";

import { Plus } from "lucide-react-native";

import { EventDto } from "../../../packages/src/dtos/event.dto";

import { EventDetail } from "./event-details";
import { CreateEvent } from "./actions/create-event";
import { UpdateEvent } from "./actions/update-event";
import { EventDeleteActions } from "./actions/delete-event";
import { EventTimeline } from "./event-timeline";

export function EventsList() {
  const [eventSelected, setEventSelected] = useState<EventDto | undefined>(undefined);

  const [isCreating, setIsCreating] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 24,
        paddingBottom: 80,
      }}
      showsVerticalScrollIndicator={false}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}>
        <View
          style={{
            flex: 1,
            marginRight: 12,
          }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: "#111827",
            }}>
            Chronologie
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#6b7280",
              marginTop: 4,
            }}>
            Gérez les événements de votre histoire
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setIsCreating(true);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#2563eb",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 12,
          }}>
          <Plus size={18} color="white" />

          <Text
            style={{
              color: "white",
              fontWeight: "600",
              marginLeft: 8,
            }}>
            Nouvel événement
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          gap: 24,
        }}>
        <EventTimeline
          setSelectedEvent={setEventSelected}
          setUpdating={setIsUpdating}
          setDeleting={setIsDeleting}
        />
        <View style={styles.details}>
          <EventDetail event={eventSelected} />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={isCreating}
        onRequestClose={() => {
          setIsCreating(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsCreating(false);
              }}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
            <CreateEvent
              onCancel={() => {
                setIsCreating(false);
              }}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={isUpdating}
        onRequestClose={() => {
          setIsUpdating(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsUpdating(false);
              }}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
            {eventSelected && (
              <UpdateEvent
                event={eventSelected}
                onCancel={() => {
                  setIsUpdating(false);
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      {isDeleting && eventSelected && (
        <EventDeleteActions
          event={eventSelected}
          open={isDeleting}
          setOpen={setIsDeleting}
          onClose={() => {
            setIsDeleting(false);
          }}
          clearSelection={() => {
            setEventSelected(undefined);
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContainer: {
    flex: 1,
    marginTop: 80,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },

  close: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  details: {
    flex: 1,
  },
});
