import { Tabs } from "expo-router";
import { colors } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Octicons from "@expo/vector-icons/Octicons";

export const tabs: AppTab[] = [
  { name: "index", title: "Home" },
  { name: "favorites", title: "Favorites" },
  { name: "profile", title: "Profile" },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.accent,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, 20),
          height: 72,
          paddingBottom: 0,
          marginHorizontal: 20,
          borderRadius: 32,
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 72 / 2 - 48 / 1.6,
        },
        tabBarIconStyle: {
          width: 48,
          height: 48,
          alignItems: "center",
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color }) => (
              <Octicons
                name={
                  tab.name === "index"
                    ? focused
                      ? "home-fill"
                      : "home"
                    : tab.name === "favorites"
                      ? focused
                        ? "heart-fill"
                        : "heart"
                      : focused
                        ? "person-fill"
                        : "person"
                }
                size={28}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
