import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useNativeCssStyle, useNativeVariable } from "react-native-css";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const activeColor = useNativeVariable("--color-primary");
  const inactiveColor = useNativeVariable("--color-muted-foreground");
  const tabBarBaseStyle = useNativeCssStyle("bg-tab-bar rounded-tab-bar h-tab-bar mx-tab-bar-offset");
  const tabBarItemStyle = useNativeCssStyle("py-tab-item-y");
  const tabBarIconStyle = useNativeCssStyle("h-tab-icon w-tab-icon items-center");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          ...tabBarBaseStyle,
          position: "absolute",
          bottom: Math.max(insets.bottom, 20),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle,
        tabBarIconStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
