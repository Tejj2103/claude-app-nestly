import { Tabs } from "expo-router";
import clsx from "clsx";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import { Image, View } from "react-native";

export const tabs: AppTab[] = [
  { name: "index", title: "Home", icon: icons.home },
  { name: "search", title: "Search", icon: icons.search },
  { name: "favorites", title: "Favorites", icon: icons.heart },
  { name: "profile", title: "Profile", icon: icons.user },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  const TabIcon = ({ focused, icon }: TabIconProps) => {
    return (
      <View className="tabs-icon">
        <View className={clsx("tabs-pill", focused && "tabs-active")}>
          <Image
            source={icon}
            className="tabs-glyph"
            resizeMode="contain"
            style={{ width: 24, height: 24 }}
          />
        </View>
      </View>
    );
  };
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, 20),
          height: 72,
          marginHorizontal: 20,
          borderRadius: 32,
          backgroundColor: "#f7f7f7",
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
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
