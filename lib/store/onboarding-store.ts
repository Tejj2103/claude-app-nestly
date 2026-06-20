import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const HAS_ONBOARDED_KEY = "has-onboarded";

interface OnboardingState {
  /** null = not yet loaded from AsyncStorage. */
  hasOnboarded: boolean | null;
  init: () => Promise<void>;
  complete: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  hasOnboarded: null,

  init: async () => {
    const value = await AsyncStorage.getItem(HAS_ONBOARDED_KEY);
    set({ hasOnboarded: value === "true" });
  },

  complete: async () => {
    await AsyncStorage.setItem(HAS_ONBOARDED_KEY, "true");
    set({ hasOnboarded: true });
  },
}));
