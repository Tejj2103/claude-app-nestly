import { useUser } from "@clerk/expo";
import Octicons from "@expo/vector-icons/Octicons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

import { EnquiryModal } from "@/components/enquiry-modal";
import { VisitModal } from "@/components/visit-modal";
import { colors } from "@/constants/theme";
import { useHome, usePropertyImages } from "@/lib/data/properties";
import type { PropertyImage } from "@/lib/data/types";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { useProfileStore } from "@/lib/store/profile-store";
import { supabase } from "@/lib/supabase";

const SafeAreaView = styled(RNSafeAreaView);

const NA = "N/A";

const STATUS_LABEL: Record<string, string> = {
  available: "Available",
  sold: "Sold",
  rented: "Rented",
  hold: "On Hold",
};

function formatPrice(price: number | null | undefined, isLease: boolean) {
  if (price == null) return NA;
  const formatted = `₹${price.toLocaleString("en-IN")}`;
  return isLease ? `${formatted}/mo` : formatted;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

function formatAvailableFrom(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
  const galleryImages = usePropertyImages(id);
  const isFavorite = useFavoritesStore((state) => (id ? state.isFavorite(id) : false));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const profile = useProfileStore((state) => state.profile);
  const { user } = useUser();

  const [enquiryVisible, setEnquiryVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmitEnquiry = async (values: { fullName: string; phone: string; message: string }) => {
    if (!user?.id || !home) return;

    setSubmitting(true);
    const { error: insertError } = await supabase.from("enquiries").insert({
      property_id: home.id,
      clerk_user_id: user.id,
      full_name: values.fullName || null,
      phone: values.phone || null,
      message: values.message || null,
    });
    setSubmitting(false);

    if (insertError) {
      Alert.alert("Couldn't send request", insertError.message);
      return;
    }

    setEnquiryVisible(false);
    Alert.alert("Request sent", "We'll get back to you soon.");
  };

  const [visitVisible, setVisitVisible] = useState(false);
  const [visitSubmitting, setVisitSubmitting] = useState(false);

  const onSubmitVisit = async (values: { fullName: string; phone: string; date: string; time: string }) => {
    if (!user?.id || !home) return;

    if (!values.date || !values.time) {
      Alert.alert("Missing details", "Please enter a date and time for your visit.");
      return;
    }

    setVisitSubmitting(true);
    const { error: insertError } = await supabase.from("visit_requests").insert({
      property_id: home.id,
      clerk_user_id: user.id,
      full_name: values.fullName || null,
      phone: values.phone || null,
      requested_date: values.date,
      requested_time: values.time,
    });
    setVisitSubmitting(false);

    if (insertError) {
      Alert.alert("Couldn't schedule visit", insertError.message);
      return;
    }

    setVisitVisible(false);
    Alert.alert("Visit requested", "We'll confirm your visit time soon.");
  };

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

  const heroImages: PropertyImage[] =
    galleryImages.length > 0
      ? galleryImages
      : home.imageUrl
        ? [{ id: home.id, imageUrl: home.imageUrl, sortOrder: 0 }]
        : [];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <View className="h-80 w-full">
          {heroImages.length > 0 ? (
            <FlatList
              data={heroImages}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: SCREEN_WIDTH, height: "100%" }}
                />
              )}
            />
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
            <View
              className={`self-start rounded-full px-3 py-1 ${
                home.status === "available" ? "bg-green-100" : "bg-primary/10"
              }`}
            >
              <Text
                className={`text-xs font-sans-medium ${
                  home.status === "available" ? "text-green-700" : "text-primary"
                }`}
              >
                {STATUS_LABEL[home.status] ?? NA}
              </Text>
            </View>
          </View>

          <Text className="text-2xl font-sans-bold text-primary">{home.title || NA}</Text>

          <View className="flex-row items-center gap-2">
            <Octicons name="location" size={16} color={colors.primary} />
            <Text className="font-sans-medium text-primary/70">{home.location || NA}</Text>
          </View>

          <Text className="text-xl font-sans-bold text-accent">
            {formatPrice(home.price, home.category === "Lease")}
          </Text>

          {home.availableFrom && new Date(home.availableFrom) > new Date() && (
            <Text className="font-sans-medium text-primary/60">
              Available from {formatAvailableFrom(home.availableFrom)}
            </Text>
          )}

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

          {home.description && (
            <View className="gap-2">
              <Text className="font-sans-bold text-primary">About this property</Text>
              <Text className="font-sans-regular text-primary/70">{home.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-secondary/30 bg-background px-5 pb-8 pt-4">
        {home.status === "available" ? (
          <View className="flex-row gap-3">
            <Pressable
              className="flex-1 items-center rounded-full bg-accent py-4"
              onPress={() => setEnquiryVisible(true)}
            >
              <Text className="font-sans-bold text-white">Request Enquiry</Text>
            </Pressable>
            <Pressable
              className="flex-1 items-center rounded-full border border-accent py-4"
              onPress={() => setVisitVisible(true)}
            >
              <Text className="font-sans-bold text-accent">Schedule Visit</Text>
            </Pressable>
          </View>
        ) : (
          <View className="items-center rounded-full bg-secondary/40 py-4">
            <Text className="font-sans-bold text-primary/50">
              Not available ({STATUS_LABEL[home.status] ?? NA})
            </Text>
          </View>
        )}
      </View>

      <EnquiryModal
        visible={enquiryVisible}
        onClose={() => setEnquiryVisible(false)}
        defaultFullName={profile.fullName}
        defaultPhone={profile.phone}
        submitting={submitting}
        onSubmit={onSubmitEnquiry}
      />

      <VisitModal
        visible={visitVisible}
        onClose={() => setVisitVisible(false)}
        defaultFullName={profile.fullName}
        defaultPhone={profile.phone}
        submitting={visitSubmitting}
        onSubmit={onSubmitVisit}
      />
    </SafeAreaView>
  );
}
