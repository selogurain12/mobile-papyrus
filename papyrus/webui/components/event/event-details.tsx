import { View, Text } from "react-native";
import React from "react";

import { MapPin, Calendar } from "lucide-react-native";

import { parseZonedDateTime } from "@internationalized/date";
import { EventDto } from "../../../packages/src/dtos/event.dto";

import { format } from "../../utils/date/date-utils";

interface EventDetailProps {
  event: EventDto | undefined;
}

export function EventDetail({ event }: EventDetailProps) {
  const importanceMap: Record<string, string> = {
    critical: "Critique",
    important: "Importante",
    action: "Action",
    normal: "Normale",
  };

  const importanceColorMap: Record<string, string> = {
    critical: "#fecaca",
    important: "#fed7aa",
    action: "#bfdbfe",
    normal: "#bbf7d0",
  };

  const importanceTextColorMap: Record<string, string> = {
    critical: "#991b1b",
    important: "#9a3412",
    action: "#1e40af",
    normal: "#166534",
  };

  if (!event) {
    return (
      <View
        style={{
          borderRadius: 16,
          padding: 24,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}>
        <MapPin size={64} color="#d1d5db" />

        <Text
          style={{
            marginTop: 12,
            fontSize: 16,
            color: "#4b5563",
            fontWeight: "500",
          }}>
          Sélectionnez un évènement
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 14,
            color: "#9ca3af",
            textAlign: "center",
          }}>
          Choisissez un évènement dans la liste pour voir ses détails
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        borderRadius: 16,
        padding: 24,
        width: "100%",
        backgroundColor: "white",
        gap: 32,
      }}>
      <View
        style={{
          gap: 8,
        }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}>
          <Text
            style={{
              flex: 1,
              fontSize: 24,
              fontWeight: "600",
              color: "#111827",
            }}>
            {event.title}
          </Text>

          {event.importance && (
            <View
              style={{
                backgroundColor: importanceColorMap[event.importance],
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
              }}>
              <Text
                style={{
                  color: importanceTextColorMap[event.importance],
                  fontSize: 12,
                  fontWeight: "600",
                }}>
                {importanceMap[event.importance]}
              </Text>
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}>
          <Calendar size={16} color="#6b7280" />

          <Text
            style={{
              fontSize: 14,
              color: "#6b7280",
            }}>
            {format(parseZonedDateTime(event.eventDate), "dd MMMM yyyy")}
          </Text>
        </View>
      </View>

      <View
        style={{
          gap: 4,
        }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#6b7280",
          }}>
          Description
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#111827",
            lineHeight: 22,
          }}>
          {event.description ?? "—"}
        </Text>
      </View>

      <View
        style={{
          gap: 4,
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}>
          <MapPin size={18} color="#6b7280" />

          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#6b7280",
            }}>
            Lieu
          </Text>
        </View>

        <Text
          style={{
            fontSize: 14,
            color: "#111827",
            lineHeight: 22,
          }}>
          {event.location ?? "—"}
        </Text>
      </View>

      <View
        style={{
          gap: 4,
        }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#6b7280",
          }}>
          Notes supplémentaires
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#111827",
            lineHeight: 22,
          }}>
          {event.additionalDetails ?? "—"}
        </Text>
      </View>
    </View>
  );
}
