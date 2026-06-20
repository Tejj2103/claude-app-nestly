import "@/global.css";
import { ClerkLoaded, ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";

import { tokenCache } from "@/lib/auth/token-cache";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { useProfileStore } from "@/lib/store/profile-store";
import { supabase } from "@/lib/supabase";

function RootNavigator() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    useFavoritesStore.getState().init(user.id);
    useProfileStore.getState().init(user.id);

    // Sync username/email from Clerk on every sign-in (not just sign-up) —
    // covers accounts that existed before this sync was added, and keeps
    // our copy from drifting if it's ever changed on Clerk's side. Only
    // touches these two columns; full_name/phone/avatar_url are untouched.
    supabase
      .from("user_profiles")
      .upsert({
        clerk_user_id: user.id,
        username: user.username,
        email: user.primaryEmailAddress?.emailAddress ?? null,
      })
      .then(({ error }) => {
        if (error) console.warn("Failed to sync user profile:", error.message);
        else useProfileStore.getState().init(user.id);
      });
  }, [user?.id]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Protected guard={!!isSignedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="property/[id]" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
