import { dummyHomes } from "./dummy-properties";
import type { FurnishedStatus, Property, PropertyCategory } from "./types";

export type BhkFilter = "Studio" | "1" | "2" | "3" | "Any";
export type BathroomsFilter = "1" | "2" | "3+" | "Any";
export type SortBy = "price-asc" | "price-desc" | "none";

export interface HomeFilters {
  category?: PropertyCategory | "All";
  query?: string;
  bhk?: BhkFilter;
  furnished?: FurnishedStatus | "Any";
  bathrooms?: BathroomsFilter;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortBy;
}

const BHK_BEDROOMS: Record<Exclude<BhkFilter, "Any">, number> = {
  Studio: 0,
  "1": 1,
  "2": 2,
  "3": 3,
};

/**
 * Dummy-data-backed reads for now. Once a Supabase project is connected
 * (see lib/supabase.ts), swap this body for a real query — the return
 * shape stays the same, so screens won't need to change.
 */
export function useHomes(filters: HomeFilters = {}): Property[] {
  const { category, query, bhk, furnished, bathrooms, minPrice, maxPrice, sortBy } = filters;

  let results =
    !category || category === "All"
      ? dummyHomes
      : dummyHomes.filter((home) => home.category === category);

  if (query?.trim()) {
    const q = query.trim().toLowerCase();
    results = results.filter(
      (home) => home.title.toLowerCase().includes(q) || home.location.toLowerCase().includes(q)
    );
  }

  if (bhk && bhk !== "Any") {
    const bedrooms = BHK_BEDROOMS[bhk];
    results = results.filter((home) => home.bedrooms === bedrooms);
  }

  if (furnished && furnished !== "Any") {
    results = results.filter((home) => home.furnished === furnished);
  }

  if (bathrooms && bathrooms !== "Any") {
    results =
      bathrooms === "3+"
        ? results.filter((home) => (home.bathrooms ?? 0) >= 3)
        : results.filter((home) => home.bathrooms === Number(bathrooms));
  }

  if (minPrice != null) {
    results = results.filter((home) => home.price >= minPrice);
  }
  if (maxPrice != null) {
    results = results.filter((home) => home.price <= maxPrice);
  }

  if (sortBy === "price-asc") {
    results = [...results].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    results = [...results].sort((a, b) => b.price - a.price);
  }

  return results;
}

export function useHome(id: string | undefined): Property | undefined {
  return dummyHomes.find((home) => home.id === id);
}
