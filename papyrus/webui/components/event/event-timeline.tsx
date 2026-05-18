/* eslint-disable no-unused-vars */
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";

import { parseZonedDateTime } from "@internationalized/date";
import {
  AlertCircle,
  AlertTriangle,
  Bolt,
  Calendar,
  Circle,
  Edit3,
  FileText,
  MapPin,
  Trash2,
} from "lucide-react-native";
import { EventDto } from "../../../packages/src/dtos/event.dto";
import { queryKeys } from "../../../packages/src/query-client";

import { client } from "../../utils/clients/client";
import { useProject } from "../../context/project-context";

import { Timeline } from "../ui/timeline/timeline";
import { TimelineContent } from "../ui/timeline/timeline-content";
import { TimelineDot } from "../ui/timeline/timeline-dot";
import { TimelineItem } from "../ui/timeline/timeline-item";

import { format } from "../../utils/date/date-utils";

function getStatusIcon(status: "critical" | "important" | "action" | "normal" | null) {
  switch (status) {
    case "critical":
      return {
        icon: <AlertTriangle size={20} color="#991b1b" />,
        color: "#fecaca",
      };

    case "important":
      return {
        icon: <AlertCircle size={20} color="#9a3412" />,
        color: "#fed7aa",
      };

    case "action":
      return {
        icon: <Bolt size={20} color="#1e40af" />,
        color: "#bfdbfe",
      };

    case "normal":
      return {
        icon: <Circle size={20} color="#166534" />,
        color: "#bbf7d0",
      };

    default:
      return {
        icon: <FileText size={20} color="#374151" />,
        color: "#e5e7eb",
      };
  }
}

type Props = {
  setSelectedEvent: (event: EventDto | undefined) => void;
  setUpdating: (isUpdating: boolean) => void;
  setDeleting: (isDeleting: boolean) => void;
};

export function EventTimeline({ setSelectedEvent, setUpdating, setDeleting }: Props) {
  const { currentProject } = useProject();

  const eventTimeline = client.event.getAll.useQuery({
    queryKey: queryKeys.event.getAll(),
    queryData: {
      params: {
        projectId: currentProject?.id ?? "",
      },
    },
  });

  function renderContent(currentEvent: EventDto) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 4,
        }}>
        <View
          style={{
            flex: 1,
            gap: 8,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
            }}>
            {currentEvent.title}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: "#6b7280",
            }}>
            {currentEvent.description}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}>
            <MapPin size={14} color="#6b7280" />

            <Text
              style={{
                fontSize: 12,
                color: "#6b7280",
              }}>
              {currentEvent.location}
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: "flex-end",
            gap: 8,
            marginLeft: 12,
          }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}>
            <Calendar size={14} color="#6b7280" />

            <Text
              style={{
                fontSize: 12,
                color: "#6b7280",
              }}>
              {format(parseZonedDateTime(currentEvent.eventDate), "dd MMMM yyyy")}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 12,
            }}>
            <TouchableOpacity
              onPress={() => {
                setUpdating(true);
              }}>
              <Edit3 size={18} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setDeleting(true);
              }}>
              <Trash2 size={18} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
      }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 16,
        }}>
        Ligne temporelle
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Timeline>
          {eventTimeline.data?.body.data.map((event, index, array) => {
            const isLast = index === array.length - 1;

            return (
              <TimelineItem
                key={event.eventDate}
                style={{
                  padding: 4,
                }}>
                <TimelineDot
                  isLast={isLast}
                  style={{
                    backgroundColor: getStatusIcon(event.importance).color,
                  }}>
                  {getStatusIcon(event.importance).icon}
                </TimelineDot>

                <TimelineContent
                  style={{
                    flex: 1,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedEvent(event);
                    }}
                    style={{
                      width: "100%",
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: index === 0 ? "#60a5fa" : "#d1d5db",
                      backgroundColor: index === 0 ? "#dbeafe" : "rgba(255,255,255,0.9)",
                    }}>
                    {renderContent(event)}
                  </TouchableOpacity>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </ScrollView>
    </View>
  );
}
