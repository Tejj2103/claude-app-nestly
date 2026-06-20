import Octicons from "@expo/vector-icons/Octicons";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

import { PropertyCard } from "@/components/property-card";
import { colors } from "@/constants/theme";
import { useFavoritesStore } from "@/lib/store/favorites-store";

const SafeAreaView = styled(RNSafeAreaView);

export default function Favorites() {
  const favorites = useFavoritesStore((state) => state.favoriteProperties);
  const isLoading = useFavoritesStore((state) => state.isLoading);

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F2]">
      <FlatList
        className="px-5"
        data={favorites}
        keyExtractor={(home) => home.id}
        renderItem={({ item }) => <PropertyCard home={item} />}
        ListHeaderComponent={
          <Text className="pt-5 text-3xl font-sans-bold text-primary">Favorites</Text>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator className="mt-20" color={colors.accent} />
          ) : (
            <View className="mt-20 items-center gap-3">
              <Octicons name="heart" size={32} color="#b7b7b8" />
              <Text className="text-primary/60">
                Tap the heart on a property to save it here.
              </Text>
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
