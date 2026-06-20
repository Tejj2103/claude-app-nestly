import { create } from "zustand";

import { supabase } from "@/lib/supabase";

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

interface DeviceProfileRow {
  device_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

function mapRow(row: DeviceProfileRow): Profile {
  return {
    fullName: row.full_name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    avatarUrl: row.avatar_url,
  };
}

interface ProfileState {
  deviceId: string | null;
  profile: Profile;
  isLoading: boolean;
  init: (deviceId: string) => Promise<void>;
  updateProfile: (partial: Partial<Profile>) => Promise<void>;
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
const SAVE_DEBOUNCE_MS = 600;

export const useProfileStore = create<ProfileState>()((set, get) => ({
  deviceId: null,
  profile: DEFAULT_PROFILE,
  isLoading: false,

  init: async (deviceId) => {
    set({ deviceId, isLoading: true });

    const { data, error } = await supabase
      .from("device_profiles")
      .select("*")
      .eq("device_id", deviceId)
      .maybeSingle();

    if (error) {
      console.warn("Failed to load profile:", error.message);
      set({ isLoading: false });
      return;
    }

    set({
      profile: data ? mapRow(data as DeviceProfileRow) : DEFAULT_PROFILE,
      isLoading: false,
    });
  },

  updateProfile: async (partial) => {
    const { deviceId, profile } = get();
    const nextProfile = { ...profile, ...partial };
    set({ profile: nextProfile });

    if (!deviceId) return;

    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      const { error } = await supabase.from("device_profiles").upsert({
        device_id: deviceId,
        full_name: nextProfile.fullName || null,
        email: nextProfile.email || null,
        phone: nextProfile.phone || null,
        avatar_url: nextProfile.avatarUrl,
      });
      if (error) {
        console.warn("Failed to save profile:", error.message);
      }
    }, SAVE_DEBOUNCE_MS);
  },
}));
