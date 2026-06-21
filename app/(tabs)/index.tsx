import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import Octicons from "@expo/vector-icons/Octicons";

import { DEFAULT_HOME_FILTERS, FilterModal } from "@/components/filter-modal";
import { PropertyCard } from "@/components/property-card";
import { colors } from "@/constants/theme";
import { useHomes } from "@/lib/data/properties";

const SafeAreaView = styled(RNSafeAreaView);

const FILTERS = ["All", "Apartment", "Houses", "Retail", "Lease"] as const;

function isDefaultFilters(filters: typeof DEFAULT_HOME_FILTERS) {
  return (
    filters.bhk === DEFAULT_HOME_FILTERS.bhk &&
    filters.furnished === DEFAULT_HOME_FILTERS.furnished &&
    filters.bathrooms === DEFAULT_HOME_FILTERS.bathrooms &&
    filters.minPrice === DEFAULT_HOME_FILTERS.minPrice &&
    filters.maxPrice === DEFAULT_HOME_FILTERS.maxPrice &&
    filters.sortBy === DEFAULT_HOME_FILTERS.sortBy &&
    filters.city === DEFAULT_HOME_FILTERS.city
  );
}

export default function Home() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [extraFilters, setExtraFilters] = useState(DEFAULT_HOME_FILTERS);
  const {
    data: homes,
    isLoading,
    isRefreshing,
    error,
    refetch,
  } = useHomes({ category: active, query, ...extraFilters });
  const hasActiveFilters = !isDefaultFilters(extraFilters);

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refetch}
            tintColor={colors.accent}
          />
        }
      >
        <View className="px-5 pt-5">
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
        </View>

        <View className="bg-[#F2F2F2] px-5 pb-3 pt-3">
          <View className="flex-row items-center gap-3">
            <View className="flex-1 flex-row items-center rounded-full bg-white px-4">
              <Octicons name="search" size={20} color={colors.primary} />
              <TextInput
                className="ml-3 flex-1 py-4 text-primary"
                placeholder="Search properties..."
                placeholderTextColor="#b7b7b8"
                value={query}
                onChangeText={setQuery}
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery("")}>
                  <Octicons name="x-circle-fill" size={18} color="#b7b7b8" />
                </Pressable>
              )}
            </View>
            <Pressable
              className="relative rounded-full bg-white p-4"
              onPress={() => setFilterModalVisible(true)}
            >
              <Octicons name="filter" size={24} color={colors.primary} />
              {hasActiveFilters && (
                <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-accent" />
              )}
            </Pressable>
          </View>
        </View>

        <View className="px-5">
          <FlatList
            className="mt-3"
            horizontal
            showsHorizontalScrollIndicator={false}
            data={FILTERS}
            keyExtractor={(item) => item}
            ItemSeparatorComponent={() => <View className="w-3" />}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setActive(item);
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

          {isLoading ? (
            <ActivityIndicator className="mt-10" color={colors.accent} />
          ) : error ? (
            <Text className="mt-10 text-center text-primary/60">
              Couldn&apos;t load properties: {error}
            </Text>
          ) : homes.length === 0 ? (
            <Text className="mt-10 text-center text-primary/60">
              {query.trim()
                ? "No properties match your search."
                : "No properties in this category yet."}
            </Text>
          ) : (
            homes.map((home) => <PropertyCard key={home.id} home={home} />)
          )}
        </View>
      </ScrollView>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={extraFilters}
        onApply={setExtraFilters}
      />
    </SafeAreaView>
  );
}
