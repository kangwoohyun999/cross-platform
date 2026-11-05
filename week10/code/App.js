// ⚠️ gesture-handler는 반드시 최상단에서 import 해야 함 (Drawer 사용)
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./src/UserContext";
import { RootStack } from "./src/navigation";

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </UserProvider>
  );
}
