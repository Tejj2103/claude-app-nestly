import { dummyFeaturedProperty, dummyRecommendedProperties } from "./dummy-properties";
import type { Property } from "./types";

/**
 * Dummy-data-backed reads for now. Once a Supabase project is connected
 * (see lib/supabase.ts), swap these bodies for real queries — the return
 * shape stays the same, so screens won't need to change.
 */

export function useFeaturedProperty(): Property {
  return dummyFeaturedProperty;
}

export function useRecommendedProperties(): Property[] {
  return dummyRecommendedProperties;
}
