import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Profile {
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
}

const DEFAULT_PROFILE: Profile = {
  fullName: "",
  email: "",
  phone: "",
  avatarUrl: null,
};

interface ProfileState {
  profile: Profile;
  updateProfile: (partial: Partial<Profile>) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      updateProfile: (partial) =>
        set((state) => ({ profile: { ...state.profile, ...partial } })),
      resetProfile: () => set({ profile: DEFAULT_PROFILE }),
    }),
    {
      name: "nestly-profile",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
