import Octicons from "@expo/vector-icons/Octicons";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

import { colors } from "@/constants/theme";
import { useHome } from "@/lib/data/properties";
import { useFavoritesStore } from "@/lib/store/favorites-store";

const SafeAreaView = styled(RNSafeAreaView);

const NA = "N/A";

function formatPrice(price: number | null | undefined, isLease: boolean) {
  if (price == null) return NA;
  const formatted = `₹${price.toLocaleString("en-IN")}`;
  return isLease ? `${formatted}/mo` : formatted;
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Octicons.glyphMap;
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <View className="w-1/2 flex-row items-center gap-3 py-3">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
        <Octicons name={icon} size={16} color={colors.primary} />
      </View>
      <View>
        <Text className="text-xs text-primary/60">{label}</Text>
        <Text className="font-sans-semibold text-primary">
          {value == null || value === "" ? NA : value}
        </Text>
      </View>
    </View>
  );
}

export default function PropertyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: home, isLoading, error } = useHome(id);
  const isFavorite = useFavoritesStore((state) => (id ? state.isFavorite(id) : false));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    );
  }

  if (error || !home) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-background px-5">
        <Text className="text-lg font-sans-semibold text-primary">
          {error ? `Couldn't load that property: ${error}` : "We couldn't find that property."}
        </Text>
        <Pressable className="rounded-full bg-accent px-6 py-3" onPress={() => router.back()}>
          <Text className="font-sans-medium text-white">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="h-80 w-full">
          {home.imageUrl ? (
            <Image source={{ uri: home.imageUrl }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <View className="h-full w-full items-center justify-center bg-secondary/30">
              <Octicons name="image" size={32} color={colors.primary} />
            </View>
          )}
          <Pressable
            className="absolute left-5 top-5 h-11 w-11 items-center justify-center rounded-full bg-white"
            onPress={() => router.back()}
          >
            <Octicons name="chevron-left" size={22} color={colors.primary} />
          </Pressable>
          <Pressable
            className="absolute right-5 top-5 h-11 w-11 items-center justify-center rounded-full bg-white"
            onPress={() => toggleFavorite(home.id)}
          >
            <Octicons
              name={isFavorite ? "heart-fill" : "heart"}
              size={20}
              color={isFavorite ? "#723bff" : colors.primary}
            />
          </Pressable>
        </View>

        <View className="gap-4 px-5 pt-6">
          <View className="flex-row items-center gap-2">
            <View className="self-start rounded-full bg-secondary px-3 py-1">
              <Text className="text-xs font-sans-medium text-primary">{home.category ?? NA}</Text>
            </View>
            {home.badge && (
              <View className="self-start rounded-full bg-accent/10 px-3 py-1">
                <Text className="text-xs font-sans-medium text-accent">{home.badge}</Text>
              </View>
            )}
          </View>

          <Text className="text-2xl font-sans-bold text-primary">{home.title || NA}</Text>

          <View className="flex-row items-center gap-2">
            <Octicons name="location" size={16} color={colors.primary} />
            <Text className="font-sans-medium text-primary/70">{home.location || NA}</Text>
          </View>

          <Text className="text-xl font-sans-bold text-accent">
            {formatPrice(home.price, home.category === "Lease")}
          </Text>

          <View className="mt-2 flex-row flex-wrap rounded-2xl bg-secondary/20 px-4">
            <Stat
              icon="home"
              label="Bedrooms"
              value={home.bedrooms != null ? `${home.bedrooms} Bed` : null}
            />
            <Stat
              icon="checklist"
              label="Bathrooms"
              value={home.bathrooms != null ? `${home.bathrooms} Bath` : null}
            />
            <Stat
              icon="square"
              label="Area"
              value={home.areaSqm != null ? `${home.areaSqm} m²` : null}
            />
            <Stat icon="zap" label="Parking" value={home.parking} />
            <Stat icon="paintbrush" label="Furnished" value={home.furnished} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
