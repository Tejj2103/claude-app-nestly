import { create } from "zustand";

import { mapPropertyRow } from "@/lib/data/properties";
import type { Property } from "@/lib/data/types";
import { supabase } from "@/lib/supabase";

interface FavoritesState {
  userId: string | null;
  favoriteIds: string[];
  favoriteProperties: Property[];
  isLoading: boolean;
  isFavorite: (id: string) => boolean;
  init: (userId: string) => Promise<void>;
  toggleFavorite: (propertyId: string) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  userId: null,
  favoriteIds: [],
  favoriteProperties: [],
  isLoading: false,
  isFavorite: (id) => get().favoriteIds.includes(id),

  init: async (userId) => {
    set({ userId, isLoading: true });

    const { data, error } = await supabase
      .from("favorites")
      .select("property_id, properties(*)")
      .eq("clerk_user_id", userId);

    if (error) {
      console.warn("Failed to load favorites:", error.message);
      set({ isLoading: false });
      return;
    }

    const rows = data ?? [];
    set({
      favoriteIds: rows.map((row: any) => row.property_id),
      favoriteProperties: rows
        .filter((row: any) => row.properties)
        .map((row: any) => mapPropertyRow(row.properties)),
      isLoading: false,
    });
  },

  toggleFavorite: async (propertyId) => {
    const { userId, favoriteIds } = get();
    if (!userId) return;

    const wasFavorite = favoriteIds.includes(propertyId);

    set((state) => ({
      favoriteIds: wasFavorite
        ? state.favoriteIds.filter((id) => id !== propertyId)
        : [...state.favoriteIds, propertyId],
    }));

    if (wasFavorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("clerk_user_id", userId)
        .eq("property_id", propertyId);
      if (!error) {
        set((state) => ({
          favoriteProperties: state.favoriteProperties.filter((p) => p.id !== propertyId),
        }));
      }
      return;
    }

    const { error } = await supabase
      .from("favorites")
      .insert({ clerk_user_id: userId, property_id: propertyId });
    if (error) return;

    const { data: row } = await supabase
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .maybeSingle();
    if (row) {
      set((state) => ({
        favoriteProperties: [...state.favoriteProperties, mapPropertyRow(row as any)],
      }));
    }
  },
}));
