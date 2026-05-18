import { View, FlatList, Modal, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { ProjectDto } from "../../../packages/src/dtos/project.dto";
import { queryKeys } from "../../../packages/src/query-client";
import { useToast } from "../ui/toast";
import { useAuth } from "../../context/auth-context";
import { client } from "../../utils/clients/client";
import { ProjectCard } from "./project-card";
import { UpdateProjectForm } from "./actions/update-form";
import { ProjectDeleteActions } from "./actions/delete-form";

export function ListProject() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null);

  if (!user) {
    showToast("Utilisateur non connecté", 2000, "error");
    return null;
  }

  const { data } = client.project.getAll.useQuery({
    queryKey: queryKeys.project.getAll({
      pathParams: { userId: user.id },
    }),
    queryData: {
      params: { userId: user.id },
    },
  });

  const projects = data?.body.data ?? [];

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onEdit={() => {
              setSelectedProject(item);
              setOpenEdit(true);
            }}
            onDelete={() => {
              setSelectedProject(item);
              setOpenDelete(true);
            }}
          />
        )}
      />

      <Modal
        visible={openEdit}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setOpenEdit(false);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}>
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingVertical: 24,
              paddingHorizontal: 20,
              maxHeight: "85%",
            }}>
            <TouchableOpacity
              onPress={() => {
                setOpenEdit(false);
              }}>
              <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>✕</Text>
            </TouchableOpacity>
            {selectedProject && (
              <UpdateProjectForm
                key={selectedProject.id}
                project={selectedProject}
                setOpen={setOpenEdit}
              />
            )}
          </View>
        </View>
      </Modal>

      {selectedProject && (
        <ProjectDeleteActions
          key={selectedProject.id}
          project={selectedProject}
          setOpen={setOpenDelete}
          open={openDelete}
        />
      )}
    </View>
  );
}
