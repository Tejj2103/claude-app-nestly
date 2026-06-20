import { create } from "zustand";

import { supabase } from "@/lib/supabase";

export interface Profile {
  username: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
}

const DEFAULT_PROFILE: Profile = {
  username: "",
  email: "",
  fullName: "",
  phone: "",
  avatarUrl: null,
};

interface UserProfileRow {
  clerk_user_id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

function mapRow(row: UserProfileRow): Profile {
  return {
    username: row.username ?? "",
    email: row.email ?? "",
    fullName: row.full_name ?? "",
    phone: row.phone ?? "",
    avatarUrl: row.avatar_url,
  };
}

type EditableProfile = Pick<Profile, "fullName" | "phone" | "avatarUrl">;

interface ProfileState {
  userId: string | null;
  profile: Profile;
  isLoading: boolean;
  init: (userId: string) => Promise<void>;
  /** Saves immediately (no debounce) — called explicitly from a Save action. */
  updateProfile: (partial: Partial<EditableProfile>) => Promise<{ error: string | null }>;
}

export const useProfileStore = create<ProfileState>()((set, get) => ({
  userId: null,
  profile: DEFAULT_PROFILE,
  isLoading: false,

  init: async (userId) => {
    set({ userId, isLoading: true });

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Failed to load profile:", error.message);
      set({ isLoading: false });
      return;
    }

    set({
      profile: data ? mapRow(data as UserProfileRow) : DEFAULT_PROFILE,
      isLoading: false,
    });
  },

  updateProfile: async (partial) => {
    const { userId, profile } = get();
    if (!userId) return { error: "Not signed in." };

    const nextProfile = { ...profile, ...partial };

    const { error } = await supabase.from("user_profiles").upsert({
      clerk_user_id: userId,
      full_name: nextProfile.fullName || null,
      phone: nextProfile.phone || null,
      avatar_url: nextProfile.avatarUrl,
    });

    if (error) {
      console.warn("Failed to save profile:", error.message);
      return { error: error.message };
    }

    set({ profile: nextProfile });
    return { error: null };
  },
}));
