import Octicons from "@expo/vector-icons/Octicons";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

import { colors } from "@/constants/theme";
import { useHome } from "@/lib/data/properties";
import { useFavoritesStore } from "@/lib/store/favorites-store";

const SafeAreaView = styled(RNSafeAreaView);

function formatPrice(price: number, isLease: boolean) {
  const formatted = `₹${price.toLocaleString("en-IN")}`;
  return isLease ? `${formatted}/mo` : formatted;
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
        <Pressable
          className="rounded-full bg-accent px-6 py-3"
          onPress={() => router.back()}
        >
          <Text className="font-sans-medium text-white">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="h-80 w-full">
          <Image
            source={{ uri: home.imageUrl }}
            style={{ width: "100%", height: "100%" }}
          />
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
          <View className="self-start rounded-full bg-secondary px-3 py-1">
            <Text className="text-xs font-sans-medium text-primary">{home.category}</Text>
          </View>

          <Text className="text-2xl font-sans-bold text-primary">{home.title}</Text>

          <View className="flex-row items-center gap-2">
            <Octicons name="location" size={16} color={colors.primary} />
            <Text className="font-sans-medium text-primary/70">{home.location}</Text>
          </View>

          <Text className="text-xl font-sans-bold text-accent">
            {formatPrice(home.price, home.category === "Lease")}
          </Text>

          {(home.bedrooms || home.areaSqm || home.parking) && (
            <View className="mt-2 flex-row items-center gap-6 rounded-2xl bg-secondary/20 px-4 py-4">
              {home.bedrooms && (
                <View className="items-center gap-1">
                  <Octicons name="home" size={18} color={colors.primary} />
                  <Text className="text-sm font-sans-medium text-primary">
                    {home.bedrooms} Bed
                  </Text>
                </View>
              )}
              {home.areaSqm && (
                <View className="items-center gap-1">
                  <Octicons name="square" size={18} color={colors.primary} />
                  <Text className="text-sm font-sans-medium text-primary">
                    {home.areaSqm} m²
                  </Text>
                </View>
              )}
              {home.parking && (
                <View className="items-center gap-1">
                  <Octicons name="zap" size={18} color={colors.primary} />
                  <Text className="text-sm font-sans-medium text-primary">{home.parking}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
