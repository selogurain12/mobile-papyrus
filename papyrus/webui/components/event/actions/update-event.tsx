import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { isFetchError } from "@ts-rest/react-query/v5";

import { DatePicker } from "components/ui/date-picker";

import {
  updateEventSchema,
  UpdateEventDto,
  EventDto,
} from "../../../../packages/src/dtos/event.dto";

import { useProject } from "../../../context/project-context";

import { client } from "../../../utils/clients/client";

import { queryClient } from "../../../context/query-client";

import { useToast } from "../../ui/toast";
import { styles } from "../../../utils/style/form-style";

interface UpdateEventProps {
  event: EventDto;

  onCancel?: () => void;
}

const importanceOptions = [
  {
    label: "Critique",
    value: "critical",
  },
  {
    label: "Important",
    value: "important",
  },
  {
    label: "Action",
    value: "action",
  },
  {
    label: "Normal",
    value: "normal",
  },
];

export function UpdateEvent({ event, onCancel }: UpdateEventProps) {
  const { showToast } = useToast();

  const { currentProject } = useProject();

  const form = useForm({
    resolver: zodResolver(updateEventSchema),

    defaultValues: {
      title: event.title,
      description: event.description,
      importance: event.importance,
      location: event.location,
      additionalDetails: event.additionalDetails,
      eventDate: event.eventDate,
    },
  });

  const { mutate } = client.event.update.useMutation({
    onSuccess: () => {
      showToast("Evenement mis à jour!", 3000, "success");

      void queryClient.invalidateQueries({
        queryKey: ["event.getAll"],
      });

      form.reset();

      onCancel?.();
    },

    onError: (error) => {
      if (isFetchError(error)) {
        showToast(error.message, 3000, "error");
      } else {
        showToast("Une erreur est survenue", 3000, "error");
      }
    },
  });

  if (!currentProject) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  function handleSubmit(data: UpdateEventDto) {
    if (!currentProject) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
    mutate({
      body: data,

      params: {
        projectId: currentProject.id,
        id: event.id,
      },
    });
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Modifier l'événement</Text>

      <Text style={styles.label}>Titre de l'événement</Text>

      <Controller
        control={form.control}
        name="title"
        render={({ field }) => (
          <TextInput
            value={field.value ?? ""}
            onChangeText={field.onChange}
            placeholder="Titre"
            style={styles.input}
          />
        )}
      />

      <Text style={styles.label}>Date</Text>

      <Controller
        control={form.control}
        name="eventDate"
        render={({ field }) => <DatePicker setValue={field.onChange} value={field.value} />}
      />

      <Text style={styles.label}>Type d'événement</Text>

      <Controller
        control={form.control}
        name="importance"
        render={({ field }) => (
          <View style={styles.tagsImportanceContainer}>
            {importanceOptions.map((item) => {
              const selected = field.value === item.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => {
                    field.onChange(item.value);
                  }}
                  style={[styles.tagImportance, selected && styles.tagImportanceActive]}>
                  <Text
                    style={[styles.tagImportanceText, selected && styles.tagImportanceTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />

      <Text style={styles.label}>Description</Text>

      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <TextInput
            multiline
            value={field.value ?? ""}
            onChangeText={(value) => {
              field.onChange(value || null);
            }}
            placeholder="Description"
            textAlignVertical="top"
            style={[styles.input, styles.textarea]}
          />
        )}
      />

      <Text style={styles.label}>Lieu</Text>

      <Controller
        control={form.control}
        name="location"
        render={({ field }) => (
          <TextInput
            value={field.value ?? ""}
            onChangeText={(value) => {
              field.onChange(value || null);
            }}
            placeholder="Lieu"
            style={styles.input}
          />
        )}
      />

      <Text style={styles.label}>Détails supplémentaires</Text>

      <Controller
        control={form.control}
        name="additionalDetails"
        render={({ field }) => (
          <TextInput
            multiline
            value={field.value ?? ""}
            onChangeText={(value) => {
              field.onChange(value || null);
            }}
            placeholder="Détails supplémentaires"
            textAlignVertical="top"
            style={[styles.input, styles.textarea]}
          />
        )}
      />

      <TouchableOpacity
        onPress={() => {
          form.reset();

          onCancel?.();
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>Annuler</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          void form.handleSubmit(handleSubmit)();
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>Modifier l'événement</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
