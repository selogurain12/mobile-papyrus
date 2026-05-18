import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";

import { ProjectProvider } from "context/project-context";
import { queryClient } from "./context/query-client";
import { ToastProvider } from "./components/ui/toast";
import { AuthProvider } from "./context/auth-context";
import { LoginScreen } from "./components/authentification/login";
import { ProjectPage } from "./screens/project";
import { RegisterScreen } from "./components/authentification/register";
import { HomeProject } from "./components/home-project";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Project: { name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={ProjectPage} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Project" component={HomeProject} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProjectProvider>
          <ToastProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <RootStack />
              </NavigationContainer>
            </SafeAreaProvider>
          </ToastProvider>
        </ProjectProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
