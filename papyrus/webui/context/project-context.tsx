import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProjectDto } from "../../packages/src/dtos/project.dto";

type ProjectContextType = {
  currentProject: ProjectDto | null;
  setCurrentProject: (project: ProjectDto | null) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY = "current_project";

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [currentProject, setCurrentProjectState] = useState<ProjectDto | null>(null);

  // 🔄 Load persisted project on mount
  useEffect(() => {
    const loadProject = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as ProjectDto;
          setCurrentProjectState(parsed);
        }
      } catch (e) {
        console.error("Failed to load current_project", e);
      }
    };

    void loadProject();
  }, []);

  // 💾 Persist project
  const setCurrentProject = async (project: ProjectDto | null) => {
    try {
      if (project) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to persist current_project", e);
    }

    setCurrentProjectState(project);
  };

  return (
    <ProjectContext.Provider value={{ currentProject, setCurrentProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
