import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import Octicons from "@expo/vector-icons/Octicons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "@/constants/theme";

const SafeAreaView = styled(RNSafeAreaView);

export default function Home() {
  const filters = ["All", "Apartment", "Houses", "Retail", "Lease"];

  const [active, setActive] = useState("All");

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F2] p-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-4xl font-sans-bold text-primary">Nestly</Text>
        <View className="relative">
          <Pressable
            className="rounded-full bg-white p-4"
            onPress={() => alert("Notifications")}
          >
            <Octicons name="bell" size={28} color={colors.primary} />
          </Pressable>
          <View className="absolute -right-1 -top-1 min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1">
            <Text className="text-[10px] font-bold text-white">3</Text>
          </View>
        </View>
      </View>
      <View className="mt-6">
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center rounded-full bg-white px-4">
            <Octicons name="search" size={20} color={colors.primary} />
            <TextInput
              className="ml-3 flex-1 py-4 text-primary"
              placeholder="Search properties..."
              placeholderTextColor="#b7b7b8"
            />
          </View>
          <Pressable className="rounded-full bg-white p-4">
            <Octicons name="filter" size={24} color={colors.primary} />
          </Pressable>
        </View>
        <FlatList
          className="mt-6"
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item}
          ItemSeparatorComponent={() => <View className="w-3" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setActive(item);
                router.push({
                  pathname: "/search",
                  params: {
                    category: item,
                  },
                });
              }}
              className={`rounded-full px-6 py-4 ${
                active === item ? "bg-accent" : "bg-white"
              }`}
            >
              <Text
                className={`text-m font-sans-medium ${
                  active === item ? "text-white" : "text-primary"
                }`}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>
      <View className="mt-6">
        <View className="h-[200] w-full overflow-hidden rounded-3xl">
          <Image
            source={{
              uri: "https://images.pexels.com/photos/1488267/pexels-photo-1488267.png",
            }}
            style={{ width: "100%", height: 200 }}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            className="absolute bottom-0 left-0 right-0 h-32"
          />

          <View className="absolute bottom-5 left-5 right-5">
            <Text className="text-2xl font-sans-bold text-white">
              Modern Apartment
            </Text>

            <Text className="mt-1 text-white/80">Pune, Maharashtra</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
