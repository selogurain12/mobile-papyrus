import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PencilLine, Trash2 } from "lucide-react-native";
import { ProjectDto } from "../../../packages/src/dtos/project.dto";
import { useProject } from "../../context/project-context";

interface ProjectCardProps {
  project: ProjectDto;
  onEdit: () => void;
  onDelete: () => void;
}

type NavProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { setCurrentProject } = useProject();
  const navigation = useNavigation<NavProp>();

  const progress = (100 * (project.currentWordCount ?? 0)) / (project.targetWordCount ?? 1);

  function statusColor(status?: string) {
    const baseStyle = {
      position: "absolute" as const,
      top: 10,
      right: 10,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      fontSize: 12,
      fontWeight: "600" as const,
    };

    switch (status) {
      case "planning":
        return (
          <Text style={{ ...baseStyle, backgroundColor: "#fef9c3", color: "#92400e" }}>
            Planification
          </Text>
        );
      case "writing":
        return (
          <Text style={{ ...baseStyle, backgroundColor: "#dbeafe", color: "#1e40af" }}>
            Écriture
          </Text>
        );
      case "editing":
        return (
          <Text style={{ ...baseStyle, backgroundColor: "#ede9fe", color: "#5b21b6" }}>
            Édition
          </Text>
        );
      case "completed":
        return (
          <Text style={{ ...baseStyle, backgroundColor: "#dcfce7", color: "#166534" }}>
            Terminé
          </Text>
        );
    }
  }

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 12,
        width: "48%",
      }}>
      <View style={{ height: 180, position: "relative" }}>
        <Image
          source={{
            uri: "https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=754&fit=clip",
          }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />

        {statusColor(project.status)}

        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            padding: 12,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{project.title}</Text>
          <Text style={{ color: "#ddd" }}>{project.genre}</Text>
        </View>
      </View>

      <View style={{ padding: 12 }}>
        <Text style={{ color: "#555", marginBottom: 10 }}>{project.description}</Text>

        <View style={{ marginBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 4,
            }}>
            <Text style={{ fontSize: 12, color: "#666" }}>Progression</Text>
            <Text style={{ fontSize: 12, color: "#666" }}>{Math.round(progress)}%</Text>
          </View>

          <View
            style={{
              height: 6,
              backgroundColor: "#e5e7eb",
              borderRadius: 999,
              overflow: "hidden",
            }}>
            <View
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#3b82f6",
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 4,
            }}>
            <Text style={{ fontSize: 10, color: "#888" }}>
              {project.currentWordCount ?? 0} mots
            </Text>
            <Text style={{ fontSize: 10, color: "#888" }}>
              {project.targetWordCount ?? 0} objectif
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={onEdit}>
            <PencilLine size={18} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete}>
            <Trash2 size={18} color="#DC2626" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setCurrentProject(project);
              navigation.navigate("Project", { name: project.title });
            }}
            style={{
              backgroundColor: "#3b82f6",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 10,
            }}>
            <Text style={{ color: "white", fontSize: 12 }}>Ouvrir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
