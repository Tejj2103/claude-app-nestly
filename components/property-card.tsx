import Octicons from "@expo/vector-icons/Octicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { useFavoritesStore } from "@/lib/store/favorites-store";
import type { Property } from "@/lib/data/types";

const STATUS_LABEL: Record<Exclude<Property["status"], "available">, string> = {
  sold: "Sold",
  rented: "Rented",
  hold: "On Hold",
};

export function PropertyCard({ home }: { home: Property }) {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(home.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <Pressable
      className="mt-6"
      onPress={() =>
        router.push({ pathname: "/property/[id]", params: { id: home.id } })
      }
    >
      <View className="h-[200] w-full overflow-hidden rounded-3xl">
        <Image
          source={{ uri: home.imageUrl }}
          style={{ width: "100%", height: 200 }}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          className="absolute bottom-0 left-0 right-0 h-32"
        />

        {home.status !== "available" && (
          <View className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1">
            <Text className="text-xs font-sans-bold text-white">
              {STATUS_LABEL[home.status]}
            </Text>
          </View>
        )}

        <Pressable
          className="absolute right-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-white"
          onPress={(event) => {
            event.stopPropagation();
            toggleFavorite(home.id);
          }}
        >
          <Octicons
            name={isFavorite ? "heart-fill" : "heart"}
            size={18}
            color={isFavorite ? "#723bff" : "#0b1220"}
          />
        </Pressable>

        <View className="absolute bottom-5 left-5 right-5">
          <Text className="text-2xl font-sans-bold text-white">{home.title}</Text>
          <Text className="mt-1 text-white/80">{home.location}</Text>
        </View>
      </View>
    </Pressable>
  );
}
