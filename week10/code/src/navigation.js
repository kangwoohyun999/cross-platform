import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import UserContext from "./UserContext";
import {
  LoginScreen, ProfileScreen, PortfolioScreen, BlogScreen, ContactScreen, DetailScreen,
} from "./screens";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TABS = [
  { name: "Profile", title: "프로필", component: ProfileScreen },
  { name: "Portfolio", title: "포트폴리오", component: PortfolioScreen },
  { name: "Blog", title: "블로그", component: BlogScreen },
  { name: "Contact", title: "연락처", component: ContactScreen },
];

// ------------------------ //
//   Tab: 현재 탭 = green_b.png / 나머지 = red_b.png
// ------------------------ //
const green = require("../assets/green_b.png");
const red = require("../assets/red_b.png");

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false, // Drawer 헤더와 겹치지 않게
      tabBarIcon: ({ focused }) => (
        <Image source={focused ? green : red} style={{ width: 26, height: 26, borderRadius: 13 }} />
      ),
      tabBarActiveTintColor: "#16A34A",
      tabBarInactiveTintColor: "gray",
      tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
      tabBarHideOnKeyboard: true,
    }}
  >
    {TABS.map((t) => (
      <Tab.Screen key={t.name} name={t.name} component={t.component} options={{ title: t.title }} />
    ))}
  </Tab.Navigator>
);

// ------------------------ //
//   Drawer: 왼쪽 위 ☰(ㅡ 세 줄) 누르면 좌측에서 열림
// ------------------------ //
const MenuButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={s.menuBtn} hitSlop={10}>
    {[0, 1, 2].map((i) => <View key={i} style={s.line} />)}
  </TouchableOpacity>
);

const DrawerContent = (props) => {
  const { user, logout } = useContext(UserContext);
  return (
    <DrawerContentScrollView {...props}>
      <View style={s.drawerHeader}>
        <Text style={s.drawerName}>👤 {user?.name}</Text>
        <Text style={{ color: "#6B7280", marginTop: 4 }}>{user?.studentId}</Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity style={s.logoutBtn} onPress={logout}>
        <Text style={s.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const MainDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <DrawerContent {...props} />}
    screenOptions={({ navigation }) => ({
      headerTitleAlign: "center",
      headerLeft: () => <MenuButton onPress={() => navigation.toggleDrawer()} />,
      drawerType: "front",
      drawerActiveTintColor: "#2563EB",
      drawerInactiveTintColor: "gray",
      overlayColor: "rgba(0,0,0,0.5)",
      drawerStyle: { width: 240 },
    })}
  >
    <Drawer.Screen
      name="Home"
      component={MainTabs}
      options={({ route }) => {
        // 현재 선택된 탭 이름을 헤더 제목으로 표시
        const current = getFocusedRouteNameFromRoute(route) ?? "Profile";
        return { drawerLabel: "🏠 홈 (탭)", headerTitle: TABS.find((t) => t.name === current).title };
      }}
    />
  </Drawer.Navigator>
);

// ------------------------ //
//   Stack (최상위): 로그인 전 Login / 로그인 후 Main + Detail
// ------------------------ //
export const RootStack = () => {
  const { user } = useContext(UserContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#2563EB" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontSize: 20, fontWeight: "bold" },
        headerTitleAlign: "center",
        animation: "slide_from_right",
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainDrawer} options={{ headerShown: false }} />
          <Stack.Screen name="Detail" component={DetailScreen}
            options={({ route }) => ({ title: route.params?.title ?? "상세" })} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

const s = StyleSheet.create({
  menuBtn: { marginLeft: 16, width: 26, height: 20, justifyContent: "space-between" },
  line: { height: 3, borderRadius: 2, backgroundColor: "#0F172A" },
  drawerHeader: { padding: 16, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: "#E5E7EB", marginBottom: 8 },
  drawerName: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
  logoutBtn: { margin: 16, padding: 12, borderRadius: 8, backgroundColor: "#E53935", alignItems: "center" },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
