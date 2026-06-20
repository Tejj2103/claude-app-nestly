import Octicons from "@expo/vector-icons/Octicons";
import { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

import { colors } from "@/constants/theme";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

const SafeAreaView = styled(RNSafeAreaView);

const SLIDES: { icon: keyof typeof Octicons.glyphMap; title: string; description: string }[] = [
  {
    icon: "home",
    title: "Find your next home",
    description: "Browse curated apartments, houses, retail spaces, and rentals in one place.",
  },
  {
    icon: "heart",
    title: "Save your favorites",
    description: "Bookmark properties you love and come back to them anytime.",
  },
  {
    icon: "rocket",
    title: "Get started",
    description: "Create an account to start exploring and save your first favorite.",
  },
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const complete = useOnboardingStore((state) => state.complete);

  const isLastSlide = index === SLIDES.length - 1;

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  const goToSlide = (nextIndex: number) => {
    scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    setIndex(nextIndex);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F2]">
      <View className="flex-row justify-end px-5 pt-5">
        {!isLastSlide && (
          <Pressable onPress={complete}>
            <Text className="font-sans-medium text-primary/60">Skip</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide) => (
          <View key={slide.title} style={{ width }} className="items-center justify-center px-10">
            <View className="h-28 w-28 items-center justify-center rounded-full bg-secondary/40">
              <Octicons name={slide.icon} size={48} color={colors.accent} />
            </View>
            <Text className="mt-10 text-center text-3xl font-sans-bold text-primary">
              {slide.title}
            </Text>
            <Text className="mt-4 text-center font-sans-regular text-primary/60">
              {slide.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row items-center justify-center gap-2 pb-6">
        {SLIDES.map((slide, i) => (
          <View
            key={slide.title}
            className={`h-2 rounded-full ${i === index ? "w-6 bg-accent" : "w-2 bg-secondary"}`}
          />
        ))}
      </View>

      <View className="px-5 pb-8">
        <Pressable
          className="items-center rounded-full bg-accent py-4"
          onPress={() => (isLastSlide ? complete() : goToSlide(index + 1))}
        >
          <Text className="font-sans-bold text-white">
            {isLastSlide ? "Get Started" : "Next"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
